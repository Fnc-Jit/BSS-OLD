export interface ThemeConfig {
  boardId: string;
  primaryFont: string;
  accentFont: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  borderStyle: string;
  asciiArt: string;
}

export interface Board {
  id: string;
  name: string;
  displayName: string;
  description: string;
  themeConfig: ThemeConfig;
}

export interface User {
  id: string;
  username: string;
  role: 'user' | 'admin';
}

export interface Thread {
  id: string;
  boardId: string;
  authorId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  isLocked: boolean;
  isPinned: boolean;
  isResurrected: boolean;
  postCount: number;
}

export interface Post {
  id: string;
  threadId: string;
  authorId: string;
  content: string;
  createdAt: string;
  isBot: boolean;
  botType?: 'news' | 'haunt' | 'mod';
  asciiArt?: string;
}
