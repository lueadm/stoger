import OpenAI from 'openai';

// Types for AI service
export interface ChapterOutline {
  id: string;
  title: string;
  order: number;
}

export interface GeneratedChapter {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface StoryGeneration {
  title: string;
  chapters: GeneratedChapter[];
}

export interface AIServiceConfig {
  apiKey: string;
  model: string;
  maxRetries?: number;
  timeout?: number;
}

export class AIService {
  private client: OpenAI;
  private model: string;
  private maxRetries: number;
  private requestCount: Map<string, { count: number; resetTime: number }>;
  private readonly RATE_LIMIT_WINDOW = 60000; // 1 minute
  private readonly MAX_REQUESTS_PER_WINDOW = 10;

  constructor(config: AIServiceConfig) {
    if (!config.apiKey) {
      throw new Error('AI_API_KEY is required');
    }

    this.client = new OpenAI({
      apiKey: config.apiKey,
      timeout: config.timeout || 60000,
      maxRetries: config.maxRetries || 2
    });
    
    this.model = config.model || 'gpt-4';
    this.maxRetries = config.maxRetries || 2;
    this.requestCount = new Map();
  }

  /**
   * Check rate limit for a given identifier (e.g., user ID or IP)
   */
  private checkRateLimit(identifier: string): boolean {
    const now = Date.now();
    const userLimit = this.requestCount.get(identifier);

    if (!userLimit) {
      this.requestCount.set(identifier, { count: 1, resetTime: now + this.RATE_LIMIT_WINDOW });
      return true;
    }

    if (now > userLimit.resetTime) {
      // Reset the window
      this.requestCount.set(identifier, { count: 1, resetTime: now + this.RATE_LIMIT_WINDOW });
      return true;
    }

    if (userLimit.count >= this.MAX_REQUESTS_PER_WINDOW) {
      return false;
    }

    userLimit.count++;
    return true;
  }

  /**
   * Get time until rate limit resets for a given identifier
   */
  public getRateLimitResetTime(identifier: string): number {
    const userLimit = this.requestCount.get(identifier);
    if (!userLimit) return 0;
    
    const now = Date.now();
    return Math.max(0, userLimit.resetTime - now);
  }

