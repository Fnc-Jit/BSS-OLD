import React from 'react';
import styled, { keyframes } from 'styled-components';

const glitch = keyframes`
  0%, 100% {
    transform: translate(0);
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

const HeaderWrapper = styled.div`
  padding: 0;
  margin: 0;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Logo = styled.div`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.1em;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: 12px 20px;
  
  span {
    color: #ff3366;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 15px;
  padding: 12px 20px;
  align-items: center;
`;

const NavButton = styled.button<{ variant?: 'primary' }>`
  background: transparent;
  border: 1px solid ${props => props.variant === 'primary' 
    ? '#ff3366' 
    : 'rgba(255, 255, 255, 0.3)'};
  color: ${props => props.variant === 'primary' ? '#ff3366' : '#fff'};
  padding: 8px 20px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75em;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #ff3366;
    color: #ff3366;
    background: ${props => props.variant === 'primary' 
      ? 'rgba(255, 51, 102, 0.1)' 
      : 'transparent'};
    box-shadow: 0 0 ${props => props.variant === 'primary' ? '15px' : '10px'} rgba(255, 51, 102, 0.3);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

export const ASCIIHeader: React.FC = () => {
  return (
    <HeaderWrapper>
      <Logo>
        NE<span>O</span>-BBS
      </Logo>
      <Nav>
        <NavButton>Threads</NavButton>
        <NavButton>Guests</NavButton>
        <NavButton>Profile</NavButton>
        <NavButton variant="primary">Contact</NavButton>
      </Nav>
    </HeaderWrapper>
  );
};
