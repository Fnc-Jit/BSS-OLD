import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const MessageContainer = styled.div`
  padding: 15px 20px;
  margin: 10px 0;
  border: 2px solid ${props => props.theme.accentColor};
  background: ${props => props.theme.backgroundColor}ee;
  color: ${props => props.theme.accentColor};
  font-family: ${props => props.theme.accentFont};
  font-size: 14px;
  animation: ${fadeIn} 0.3s ease-out;
  box-shadow: 0 0 10px ${props => props.theme.accentColor}40;
`;

const MessageIcon = styled.span`
  margin-right: 10px;
  font-size: 18px;
`;

interface SuccessMessageProps {
  message: string;
  icon?: string;
  duration?: number;
  onClose?: () => void;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message,
  icon = '✓',
  duration = 3000,
  onClose
}) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <MessageContainer>
      <MessageIcon>{icon}</MessageIcon>
      {message}
    </MessageContainer>
  );
};
