import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: ${props => props.theme.textColor};
  font-family: ${props => props.theme.accentFont};
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid ${props => props.theme.textColor}40;
  border-top: 3px solid ${props => props.theme.accentColor};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin-bottom: 20px;
`;

const LoadingText = styled.div`
  font-size: 16px;
  text-align: center;
  
  &::after {
    content: '...';
    animation: ${blink} 1.5s infinite;
  }
`;

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'LOADING' 
}) => {
  return (
    <LoadingContainer>
      <Spinner />
      <LoadingText>{message}</LoadingText>
    </LoadingContainer>
  );
};
