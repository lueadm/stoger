import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { apiLimiter, storyGenerationLimiter } from '../middleware/rate-limit.middleware';
import {
  generateStory,
  getAllStories,
  getStoryById,
  updateStory,
  deleteStory,
  getChapters,
  updateChapter,
  regenerateChapter,
  deleteChapter,
  publishStory
} from '../controllers/story.controller';

const router = Router();

// Apply general API rate limiting to all routes
router.use(apiLimiter);

// POST /api/stories/generate - Generate story from summary (requires auth, stricter rate limit)
router.post('/generate', storyGenerationLimiter, authenticateToken, generateStory);

// GET /api/stories - Get all stories (optional auth)
router.get('/', getAllStories);

// GET /api/stories/:id - Get specific story (optional auth)
router.get('/:id', getStoryById);

// PUT /api/stories/:id - Update story metadata (requires auth)
router.put('/:id', authenticateToken, updateStory);

// DELETE /api/stories/:id - Delete story (requires auth)
router.delete('/:id', authenticateToken, deleteStory);

// GET /api/stories/:id/chapters - Get all chapters (optional auth)
router.get('/:id/chapters', getChapters);

// PUT /api/stories/:id/chapters/:chapterId - Update chapter (requires auth)
router.put('/:id/chapters/:chapterId', authenticateToken, updateChapter);

// POST /api/stories/:id/chapters/:chapterId/regenerate - Regenerate chapter with AI (requires auth, stricter rate limit)
router.post('/:id/chapters/:chapterId/regenerate', storyGenerationLimiter, authenticateToken, regenerateChapter);

// DELETE /api/stories/:id/chapters/:chapterId - Delete chapter (requires auth)
router.delete('/:id/chapters/:chapterId', authenticateToken, deleteChapter);

// POST /api/stories/:id/publish - Publish story (requires auth)
router.post('/:id/publish', authenticateToken, publishStory);

export default router;
