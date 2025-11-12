import React, { useState } from 'react';
import { ThemeProvider, useTheme } from './components/Theme/ThemeProvider';
import { TerminalContainer } from './components/Terminal/TerminalContainer';
import { BootSequence } from './components/Terminal/BootSequence';
import { ASCIIHeader } from './components/Theme/ASCIIHeader';
import { BoardList } from './components/Board/BoardList';
import { BoardView } from './components/Board/BoardView';
import { ThreadView } from './components/Thread/ThreadView';
import { NewThreadForm } from './components/Thread/NewThreadForm';
import { ReplyForm } from './components/Thread/ReplyForm';
import { GlobalStyles } from './styles/GlobalStyles';
import { Board, Thread, Post } from './types';
import { CommandHandler, WelcomeMessage } from './components/Command';
import { ErrorBoundary } from './components/Error';
import { AdminPanel } from './components/Admin/AdminPanel';
import { LoginForm } from './components/Auth/LoginForm';

// Mock data for demonstration
const mockBoards: Board[] = [
  {
    id: 'crypt',
    name: 'crypt',
    displayName: 'The Crypt',
    description: 'Where threads rest... eternally',
    themeConfig: {
      boardId: 'crypt',
      primaryFont: 'Creepster',
      accentFont: 'Courier New',
      backgroundColor: '#0a0a0a',
      textColor: '#00ff00',
      accentColor: '#ff0000',
      borderStyle: 'double',
      asciiArt: ''
    }
  },
  {
    id: 'parlor',
    name: 'parlor',
    displayName: 'The Parlor',
    description: 'Spirits gather for conversation',
    themeConfig: {
      boardId: 'parlor',
      primaryFont: 'Courier New',
      accentFont: 'Courier New',
      backgroundColor: '#0f0f0f',
      textColor: '#00ff00',
      accentColor: '#ffaa00',
      borderStyle: 'solid',
      asciiArt: ''
    }
  },
  {
    id: 'comedy-night',
    name: 'comedy-night',
    displayName: 'Comedy Night',
    description: 'Where dead jokes come to life!',
    themeConfig: {
      boardId: 'comedy-night',
      primaryFont: 'Press Start 2P',
      accentFont: 'Courier New',
      backgroundColor: '#000000',
      textColor: '#00ff00',
      accentColor: '#ff00ff',
      borderStyle: 'dashed',
      asciiArt: ''
    }
  }
];

const mockThreads: Thread[] = [
  {
    id: '1',
    boardId: 'crypt',
    authorId: 'user1',
    title: 'Welcome to the Crypt',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isLocked: false,
    isPinned: true,
    isResurrected: false,
    postCount: 5
  },
  {
    id: '2',
    boardId: 'crypt',
    authorId: 'user2',
    title: 'Has anyone seen my soul?',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    isLocked: false,
    isPinned: false,
    isResurrected: true,
    postCount: 12
  }
];

const mockPosts: Post[] = [
  {
    id: '1',
    threadId: '1',
    authorId: 'user1',
    content: 'Welcome to the Crypt, where all threads eventually rest. Feel free to discuss anything related to the afterlife, hauntings, or general spooky topics.',
    createdAt: new Date().toISOString(),
    isBot: false,
    botType: undefined,
    asciiArt: undefined
  },
  {
    id: '2',
    threadId: '1',
    authorId: 'haunt_bot',
    content: 'This thread has been blessed by the HauntBot. May it rest in peace... or pieces. 👻',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    isBot: true,
    botType: 'haunt',
    asciiArt: undefined
  }
];

type View = 'home' | 'board' | 'thread' | 'newThread' | 'reply' | 'admin' | 'login';

