import React, { ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';

const scanline = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
`;

const flicker = keyframes`
  0% {
    opacity: 0.97;
  }
  5% {
    opacity: 0.95;
  }
  10% {
    opacity: 0.98;
  }
  15% {
    opacity: 0.96;
  }
  20% {
    opacity: 0.97;
  }
  100% {
    opacity: 0.97;
  }
`;

const TerminalWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.textColor};
  font-family: ${props => props.theme.accentFont};
  position: relative;
  overflow: hidden;
  
  /* CRT effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      rgba(18, 16, 16, 0) 50%,
      rgba(0, 0, 0, 0.25) 50%
    );
    background-size: 100% 4px;
    pointer-events: none;
    z-index: 2;
  }
  
  /* Scanline effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      transparent 0%,
      rgba(0, 255, 0, 0.05) 50%,
      transparent 100%
    );
    animation: ${scanline} 8s linear infinite;
    pointer-events: none;
    z-index: 3;
  }
`;

const TerminalScreen = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow-y: auto;
  position: relative;
  z-index: 1;
  animation: ${flicker} 0.15s infinite;
  
  /* CRT glow effect */
  text-shadow: 
    0 0 5px ${props => props.theme.textColor},
    0 0 10px ${props => props.theme.textColor}40;
  
  /* Slight curve effect */
  border-radius: 10px;
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.5);
`;

const TerminalContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

interface TerminalContainerProps {
  children: ReactNode;
}

export const TerminalContainer: React.FC<TerminalContainerProps> = ({ children }) => {
  return (
    <TerminalWrapper>
      <TerminalScreen>
        <TerminalContent>
          {children}
        </TerminalContent>
      </TerminalScreen>
    </TerminalWrapper>
  );
};
