import mongoose, { Schema, Document } from 'mongoose';

export interface IChapter {
  id: string;
  title: string;
  content: string;
  order: number;
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

export default mongoose.model<IStory>('Story', StorySchema);
