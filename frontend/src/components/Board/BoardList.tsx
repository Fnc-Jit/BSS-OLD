import React from 'react';
import styled from 'styled-components';
import { Board } from '../../types';
import { ASCIIBorder } from '../Theme/ASCIIBorder';

const BoardListWrapper = styled.div`
  margin: 20px 0;
`;

const BoardItem = styled.div`
  margin: 15px 0;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(10px);
    
    .board-name {
      color: ${props => props.theme.accentColor};
      text-shadow: 0 0 10px ${props => props.theme.accentColor};
    }
  }
`;

const BoardName = styled.div`
  font-family: ${props => props.theme.primaryFont};
  font-size: 18px;
  color: ${props => props.theme.textColor};
  margin-bottom: 5px;
  transition: all 0.2s ease;
`;

const BoardDescription = styled.div`
  font-family: ${props => props.theme.accentFont};
  font-size: 14px;
  color: ${props => props.theme.textColor}cc;
  padding-left: 20px;
`;

const Title = styled.h2`
  font-family: ${props => props.theme.primaryFont};
  color: ${props => props.theme.accentColor};
  margin-bottom: 20px;
  text-align: center;
  font-size: 24px;
`;

interface BoardListProps {
  boards: Board[];
  onBoardSelect: (boardId: string) => void;
}

export const BoardList: React.FC<BoardListProps> = ({ boards, onBoardSelect }) => {
  const getBoardIcon = (boardId: string) => {
    switch (boardId) {
      case 'crypt':
        return '💀';
      case 'parlor':
        return '👻';
      case 'comedy-night':
        return '🎭';
      default:
        return '🦴';
    }
  };

  return (
    <BoardListWrapper>
      <ASCIIBorder borderType="double" cornerChar="☠️">
        <Title>AVAILABLE BOARDS</Title>
        {boards.map((board) => (
          <BoardItem 
            key={board.id} 
            onClick={() => onBoardSelect(board.id)}
          >
            <BoardName className="board-name">
              {getBoardIcon(board.id)} /{board.name} - {board.displayName}
            </BoardName>
            <BoardDescription>{board.description}</BoardDescription>
          </BoardItem>
        ))}
      </ASCIIBorder>
    </BoardListWrapper>
  );
};
