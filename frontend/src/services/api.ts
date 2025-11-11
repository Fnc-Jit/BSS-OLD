import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add auth token to requests if available
api.interceptors.request.use((config: any) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const appError = handleApiError(error);
    console.error('API Error:', appError);
    return Promise.reject(appError);
  }
);

// API endpoints
export const apiService = {
  // Health check
  health: () => api.get('/health'),
  
  // Boards
  getBoards: () => api.get('/api/boards'),
  getBoard: (boardId: string) => api.get(`/api/boards/${boardId}`),
  getBoardThreads: (boardId: string, skip = 0, limit = 50) => 
    api.get(`/api/boards/${boardId}/threads`, { params: { skip, limit } }),
  
  // Threads
  getThread: (threadId: string) => api.get(`/api/threads/${threadId}`),
  createThread: (data: { board_id: string; title: string; content: string }) => 
    api.post('/api/threads', data),
  
  // Posts
  getThreadPosts: (threadId: string, skip = 0, limit = 100) => 
    api.get(`/api/threads/${threadId}/posts`, { params: { skip, limit } }),
  createPost: (data: { thread_id: string; content: string; ascii_art?: string }) => 
    api.post(`/api/threads/${data.thread_id}/posts`, data),
  
  // Auth
  register: (data: { username: string; email: string; password: string }) => 
    api.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) => 
    api.post('/api/auth/login', data),
  logout: () => api.post('/api/auth/logout'),
  getCurrentUser: () => api.get('/api/auth/me'),
  
  // Commands
  executeCommand: (data: { command: string; args: string[] }) => 
    api.post('/api/commands/execute', data),
};
