import React, { ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';

const glitchAnim = keyframes`
  0%, 100% {
    transform: translate(0);
    filter: hue-rotate(0deg);
  }
  20% {
    transform: translate(-1px, 1px);
  }
  40% {
    transform: translate(-1px, -1px);
  }
  60% {
    transform: translate(1px, 1px);
  }
  80% {
    transform: translate(1px, -1px);
  }
`;

const gridMove = keyframes`
  0% {
    transform: perspective(500px) rotateX(60deg) translateY(0);
  }
  100% {
    transform: perspective(500px) rotateX(60deg) translateY(50px);
  }
`;

const TerminalWrapper = styled.div`
  width: 100vw;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  
  /* Grid background */
  &::before {
    content: '';
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 400px;
    background-image: 
      linear-gradient(rgba(255, 51, 102, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 51, 102, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    transform: perspective(500px) rotateX(60deg);
    transform-origin: bottom;
    pointer-events: none;
    z-index: 0;
    animation: ${gridMove} 20s linear infinite;
    opacity: 0.3;
  }
`;

const ChromeFrame = styled.div`
  max-width: 1400px;
  margin: 40px auto;
  padding: 20px;
  position: relative;
  z-index: 2;
  
  /* Chrome border effect */
  border: 2px solid;
  border-image: linear-gradient(
    135deg,
    #666 0%,
    #fff 25%,
    #666 50%,
    #fff 75%,
    #666 100%
  ) 1;
  border-radius: 20px;
  background: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(10px);
  box-shadow: 
    0 0 30px rgba(0, 0, 0, 0.8),
    inset 0 0 30px rgba(0, 0, 0, 0.5),
    0 0 60px rgba(255, 51, 102, 0.1);
  
  /* Inner glow */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 18px;
    padding: 2px;
    background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 0;
  font-family: 'Share Tech Mono', monospace;
  background: rgba(0, 0, 0, 0.3);
`;

const Logo = styled.div`
  font-size: 1em;
  font-weight: 600;
  letter-spacing: 2px;
  color: #999;
  text-transform: uppercase;
  
  span {
    color: #ff3366;
  }
`;

const NavItems = styled.div`
  display: flex;
  gap: 15px;
  font-size: 0.75em;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const NavItem = styled.button`
  background: transparent;
  border: none;
  color: #999;
  padding: 8px 20px;
  padding-bottom: 12px;
  cursor: pointer;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1em;
  font-weight: 700;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  position: relative;
  
  /* Ruler notches at bottom */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 6px;
    background-image: repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.3) 0px,
      rgba(255, 255, 255, 0.3) 1px,
      transparent 1px,
      transparent 8px
    );
  }
  
  &:hover {
    color: #fff;
    
    &::after {
      background-image: repeating-linear-gradient(
        90deg,
        rgba(255, 51, 102, 0.6) 0px,
        rgba(255, 51, 102, 0.6) 1px,
        transparent 1px,
        transparent 8px
      );
    }
  }
  
  &.active {
    color: #ff3366;
    
    &::after {
      background-image: repeating-linear-gradient(
        90deg,
        rgba(255, 51, 102, 0.8) 0px,
        rgba(255, 51, 102, 0.8) 1px,
        transparent 1px,
        transparent 8px
      );
    }
  }
`;

const TerminalContent = styled.div`
  padding: 20px;
  min-height: 60vh;
  position: relative;
  color: #e0e0e0;
  font-family: 'Rajdhani', sans-serif;
`;

const CornerInfo = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75em;
  color: #666;
  text-align: right;
  line-height: 1.6;
  z-index: 10;
  
  div {
    opacity: 0.7;
  }
`;

interface TerminalContainerProps {
  children: ReactNode;
}

export const TerminalContainer: React.FC<TerminalContainerProps> = ({ children }) => {
  return (
    <TerminalWrapper>
      <ChromeFrame>
        <TopBar>
          <Logo>
            NE<span>O</span>-BBS
          </Logo>
          <NavItems>
            <NavItem>THREADS</NavItem>
            <NavItem>GUESTS</NavItem>
            <NavItem>PROFILE</NavItem>
            <NavItem style={{ borderColor: '#ff3366', color: '#ff3366' }}>
              CONTACT
            </NavItem>
          </NavItems>
        </TopBar>
        
        <TerminalContent>
          {children}
        </TerminalContent>
      </ChromeFrame>
      
      <CornerInfo>
        <div>// SYS.ID</div>
        <div>// NETWORK.EXE</div>
        <div>// SESSION.ACTIVE</div>
      </CornerInfo>
    </TerminalWrapper>
  );
};