  /**
   * Generate a story title from a summary
   */
  async generateTitle(summary: string, userId?: string): Promise<string> {
    const identifier = userId || 'anonymous';
    
    if (!this.checkRateLimit(identifier)) {
      const resetTime = this.getRateLimitResetTime(identifier);
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(resetTime / 1000)} seconds`);
    }

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a creative writer specializing in creating engaging story titles. Generate a single compelling title based on the story summary provided. Return only the title, nothing else.'
          },
          {
            role: 'user',
            content: `Create a captivating title for a story with this summary:\n\n${summary}`
          }
        ],
        max_tokens: 50,
        temperature: 0.8
      });

      const title = response.choices[0]?.message?.content?.trim();
      if (!title) {
        throw new Error('Failed to generate title');
      }

      return title;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`AI title generation failed: ${error.message}`);
      }
      throw new Error('AI title generation failed: Unknown error');
    }
  }

  /**
   * Generate chapter outlines from a story summary and title
   */
  async generateChapterOutlines(
    summary: string,
    title: string,
    numberOfChapters: number = 5,
    userId?: string
  ): Promise<ChapterOutline[]> {
    const identifier = userId || 'anonymous';
    
    if (!this.checkRateLimit(identifier)) {
      const resetTime = this.getRateLimitResetTime(identifier);
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(resetTime / 1000)} seconds`);
    }

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a creative writer specializing in story structure. Generate chapter titles that form a coherent story arc. Return the response as a JSON array of objects with "title" property only, nothing else. Example: [{"title": "Chapter 1: The Beginning"}, {"title": "Chapter 2: The Journey"}]'
          },
          {
            role: 'user',
            content: `Create ${numberOfChapters} chapter titles for a story titled "${title}" with this summary:\n\n${summary}\n\nReturn as JSON array.`
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) {
        throw new Error('Failed to generate chapter outlines');
      }

      // Parse the JSON response
      const parsed = JSON.parse(content);
      const chapters = parsed.chapters || parsed;
      
      if (!Array.isArray(chapters)) {
        throw new Error('Invalid response format from AI');
      }

      return chapters.map((chapter: { title: string }, index: number) => ({
        id: `chapter-${index + 1}`,
        title: chapter.title,
        order: index + 1
      }));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`AI chapter outline generation failed: ${error.message}`);
      }
      throw new Error('AI chapter outline generation failed: Unknown error');
    }
  }

  /**
   * Generate content for a specific chapter
   */
  async generateChapterContent(
    storyTitle: string,
    storySummary: string,
    chapterTitle: string,
    chapterOrder: number,
    previousChapters: string[] = [],
    userId?: string
  ): Promise<string> {
    const identifier = userId || 'anonymous';
    
    if (!this.checkRateLimit(identifier)) {
      const resetTime = this.getRateLimitResetTime(identifier);
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(resetTime / 1000)} seconds`);
    }

    try {
      let contextMessage = `Write chapter ${chapterOrder} titled "${chapterTitle}" for the story "${storyTitle}".\n\nStory summary: ${storySummary}`;
      
      if (previousChapters.length > 0) {
        contextMessage += '\n\nPrevious chapters summary:\n' + 
          previousChapters.map((ch, i) => `Chapter ${i + 1}: ${ch.substring(0, 200)}...`).join('\n');
      }

      contextMessage += '\n\nWrite a complete, engaging chapter with vivid descriptions and dialogue. Aim for around 800-1200 words.';

      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a creative fiction writer. Write engaging, well-structured story chapters with vivid descriptions, compelling dialogue, and strong narrative flow. Maintain consistency with the story summary and previous chapters.'
          },
          {
            role: 'user',
            content: contextMessage
          }
        ],
        max_tokens: 2000,
        temperature: 0.8
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) {
        throw new Error('Failed to generate chapter content');
      }

      return content;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`AI chapter content generation failed: ${error.message}`);
      }
      throw new Error('AI chapter content generation failed: Unknown error');
    }
  }

  /**
   * Regenerate a chapter based on user feedback
   */
  async regenerateChapter(
    storyTitle: string,
    storySummary: string,
    chapterTitle: string,
    currentContent: string,
    feedback: string,
    userId?: string
  ): Promise<string> {
    const identifier = userId || 'anonymous';
    
    if (!this.checkRateLimit(identifier)) {
      const resetTime = this.getRateLimitResetTime(identifier);
      throw new Error(`Rate limit exceeded. Try again in ${Math.ceil(resetTime / 1000)} seconds`);
    }

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a creative fiction writer. Revise story chapters based on user feedback while maintaining the overall story consistency and quality. Keep the chapter structure but improve based on the feedback provided.'
          },
          {
            role: 'user',
            content: `Story: "${storyTitle}"\nSummary: ${storySummary}\n\nChapter: "${chapterTitle}"\n\nCurrent content:\n${currentContent}\n\nUser feedback: ${feedback}\n\nRewrite this chapter incorporating the feedback. Maintain the chapter's core purpose in the story but address the user's concerns.`
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      });

      const content = response.choices[0]?.message?.content?.trim();
      if (!content) {
        throw new Error('Failed to regenerate chapter');
      }

      return content;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`AI chapter regeneration failed: ${error.message}`);
      }
      throw new Error('AI chapter regeneration failed: Unknown error');
    }
  }

  /**
   * Generate a complete story from a summary
   */
  async generateStory(
    summary: string,
    numberOfChapters: number = 5,
    userId?: string
  ): Promise<StoryGeneration> {
    try {
      // Step 1: Generate title
      const title = await this.generateTitle(summary, userId);

      // Step 2: Generate chapter outlines
      const outlines = await this.generateChapterOutlines(summary, title, numberOfChapters, userId);

      // Step 3: Generate content for each chapter
      const chapters: GeneratedChapter[] = [];
      const previousContents: string[] = [];

      for (const outline of outlines) {
        const content = await this.generateChapterContent(
          title,
          summary,
          outline.title,
          outline.order,
          previousContents,
          userId
        );

        chapters.push({
          id: outline.id,
          title: outline.title,
          content,
          order: outline.order
        });

        previousContents.push(content);
      }

      return { title, chapters };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Story generation failed: ${error.message}`);
      }
      throw new Error('Story generation failed: Unknown error');
    }
  }
}

// Export a singleton instance
let aiServiceInstance: AIService | null = null;

export const getAIService = (): AIService => {
  if (!aiServiceInstance) {
    const apiKey = process.env.AI_API_KEY;
    const model = process.env.AI_MODEL || 'gpt-4';

    if (!apiKey) {
      throw new Error('AI_API_KEY environment variable is required');
    }

    aiServiceInstance = new AIService({
      apiKey,
      model,
      maxRetries: 2,
      timeout: 60000
    });
  }

  return aiServiceInstance;
};
