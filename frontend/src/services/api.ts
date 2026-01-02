import axios from 'axios';
import { Story, GenerateStoryRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const storyService = {
  generateStory: async (summary: string): Promise<Story> => {
    const response = await api.post<{ story: Story }>('/stories/generate', { summary });
    return response.data.story;
  },

  getStories: async (): Promise<Story[]> => {
    const response = await api.get<{ stories: Story[] }>('/stories');
    return response.data.stories;
  },

  getStory: async (id: string): Promise<Story> => {
    const response = await api.get<{ story: Story }>(`/stories/${id}`);
    return response.data.story;
  },

  updateChapter: async (storyId: string, chapterId: string, content: string): Promise<void> => {
    await api.put(`/stories/${storyId}/chapters/${chapterId}`, { content });
  },

  regenerateChapter: async (storyId: string, chapterId: string, prompt?: string): Promise<void> => {
    await api.post(`/stories/${storyId}/chapters/${chapterId}/regenerate`, { prompt });
  },

  publishStory: async (id: string): Promise<void> => {
    await api.post(`/stories/${id}/publish`);
  },
};

export default api;
