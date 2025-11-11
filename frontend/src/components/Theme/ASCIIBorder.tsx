import React, { ReactNode } from 'react';
import styled from 'styled-components';

const BorderWrapper = styled.div<{ borderType: string }>`
  border: 2px ${props => props.borderType} ${props => props.theme.textColor};
  padding: 15px;
  margin: 10px 0;
  position: relative;
  background-color: ${props => props.theme.backgroundColor}dd;
`;

const Corner = styled.span<{ position: string }>`
  position: absolute;
  font-size: 16px;
  color: ${props => props.theme.accentColor};
  
  ${props => {
    switch (props.position) {
      case 'top-left':
        return 'top: -8px; left: -8px;';
      case 'top-right':
        return 'top: -8px; right: -8px;';
      case 'bottom-left':
        return 'bottom: -8px; left: -8px;';
      case 'bottom-right':
        return 'bottom: -8px; right: -8px;';
      default:
        return '';
    }
  }}
`;

interface ASCIIBorderProps {
  children: ReactNode;
  borderType?: 'solid' | 'double' | 'dashed';
  showCorners?: boolean;
  cornerChar?: string;
}

export const ASCIIBorder: React.FC<ASCIIBorderProps> = ({ 
  children, 
  borderType = 'solid',
  showCorners = true,
  cornerChar = '💀'
}) => {
  return (
    <BorderWrapper borderType={borderType}>
      {showCorners && (
        <>
          <Corner position="top-left">{cornerChar}</Corner>
          <Corner position="top-right">{cornerChar}</Corner>
          <Corner position="bottom-left">{cornerChar}</Corner>
          <Corner position="bottom-right">{cornerChar}</Corner>
        </>
      )}
      {children}
    </BorderWrapper>
  );
};
