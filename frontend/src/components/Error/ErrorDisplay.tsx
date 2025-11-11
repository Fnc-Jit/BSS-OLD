import React from 'react';
import styled, { keyframes } from 'styled-components';

const glitch = keyframes`
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  100% {
    transform: translate(0);
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #000000;
  color: #ff0000;
  font-family: 'Courier New', monospace;
  padding: 20px;
  text-align: center;
`;

const ErrorBox = styled.div`
  border: 3px solid #ff0000;
  padding: 40px;
  max-width: 600px;
  background: #0a0a0a;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
  animation: ${glitch} 0.3s infinite;
`;

const ErrorTitle = styled.h1`
  font-size: 32px;
  margin: 0 0 20px 0;
  text-shadow: 2px 2px 4px rgba(255, 0, 0, 0.8);
  letter-spacing: 4px;
`;

const ErrorIcon = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
`;

const ErrorMessage = styled.p`
  font-size: 16px;
  line-height: 1.6;
  margin: 20px 0;
  color: #ff6666;
`;

const ErrorCode = styled.pre`
  background: #000000;
  border: 1px solid #ff0000;
  padding: 15px;
  margin: 20px 0;
  text-align: left;
  overflow-x: auto;
  font-size: 14px;
  color: #ff0000;
`;

const RetryButton = styled.button`
  background: transparent;
  border: 2px solid #ff0000;
  color: #ff0000;
  padding: 12px 30px;
  font-family: 'Courier New', monospace;
  font-size: 16px;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s;

  &:hover {
    background: #ff0000;
    color: #000000;
    box-shadow: 0 0 15px rgba(255, 0, 0, 0.8);
  }

  &:active {
    transform: scale(0.95);
  }
`;

interface ErrorDisplayProps {
  title: string;
  message: string;
  code?: string;
  onRetry?: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  title,
  message,
  code,
  onRetry
}) => {
  return (
    <ErrorContainer>
      <ErrorBox>
        <ErrorIcon>💀</ErrorIcon>
        <ErrorTitle>{title}</ErrorTitle>
        <ErrorMessage>{message}</ErrorMessage>
        {code && <ErrorCode>{code}</ErrorCode>}
        {onRetry && (
          <RetryButton onClick={onRetry}>
            [RETRY]
          </RetryButton>
        )}
      </ErrorBox>
    </ErrorContainer>
  );
};
