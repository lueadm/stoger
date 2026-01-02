import { z } from 'zod';

export const generateStorySchema = z.object({
  summary: z.string()
    .min(50, 'Summary must be at least 50 characters')
    .max(2000, 'Summary must not exceed 2000 characters'),
  numberOfChapters: z.number()
    .int('Number of chapters must be an integer')
    .min(1, 'Must have at least 1 chapter')
    .max(20, 'Cannot exceed 20 chapters')
    .optional()
    .default(5)
});

export const updateChapterSchema = z.object({
  content: z.string()
    .min(1, 'Content cannot be empty')
    .max(50000, 'Content is too long')
});

export const regenerateChapterSchema = z.object({
  feedback: z.string()
    .min(10, 'Feedback must be at least 10 characters')
    .max(1000, 'Feedback must not exceed 1000 characters')
    .optional()
});

export const updateStorySchema = z.object({
  title: z.string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title is too long')
    .optional(),
  summary: z.string()
    .min(50, 'Summary must be at least 50 characters')
    .max(2000, 'Summary must not exceed 2000 characters')
    .optional(),
  published: z.boolean().optional()
});

export type GenerateStoryInput = z.infer<typeof generateStorySchema>;
export type UpdateChapterInput = z.infer<typeof updateChapterSchema>;
export type RegenerateChapterInput = z.infer<typeof regenerateChapterSchema>;
export type UpdateStoryInput = z.infer<typeof updateStorySchema>;
