import React from 'react';
import styled from 'styled-components';
import { Thread } from '../../types';
import { ASCIIBorder } from '../Theme/ASCIIBorder';

const BoardViewWrapper = styled.div`
  margin: 20px 0;
`;

const BoardHeader = styled.div`
  margin-bottom: 20px;
`;

const BoardTitle = styled.h2`
  font-family: ${props => props.theme.primaryFont};
  color: ${props => props.theme.accentColor};
  font-size: 24px;
  text-align: center;
  margin-bottom: 10px;
`;

const ThreadList = styled.div`
  margin-top: 20px;
`;

const ThreadItem = styled.div`
  padding: 15px;
  margin: 10px 0;
  border: 1px solid ${props => props.theme.textColor}40;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.accentColor};
    background-color: ${props => props.theme.textColor}10;
    transform: translateX(5px);
  }
`;

const ThreadTitle = styled.div`
  font-family: ${props => props.theme.accentFont};
  color: ${props => props.theme.textColor};
  font-size: 16px;
  margin-bottom: 8px;
  
  ${ThreadItem}:hover & {
    color: ${props => props.theme.accentColor};
  }
`;

const ThreadMeta = styled.div`
  font-family: 'Courier New', monospace;
  color: ${props => props.theme.textColor}80;
  font-size: 12px;
  display: flex;
  gap: 15px;
`;

const PinnedBadge = styled.span`
  color: ${props => props.theme.accentColor};
  font-weight: bold;
`;

const ResurrectedBadge = styled.span`
  color: #ff00ff;
  font-weight: bold;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.textColor}80;
  font-family: ${props => props.theme.accentFont};
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  color: #fff;
  padding: 8px 16px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.85em;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  margin-bottom: 20px;
  position: relative;
  transition: all 0.3s ease;
  
  &::before {
    content: '[';
    position: absolute;
    left: -8px;
    color: rgba(255, 255, 255, 0.4);
    transition: all 0.3s ease;
  }
  
  &::after {
    content: ']';
    position: absolute;
    right: -8px;
    color: rgba(255, 255, 255, 0.4);
    transition: all 0.3s ease;
  }
  
  &:hover {
    color: #ff3366;
    border-bottom-color: #ff3366;
    
    &::before,
    &::after {
      color: #ff3366;
    }
    
    &::before {
      left: -12px;
    }
    
    &::after {
      right: -12px;
    }
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const NewThreadButton = styled(BackButton)`
  float: right;
  color: #ff3366;
  border-bottom-color: rgba(255, 51, 102, 0.5);
  
  &::before,
  &::after {
    color: rgba(255, 51, 102, 0.6);
  }
  
  &:hover {
    color: #ff6699;
    border-bottom-color: #ff6699;
    text-shadow: 0 0 10px rgba(255, 51, 102, 0.5);
    
    &::before,
    &::after {
      color: #ff6699;
    }
  }
`;

interface BoardViewProps {
  boardId: string;
  boardName: string;
  threads: Thread[];
  onThreadSelect: (threadId: string) => void;
  onBack: () => void;
  onNewThread: () => void;
}

export const BoardView: React.FC<BoardViewProps> = ({
  boardId,
  boardName,
  threads,
  onThreadSelect,
  onBack,
  onNewThread,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <BoardViewWrapper>
      <BoardHeader>
        <BackButton onClick={onBack}>← Back to Boards</BackButton>
        <NewThreadButton onClick={onNewThread}>+ New Thread</NewThreadButton>
        <div style={{ clear: 'both' }} />
      </BoardHeader>

      <ASCIIBorder borderType="double" cornerChar="💀">
        <BoardTitle>/{boardId} - {boardName}</BoardTitle>
      </ASCIIBorder>

      <ThreadList>
        {threads.length === 0 ? (
          <ASCIIBorder borderType="dashed" cornerChar="👻">
            <EmptyState>
              No threads yet... This board is eerily quiet.
              <br />
              Be the first to post from beyond!
            </EmptyState>
          </ASCIIBorder>
        ) : (
          threads.map((thread) => (
            <ThreadItem
              key={thread.id}
              onClick={() => onThreadSelect(thread.id)}
            >
              <ThreadTitle>
                {thread.isPinned && <PinnedBadge>📌 [PINNED] </PinnedBadge>}
                {thread.isResurrected && <ResurrectedBadge>🧟 [RESURRECTED] </ResurrectedBadge>}
                {thread.title}
                {thread.isLocked && ' 🔒'}
              </ThreadTitle>
              <ThreadMeta>
                <span>💬 {thread.postCount} replies</span>
                <span>📅 {formatDate(thread.createdAt)}</span>
                <span>🔄 Updated: {formatDate(thread.updatedAt)}</span>
              </ThreadMeta>
            </ThreadItem>
          ))
        )}
      </ThreadList>
    </BoardViewWrapper>
  );
};
