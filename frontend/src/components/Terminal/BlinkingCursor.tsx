import React from 'react';
import styled, { keyframes } from 'styled-components';

const blink = keyframes`
  0%, 49% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 0;
  }
`;

const Cursor = styled.span`
  display: inline-block;
  width: 10px;
  height: 1em;
  background-color: ${props => props.theme.textColor};
  animation: ${blink} 1s infinite;
  margin-left: 2px;
  vertical-align: text-bottom;
`;

export const BlinkingCursor: React.FC = () => {
  return <Cursor>█</Cursor>;
};
