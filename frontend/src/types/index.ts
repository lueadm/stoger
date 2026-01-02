export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Story {
  id: string;
  title: string;
  summary: string;
  chapters: Chapter[];
  authorId: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface GenerateStoryRequest {
  summary: string;
}

export interface GenerateStoryResponse {
  story: Story;
}