function AppContent() {
  const [booting, setBooting] = useState(true);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { setTheme } = useTheme();

  // Check if user is already logged in
  React.useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }
  }, []);

  // Debug logging
  React.useEffect(() => {
    console.log('Current view changed to:', currentView);
  }, [currentView]);

  const handleBootComplete = () => {
    setBooting(false);
  };

  const handleBoardSelect = (boardId: string) => {
    setSelectedBoard(boardId);
    setCurrentView('board');
    setTheme(boardId);
  };

  const handleThreadSelect = (threadId: string) => {
    setSelectedThread(threadId);
    setCurrentView('thread');
  };

  const handleBackToBoards = () => {
    setSelectedBoard(null);
    setCurrentView('home');
    setTheme('default');
  };

  const handleAdminPanel = () => {
    console.log('Setting view to admin');
    setCurrentView('admin');
  };

  const handleLogin = () => {
    setCurrentView('login');
  };

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setCurrentView('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentView('home');
  };

  const handleBackToBoard = () => {
    setSelectedThread(null);
    setCurrentView('board');
  };

  const handleNewThread = () => {
    setCurrentView('newThread');
  };

  const handleReply = () => {
    setCurrentView('reply');
  };

  const handleCancelForm = () => {
    if (currentView === 'newThread') {
      setCurrentView('board');
    } else if (currentView === 'reply') {
      setCurrentView('thread');
    }
  };

  const handleSubmitThread = async (title: string, content: string) => {
    console.log('Creating thread:', { title, content, boardId: selectedBoard });
    // TODO: API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleSubmitReply = async (content: string) => {
    console.log('Creating reply:', { content, threadId: selectedThread });
    // TODO: API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  if (booting) {
    return <BootSequence onComplete={handleBootComplete} />;
  }

  const currentBoard = mockBoards.find(b => b.id === selectedBoard);
  const currentThread = mockThreads.find(t => t.id === selectedThread);
  const boardThreads = mockThreads.filter(t => t.boardId === selectedBoard);

  return (
    <>
      <ASCIIHeader />
      
      {currentView === 'home' && (
        <BoardList boards={mockBoards} onBoardSelect={handleBoardSelect} />
      )}

      {currentView === 'board' && currentBoard && (
        <BoardView
          boardId={currentBoard.id}
          boardName={currentBoard.displayName}
          threads={boardThreads}
          onThreadSelect={handleThreadSelect}
          onBack={handleBackToBoards}
          onNewThread={handleNewThread}
        />
      )}

      {currentView === 'newThread' && selectedBoard && (
        <NewThreadForm
          boardId={selectedBoard}
          onSubmit={handleSubmitThread}
          onCancel={handleCancelForm}
          isAuthenticated={isAuthenticated}
        />
      )}

      {currentView === 'thread' && currentThread && (
        <ThreadView
          thread={currentThread}
          posts={mockPosts}
          onBack={handleBackToBoard}
          onReply={handleReply}
        />
      )}

      {currentView === 'reply' && selectedThread && (
        <ReplyForm
          threadId={selectedThread}
          onSubmit={handleSubmitReply}
          onCancel={handleCancelForm}
          isAuthenticated={isAuthenticated}
        />
      )}

      {currentView === 'admin' && (
        <div style={{ padding: '20px', color: '#00ff00', border: '2px solid #00ff00', margin: '20px' }}>
          <h1>🎃 ADMIN PANEL TEST 🎃</h1>
          <p>If you see this, the view is working!</p>
          <p>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
          <p>User: {currentUser ? currentUser.username : 'None'}</p>
          <AdminPanel />
        </div>
      )}

      {currentView === 'login' && (
        <LoginForm 
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => setCurrentView('home')}
        />
      )}

      {/* Welcome message - only on home page */}
      {currentView === 'home' && <WelcomeMessage />}

      {/* Command system - available on all pages with separate histories */}
      <CommandHandler
        contextKey={
          currentView === 'home' ? 'home' :
          currentView === 'board' ? `board-${selectedBoard}` :
          currentView === 'thread' ? `thread-${selectedThread}` :
          currentView === 'newThread' ? 'newThread' :
          currentView === 'reply' ? 'reply' :
          'default'
        }
        onNavigate={(destination, data) => {
          if (destination === 'home') {
            handleBackToBoards();
          } else if (destination === 'create-thread' && selectedBoard) {
            setCurrentView('newThread');
          } else if (destination === 'thread' && data?.threadId) {
            setSelectedThread(data.threadId);
            setCurrentView('thread');
          } else if (destination === 'news') {
            // Navigate to news board
            handleBoardSelect('news');
          } else if (destination === 'admin') {
            handleAdminPanel();
          } else if (destination === 'login') {
            handleLogin();
          } else if (destination === 'logout') {
            handleLogout();
          }
        }}
        onBack={() => {
          if (currentView === 'thread') {
            handleBackToBoard();
          } else if (currentView === 'board') {
            handleBackToBoards();
          }
        }}
      />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <GlobalStyles />
        <TerminalContainer>
          <AppContent />
        </TerminalContainer>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
