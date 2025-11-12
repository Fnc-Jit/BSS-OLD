import React from 'react';
import styled from 'styled-components';
import { Thread, Post } from '../../types';
import { ASCIIBorder } from '../Theme/ASCIIBorder';

const ThreadViewWrapper = styled.div`
  margin: 20px 0;
`;

const ThreadHeader = styled.div`
  margin-bottom: 20px;
`;

const ThreadTitle = styled.h2`
  font-family: ${props => props.theme.primaryFont};
  color: ${props => props.theme.accentColor};
  font-size: 24px;
  margin-bottom: 10px;
`;

const ThreadMeta = styled.div`
  font-family: 'Courier New', monospace;
  color: ${props => props.theme.textColor}80;
  font-size: 12px;
  margin-top: 10px;
`;

const PostList = styled.div`
  margin-top: 20px;
`;

const PostItem = styled.div<{ isBot: boolean }>`
  margin: 15px 0;
  padding: 15px;
  border-left: 3px solid ${props => props.isBot ? props.theme.accentColor : props.theme.textColor + '40'};
  background-color: ${props => props.isBot ? props.theme.accentColor + '10' : 'transparent'};
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid ${props => props.theme.textColor}20;
`;

const PostAuthor = styled.span<{ isBot: boolean }>`
  font-family: ${props => props.theme.accentFont};
  color: ${props => props.isBot ? props.theme.accentColor : props.theme.textColor};
  font-weight: bold;
`;

const PostDate = styled.span`
  font-family: 'Courier New', monospace;
  color: ${props => props.theme.textColor}60;
  font-size: 12px;
`;

const PostContent = styled.div`
  font-family: ${props => props.theme.accentFont};
  color: ${props => props.theme.textColor};
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const ASCIIArt = styled.pre`
  font-family: 'Courier New', monospace;
  color: ${props => props.theme.accentColor};
  font-size: 10px;
  line-height: 1.2;
  margin: 10px 0;
  overflow-x: auto;
`;

const BotBadge = styled.span`
  background-color: ${props => props.theme.accentColor};
  color: ${props => props.theme.backgroundColor};
  padding: 2px 8px;
  border-radius: 3px;
  font-size: 10px;
  margin-left: 10px;
  font-weight: bold;
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

const LockedMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: ${props => props.theme.accentColor};
  font-family: ${props => props.theme.accentFont};
  border: 2px dashed ${props => props.theme.accentColor};
  margin: 20px 0;
`;

interface ThreadViewProps {
  thread: Thread;
  posts: Post[];
  onBack: () => void;
  onReply?: () => void;
}

export const ThreadView: React.FC<ThreadViewProps> = ({
  thread,
  posts,
  onBack,
  onReply,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getBotIcon = (botType?: string) => {
    switch (botType) {
      case 'news':
        return '📰';
      case 'haunt':
        return '👻';
      case 'mod':
        return '🛡️';
      default:
        return '🤖';
    }
  };

  return (
    <ThreadViewWrapper>
      <ThreadHeader>
        <BackButton onClick={onBack}>← Back to Board</BackButton>
      </ThreadHeader>

      <ASCIIBorder borderType="double" cornerChar="💀">
        <ThreadTitle>
          {thread.isPinned && '📌 '}
          {thread.isResurrected && '🧟 '}
          {thread.title}
          {thread.isLocked && ' 🔒'}
        </ThreadTitle>
        <ThreadMeta>
          📅 Created: {formatDate(thread.createdAt)} | 
          🔄 Updated: {formatDate(thread.updatedAt)} | 
          💬 {thread.postCount} replies
        </ThreadMeta>
      </ASCIIBorder>

      <PostList>
        {posts.map((post, index) => (
          <PostItem key={post.id} isBot={post.isBot}>
            <PostHeader>
              <PostAuthor isBot={post.isBot}>
                {post.isBot ? (
                  <>
                    {getBotIcon(post.botType)} {post.botType?.toUpperCase()}_BOT
                    <BotBadge>BOT</BotBadge>
                  </>
                ) : (
                  <>👤 User #{post.authorId.slice(0, 8)}</>
                )}
                {index === 0 && ' (OP)'}
              </PostAuthor>
              <PostDate>{formatDate(post.createdAt)}</PostDate>
            </PostHeader>
            <PostContent>{post.content}</PostContent>
            {post.asciiArt && (
              <ASCIIArt>{post.asciiArt}</ASCIIArt>
            )}
          </PostItem>
        ))}
      </PostList>

      {thread.isLocked ? (
        <LockedMessage>
          🔒 This thread has been locked. No more replies allowed.
        </LockedMessage>
      ) : onReply && (
        <BackButton onClick={onReply} style={{ float: 'right' }}>
          💬 Reply to Thread
        </BackButton>
      )}
    </ThreadViewWrapper>
  );
};
