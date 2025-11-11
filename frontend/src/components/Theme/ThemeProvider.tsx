import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeConfig } from '../../types';

const defaultTheme: ThemeConfig = {
  boardId: 'default',
  primaryFont: "'Courier New', monospace",
  accentFont: "'Courier New', monospace",
  backgroundColor: '#000000',
  textColor: '#00ff00',
  accentColor: '#00cc00',
  borderStyle: 'solid',
  asciiArt: '',
};

const cryptTheme: ThemeConfig = {
  boardId: 'crypt',
  primaryFont: "'Creepster', cursive",
  accentFont: "'Courier New', monospace",
  backgroundColor: '#0a0a0a',
  textColor: '#00ff00',
  accentColor: '#ff0000',
  borderStyle: 'double',
  asciiArt: `
╔═══════════════════════════════════════════════════════════════════════════╗
║                           💀 THE CRYPT 💀                                 ║
║                    Where threads rest... eternally                        ║
╚═══════════════════════════════════════════════════════════════════════════╝`,
};

const parlorTheme: ThemeConfig = {
  boardId: 'parlor',
  primaryFont: "'Courier New', monospace",
  accentFont: "'Courier New', monospace",
  backgroundColor: '#0f0f0f',
  textColor: '#00ff00',
  accentColor: '#ffaa00',
  borderStyle: 'solid',
  asciiArt: `
╔═══════════════════════════════════════════════════════════════════════════╗
║                          👻 THE PARLOR 👻                                 ║
║                    Spirits gather for conversation                        ║
╚═══════════════════════════════════════════════════════════════════════════╝`,
};

const comedyTheme: ThemeConfig = {
  boardId: 'comedy-night',
  primaryFont: "'Press Start 2P', cursive",
  accentFont: "'Courier New', monospace",
  backgroundColor: '#000000',
  textColor: '#00ff00',
  accentColor: '#ff00ff',
  borderStyle: 'dashed',
  asciiArt: `
╔═══════════════════════════════════════════════════════════════════════════╗
║                       🎭 COMEDY NIGHT 🎭                                  ║
║                  Where dead jokes come to life!                           ║
╚═══════════════════════════════════════════════════════════════════════════╝`,
};

interface ThemeContextType {
  theme: ThemeConfig;
  setTheme: (boardId: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeConfig>(defaultTheme);

  const setTheme = (boardId: string) => {
    switch (boardId) {
      case 'crypt':
        setThemeState(cryptTheme);
        break;
      case 'parlor':
        setThemeState(parlorTheme);
        break;
      case 'comedy-night':
        setThemeState(comedyTheme);
        break;
      default:
        setThemeState(defaultTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <StyledThemeProvider theme={theme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
