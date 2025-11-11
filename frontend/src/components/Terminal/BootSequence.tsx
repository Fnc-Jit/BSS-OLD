import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const BootWrapper = styled.div`
  font-family: 'Courier New', monospace;
  color: ${props => props.theme.textColor};
  padding: 20px;
  line-height: 1.6;
`;

const BootLine = styled.div<{ delay: number }>`
  opacity: 0;
  animation: fadeIn 0.1s ease-in forwards;
  animation-delay: ${props => props.delay}ms;
  
  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`;

const bootMessages = [
  '💀 NEO-BBS SYSTEM v0.1.0',
  'Initializing haunted protocols...',
  'Loading spectral drivers... [OK]',
  'Connecting to the afterlife... [OK]',
  'Summoning AI spirits... [OK]',
  'Resurrecting old threads... [OK]',
  'Checking for ghosts in the machine... [OK]',
  '',
  'System ready. Welcome to the digital graveyard.',
  '',
];

interface BootSequenceProps {
  onComplete: () => void;
}

export const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const totalDelay = bootMessages.length * 150;
    const timer = setTimeout(() => {
      onComplete();
    }, totalDelay + 500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= bootMessages.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <BootWrapper>
      {bootMessages.slice(0, visibleLines).map((message, index) => (
        <BootLine key={index} delay={index * 150}>
          {message}
        </BootLine>
      ))}
    </BootWrapper>
  );
};
