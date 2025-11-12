import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Board } from '../../types';

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const glitchSkew = keyframes`
  0%, 100% {
    transform: skew(0deg);
  }
  20% {
    transform: skew(-2deg);
  }
  40% {
    transform: skew(2deg);
  }
  60% {
    transform: skew(-1deg);
  }
  80% {
    transform: skew(1deg);
  }
`;

const BoardListWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  padding: 40px 20px;
  min-height: 70vh;
  align-items: center;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const SkullContainer = styled.div`
  width: 280px;
  height: 280px;
  position: relative;
  animation: ${float} 6s ease-in-out infinite;
  background: radial-gradient(circle, rgba(255, 51, 102, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  
  /* Chrome skull placeholder - replace with actual image */
  &::before {
    content: '💀';
    font-size: 180px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    filter: 
      grayscale(1) 
      contrast(1.8) 
      brightness(1.4)
      drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))
      drop-shadow(0 0 40px rgba(255, 51, 102, 0.4));
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border: 1px solid rgba(255, 51, 102, 0.2);
    border-radius: 50%;
    animation: ${float} 8s ease-in-out infinite reverse;
  }
`;

const WelcomeText = styled.div`
  margin-top: 40px;
  text-align: center;
  font-family: 'Share Tech Mono', monospace;
  color: #888;
  font-size: 0.95em;
  line-height: 2;
  
  .highlight {
    color: #ff3366;
    font-weight: bold;
    text-shadow: 0 0 8px rgba(255, 51, 102, 0.4);
  }
`;

const SystemInfo = styled.div`
  margin-top: 25px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(5px);
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8em;
  color: #666;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
  
  div {
    margin: 6px 0;
    
    &::before {
      content: '▸';
      color: #ff3366;
      margin-right: 8px;
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionTitle = styled.h2`
  font-family: 'Rajdhani', sans-serif;
  font-size: 2em;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 10px;
  
  span {
    color: #ff3366;
    animation: ${glitchSkew} 3s infinite;
    display: inline-block;
  }
`;

const Subtitle = styled.div`
  font-family: 'Share Tech Mono', monospace;
  color: #666;
  font-size: 0.85em;
  margin-bottom: 30px;
  letter-spacing: 2px;
`;

const BoardGrid = styled.div`
  display: grid;
  gap: 15px;
`;

const BoardCard = styled.div`
  background: rgba(15, 15, 15, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 30px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 51, 102, 0.05) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  
  &:hover {
    border-color: rgba(255, 51, 102, 0.3);
    box-shadow: 
      0 8px 40px rgba(0, 0, 0, 0.4),
      0 0 30px rgba(255, 51, 102, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
    background: rgba(20, 15, 18, 0.98);
    
    &::before {
      opacity: 1;
    }
  }
`;

const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const BoardName = styled.div`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.6em;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
`;

const BoardIcon = styled.div`
  font-size: 2em;
  opacity: 0.6;
  filter: drop-shadow(0 0 8px rgba(255, 51, 102, 0.3));
`;

const BoardPath = styled.div`
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.85em;
  color: #ff3366;
  margin-bottom: 12px;
  opacity: 0.8;
`;

const BoardDescription = styled.div`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.1em;
  color: #ccc;
  line-height: 1.7;
  margin-bottom: 20px;
`;

const BoardStats = styled.div`
  display: flex;
  gap: 25px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8em;
  color: #888;
  
  div {
    position: relative;
    
    &::before {
      content: '▸';
      color: #ff3366;
      margin-right: 6px;
    }
  }
`;

interface BoardListProps {
  boards: Board[];
  onBoardSelect: (boardId: string) => void;
}

export const BoardList: React.FC<BoardListProps> = ({ boards, onBoardSelect }) => {
  const getBoardIcon = (boardId: string) => {
    switch (boardId) {
      case 'crypt':
        return '⚰️';
      case 'parlor':
        return '🕯️';
      case 'comedy-night':
        return '🎭';
      default:
        return '💀';
    }
  };

  return (
    <BoardListWrapper>
      <LeftSection>
        <SkullContainer />
        <WelcomeText>
          <div>// <span className="highlight">NEO-BBS</span> NETWORK</div>
          <div>// SECURE CONNECTION</div>
          <div>// SELECT DESTINATION</div>
        </WelcomeText>
        <SystemInfo>
          <div>→ SYSTEM STATUS: ONLINE</div>
          <div>→ ACTIVE NODES: {boards.length}</div>
          <div>→ ENCRYPTION: ENABLED</div>
        </SystemInfo>
      </LeftSection>

      <RightSection>
        <SectionTitle>
          B<span>O</span>ARDS
        </SectionTitle>
        <Subtitle>// SELECT_YOUR_DESTINATION</Subtitle>
        
        <BoardGrid>
          {boards.map((board) => (
            <BoardCard 
              key={board.id} 
              onClick={() => onBoardSelect(board.id)}
            >
              <BoardHeader>
                <BoardName>{board.displayName}</BoardName>
                <BoardIcon>{getBoardIcon(board.id)}</BoardIcon>
              </BoardHeader>
              <BoardPath>/{board.name}</BoardPath>
              <BoardDescription>{board.description}</BoardDescription>
              <BoardStats>
                <div>THREADS: --</div>
                <div>ACTIVE: --</div>
                <div>STATUS: ONLINE</div>
              </BoardStats>
            </BoardCard>
          ))}
        </BoardGrid>
      </RightSection>
    </BoardListWrapper>
  );
};
