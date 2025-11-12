import React from 'react';
import styled from 'styled-components';

const OutputContainer = styled.div`
  margin: 15px 0;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.9em;
`;

const OutputLine = styled.div<{ $type?: 'success' | 'error' | 'info' }>`
  padding: 15px 20px;
  margin: 10px 0;
  border-left: 3px solid ${props => {
    switch (props.$type) {
      case 'error': return '#ff3366';
      case 'success': return '#00ff88';
      case 'info': return '#666';
      default: return '#444';
    }
  }};
  background: ${props => {
    switch (props.$type) {
      case 'error': return 'rgba(255, 51, 102, 0.05)';
      case 'success': return 'rgba(0, 255, 136, 0.05)';
      default: return 'rgba(20, 20, 20, 0.5)';
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'error': return '#ff3366';
      case 'success': return '#00ff88';
      default: return '#999';
    }
  }};
  white-space: pre-wrap;
  word-wrap: break-word;
  border: 1px solid rgba(255, 255, 255, 0.05);
  line-height: 1.6;
`;

const CommandEcho = styled.div`
  color: #666;
  margin-bottom: 8px;
  font-size: 0.85em;
  
  &::before {
    content: '$ ';
    color: #ff3366;
  }
`;

interface CommandOutputProps {
  command?: string;
  output: string;
  type?: 'success' | 'error' | 'info';
}

export const CommandOutput: React.FC<CommandOutputProps> = ({ 
  command, 
  output, 
  type 
}) => {
  return (
    <OutputContainer>
      {command && <CommandEcho>{command}</CommandEcho>}
      <OutputLine $type={type}>
        {output}
      </OutputLine>
    </OutputContainer>
  );
};
