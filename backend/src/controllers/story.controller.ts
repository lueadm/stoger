import { Request, Response } from 'express';
import { ZodError } from 'zod';
import Story from '../models/Story';
import { getAIService } from '../services/ai.service';
import {
  generateStorySchema,
  updateChapterSchema,
  regenerateChapterSchema,
  updateStorySchema
} from '../validators/story.validator';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Generate a new story from a summary using AI
 */
export const generateStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    
    if (!authReq.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Validate input
    const validatedData = generateStorySchema.parse(req.body);
    const { summary, numberOfChapters } = validatedData;

    // Get AI service
    const aiService = getAIService();

    // Generate story using AI
    const storyGeneration = await aiService.generateStory(
      summary,
      numberOfChapters,
      authReq.user.userId
    );

    // Calculate metadata for each chapter
    const chaptersWithMetadata = storyGeneration.chapters.map((chapter) => {
      const wordCount = chapter.content.split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200); // Assuming 200 words per minute

      return {
        id: chapter.id,
        title: chapter.title,
        content: chapter.content,
        order: chapter.order,
        metadata: {
          wordCount,
          readingTime
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    // Save to database
    const story = new Story({
      title: storyGeneration.title,
      summary,
      chapters: chaptersWithMetadata,
      authorId: authReq.user.userId,
      published: false
    });

    await story.save();

    res.status(201).json({
      message: 'Story generated successfully',
      story: {
        id: story._id,
        title: story.title,
        summary: story.summary,
        chapters: story.chapters,
        authorId: story.authorId,
        published: story.published,
        createdAt: story.createdAt,
        updatedAt: story.updatedAt
      }
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    
    if (error instanceof Error) {
      if (error.message.includes('Rate limit exceeded')) {
        res.status(429).json({ error: error.message });
        return;
      }
      console.error('Story generation error:', error);
      res.status(500).json({ error: error.message });
      return;
    }
    
    res.status(500).json({ error: 'Failed to generate story' });
  }
};

/**
 * Get all stories (only published stories for non-authors)
 */
export const getAllStories = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    if (!userId) {
      // Not authenticated - only show published stories
      const query = { published: true };
      const stories = await Story.find(query).sort({ createdAt: -1 });
      res.json({ stories });
    } else {
      // Authenticated - show published stories OR user's own stories
      const ownStoriesQuery = { authorId: userId };
      const publishedStoriesQuery = { published: true };
      
      const stories = await Story.find({
        $or: [ownStoriesQuery, publishedStoriesQuery]
      }).sort({ createdAt: -1 });
      
      res.json({ stories });
    }
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
};

/**
 * Get a specific story by ID
 */
export const getStoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    const story = await Story.findById(id);

    if (!story) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }

    // Check if user has permission to view
    if (!story.published && story.authorId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json({ story });
  } catch (error) {
    console.error('Get story error:', error);
    res.status(500).json({ error: 'Failed to fetch story' });
  }
};

/**
 * Update story metadata
 */
export const updateStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Validate input
    const validatedData = updateStorySchema.parse(req.body);

    const story = await Story.findById(id);

    if (!story) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }

    // Check if user is the author
    if (story.authorId !== authReq.user.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Prevent editing published stories
    // Authors can only change the published field to unpublish
    // All other edits require the story to be unpublished first
    if (story.published) {
      const isUnpublishing = validatedData.published === false;
      const isEditingContent = validatedData.title !== undefined || validatedData.summary !== undefined;
      
      if (isEditingContent && !isUnpublishing) {
        res.status(403).json({ error: 'Cannot edit published stories. Unpublish the story first.' });
        return;
      }
    }

    // Update fields
    if (validatedData.title !== undefined) {
      story.title = validatedData.title;
    }
    if (validatedData.summary !== undefined) {
      story.summary = validatedData.summary;
    }
    if (validatedData.published !== undefined) {
      story.published = validatedData.published;
    }

    story.updatedAt = new Date();
    await story.save();

    res.json({
      message: 'Story updated successfully',
      story
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Update story error:', error);
    res.status(500).json({ error: 'Failed to update story' });
  }
};

/**
 * Delete a story
 */
export const deleteStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const story = await Story.findById(id);

    if (!story) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }

    // Check if user is the author
    if (story.authorId !== authReq.user.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    await Story.findByIdAndDelete(id);

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ error: 'Failed to delete story' });
  }
};

/**
 * Update a specific chapter
 */
