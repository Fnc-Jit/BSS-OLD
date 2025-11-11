import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TimerContainer = styled.div`
  padding: 15px 20px;
  margin: 10px 0;
  border: 2px solid #ff6600;
  background: ${props => props.theme.backgroundColor}ee;
  color: #ff6600;
  font-family: ${props => props.theme.accentFont};
  font-size: 14px;
  text-align: center;
`;

const TimerText = styled.div`
  margin-bottom: 10px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #333;
  border: 1px solid #ff6600;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${props => props.$progress}%;
  background: #ff6600;
  transition: width 1s linear;
`;

interface RateLimitTimerProps {
  seconds: number;
  onComplete?: () => void;
}

export const RateLimitTimer: React.FC<RateLimitTimerProps> = ({
  seconds,
  onComplete
}) => {
  const [remaining, setRemaining] = useState(seconds);
  const progress = ((seconds - remaining) / seconds) * 100;

  useEffect(() => {
    if (remaining <= 0) {
      onComplete?.();
      return;
    }

    const timer = setInterval(() => {
      setRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining, onComplete]);

  return (
    <TimerContainer>
      <TimerText>
        ⏳ COOLDOWN: {remaining} second{remaining !== 1 ? 's' : ''} remaining
      </TimerText>
      <ProgressBar>
        <ProgressFill $progress={progress} />
      </ProgressBar>
    </TimerContainer>
  );
};
