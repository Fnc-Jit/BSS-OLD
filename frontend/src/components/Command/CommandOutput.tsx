import React from 'react';
import styled from 'styled-components';

const OutputContainer = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  font-family: ${props => props.theme.accentFont};
  font-size: 16px;
  line-height: 1.6;
`;

const OutputLine = styled.div<{ $type?: 'success' | 'error' | 'info' }>`
  padding: 20px 24px;
  margin: 12px 0;
  border: 2px solid ${props => {
    switch (props.$type) {
      case 'error': return '#ff0000';
      case 'success': return props.theme.accentColor;
      case 'info': return props.theme.textColor + '60';
      default: return props.theme.textColor + '40';
    }
  }};
  border-left: 4px solid ${props => {
    switch (props.$type) {
      case 'error': return '#ff0000';
      case 'success': return props.theme.accentColor;
      case 'info': return props.theme.textColor + '80';
      default: return props.theme.textColor + '40';
    }
  }};
  color: ${props => {
    switch (props.$type) {
      case 'error': return '#ff6666';
      case 'success': return props.theme.accentColor;
      default: return props.theme.textColor;
    }
  }};
  white-space: pre-wrap;
  word-wrap: break-word;
  background: ${props => props.theme.backgroundColor}ee;
  text-align: left;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  overflow: visible;
  max-height: none;
`;

const CommandEcho = styled.div`
  color: ${props => props.theme.textColor}80;
  margin-bottom: 12px;
  font-style: italic;
  font-size: 15px;
  padding-left: 4px;
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
      {command && <CommandEcho>$ {command}</CommandEcho>}
      <OutputLine $type={type}>
        {output}
      </OutputLine>
    </OutputContainer>
  );
};