export const updateChapter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, chapterId } = req.params;
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Validate input
    const validatedData = updateChapterSchema.parse(req.body);

    const story = await Story.findById(id);

    if (!story) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }

    // Check if user is the author
    if (story.authorId !== authReq.user.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Prevent editing published stories
    if (story.published) {
      res.status(403).json({ error: 'Cannot edit chapters of published stories. Unpublish the story first.' });
      return;
    }

    // Find and update the chapter
    const chapterIndex = story.chapters.findIndex(ch => ch.id === chapterId);

    if (chapterIndex === -1) {
      res.status(404).json({ error: 'Chapter not found' });
      return;
    }

    story.chapters[chapterIndex].content = validatedData.content;
    story.chapters[chapterIndex].updatedAt = new Date();

    // Update metadata
    const wordCount = validatedData.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    story.chapters[chapterIndex].metadata = {
      ...story.chapters[chapterIndex].metadata,
      wordCount,
      readingTime
    };

    story.updatedAt = new Date();
    await story.save();

    res.json({
      message: 'Chapter updated successfully',
      chapter: story.chapters[chapterIndex]
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Update chapter error:', error);
    res.status(500).json({ error: 'Failed to update chapter' });
  }
};

/**
 * Regenerate a chapter using AI
 */
export const regenerateChapter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, chapterId } = req.params;
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Validate input
    const validatedData = regenerateChapterSchema.parse(req.body);
    const feedback = validatedData.feedback || 'Improve the chapter quality and engagement';

    const story = await Story.findById(id);

    if (!story) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }

    // Check if user is the author
    if (story.authorId !== authReq.user.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Prevent editing published stories
    if (story.published) {
      res.status(403).json({ error: 'Cannot regenerate chapters of published stories. Unpublish the story first.' });
      return;
    }

    // Find the chapter
    const chapterIndex = story.chapters.findIndex(ch => ch.id === chapterId);

    if (chapterIndex === -1) {
      res.status(404).json({ error: 'Chapter not found' });
      return;
    }

    const chapter = story.chapters[chapterIndex];

    // Get AI service and regenerate
    const aiService = getAIService();
    const newContent = await aiService.regenerateChapter(
      story.title,
      story.summary,
      chapter.title,
      chapter.content,
      feedback,
      authReq.user.userId
    );

    // Update the chapter
    story.chapters[chapterIndex].content = newContent;
    story.chapters[chapterIndex].updatedAt = new Date();

    // Update metadata
    const wordCount = newContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    story.chapters[chapterIndex].metadata = {
      ...story.chapters[chapterIndex].metadata,
      wordCount,
      readingTime
    };

    story.updatedAt = new Date();
    await story.save();

    res.json({
      message: 'Chapter regenerated successfully',
      chapter: story.chapters[chapterIndex]
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    
    if (error instanceof Error) {
      if (error.message.includes('Rate limit exceeded')) {
        res.status(429).json({ error: error.message });
        return;
      }
      console.error('Regenerate chapter error:', error);
      res.status(500).json({ error: error.message });
      return;
    }
    
    res.status(500).json({ error: 'Failed to regenerate chapter' });
  }
};

/**
 * Get all chapters for a story
 */
export const getChapters = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;

    const story = await Story.findById(id);

    if (!story) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }

    // Check if user has permission to view
    if (!story.published && story.authorId !== userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json({ chapters: story.chapters });
  } catch (error) {
    console.error('Get chapters error:', error);
    res.status(500).json({ error: 'Failed to fetch chapters' });
  }
};

/**
 * Delete a chapter
 */
export const deleteChapter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, chapterId } = req.params;
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const story = await Story.findById(id);

    if (!story) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }

    // Check if user is the author
    if (story.authorId !== authReq.user.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Prevent editing published stories
    if (story.published) {
      res.status(403).json({ error: 'Cannot delete chapters of published stories. Unpublish the story first.' });
      return;
    }

    // Find and remove the chapter
    const chapterIndex = story.chapters.findIndex(ch => ch.id === chapterId);

    if (chapterIndex === -1) {
      res.status(404).json({ error: 'Chapter not found' });
      return;
    }

    story.chapters.splice(chapterIndex, 1);
    story.updatedAt = new Date();
    await story.save();

    res.json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    console.error('Delete chapter error:', error);
    res.status(500).json({ error: 'Failed to delete chapter' });
  }
};

/**
 * Publish a story
 */
export const publishStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const story = await Story.findById(id);

    if (!story) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }

    // Check if user is the author
    if (story.authorId !== authReq.user.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    story.published = true;
    story.updatedAt = new Date();
    await story.save();

    res.json({
      message: 'Story published successfully',
      story
    });
  } catch (error) {
    console.error('Publish story error:', error);
    res.status(500).json({ error: 'Failed to publish story' });
  }
};

/**
 * Unpublish a story
 */
export const unpublishStory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const authReq = req as AuthRequest;

    if (!authReq.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const story = await Story.findById(id);

    if (!story) {
      res.status(404).json({ error: 'Story not found' });
      return;
    }

    // Check if user is the author
    if (story.authorId !== authReq.user.userId) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    story.published = false;
    story.updatedAt = new Date();
    await story.save();

    res.json({
      message: 'Story unpublished successfully',
      story
    });
  } catch (error) {
    console.error('Unpublish story error:', error);
    res.status(500).json({ error: 'Failed to unpublish story' });
  }
};
