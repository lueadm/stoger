import mongoose, { Schema, Document } from 'mongoose';

export interface IChapter {
  id: string;
  title: string;
  content: string;
  order: number;
  metadata?: {
    wordCount?: number;
    readingTime?: number;
    tags?: string[];
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IStory extends Document {
  title: string;
  summary: string;
  chapters: IChapter[];
  authorId: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChapterSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  order: { type: Number, required: true },
  metadata: {
    wordCount: { type: Number },
    readingTime: { type: Number },
    tags: [{ type: String }],
    notes: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const StorySchema = new Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  chapters: [ChapterSchema],
  authorId: { type: String, required: true },
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for performance
StorySchema.index({ authorId: 1 });
StorySchema.index({ published: 1 });
StorySchema.index({ createdAt: -1 });
StorySchema.index({ authorId: 1, published: 1 });

export default mongoose.model<IStory>('Story', StorySchema);
