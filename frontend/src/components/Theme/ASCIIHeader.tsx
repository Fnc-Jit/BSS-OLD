import React from 'react';
import styled from 'styled-components';
import { useTheme } from './ThemeProvider';

const HeaderWrapper = styled.div`
  font-family: 'Courier New', monospace;
  color: ${props => props.theme.textColor};
  white-space: pre;
  font-size: 12px;
  line-height: 1.2;
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 
    0 0 5px ${props => props.theme.accentColor},
    0 0 10px ${props => props.theme.accentColor}40;
`;

const Decoration = styled.div`
  margin: 10px 0;
  font-size: 20px;
  letter-spacing: 10px;
`;

export const ASCIIHeader: React.FC = () => {
  const { theme } = useTheme();

  return (
    <HeaderWrapper>
      {theme.asciiArt || (
        <>
          <Decoration>💀 👻 🧟 ☠️ 🦴</Decoration>
          <div>
{`╔═══════════════════════════════════════════════════════════════════════════╗
║                        NEO-BBS: ASCII FROM THE AFTERLIFE                  ║
║                           Where the dead still post                       ║
╚═══════════════════════════════════════════════════════════════════════════╝`}
          </div>
          <Decoration>💀 👻 🧟 ☠️ 🦴</Decoration>
        </>
      )}
    </HeaderWrapper>
  );
};
