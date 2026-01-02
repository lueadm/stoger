import axios from 'axios';
import { Story } from '../types';
import config from '../config';

const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
