import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const dots = keyframes`
  0%, 20% {
    content: '.';
  }
  40% {
    content: '..';
  }
  60%, 100% {
    content: '...';
  }
`;

const LoadingWrapper = styled.div`
  font-family: ${props => props.theme.accentFont};
  color: ${props => props.theme.textColor};
  padding: 20px;
  text-align: center;
`;

const LoadingText = styled.div`
  &::after {
    content: '.';
    animation: ${dots} 1.5s infinite;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  max-width: 400px;
  height: 20px;
  border: 2px solid ${props => props.theme.textColor};
  margin: 20px auto;
  position: relative;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${props => props.progress}%;
  background-color: ${props => props.theme.textColor};
  transition: width 0.3s ease;
`;

interface LoadingAnimationProps {
  message?: string;
  showProgress?: boolean;
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({ 
  message = 'LOADING', 
  showProgress = true 
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!showProgress) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0;
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [showProgress]);

  return (
    <LoadingWrapper>
      <LoadingText>{message}</LoadingText>
      {showProgress && (
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
      )}
    </LoadingWrapper>
  );
};
