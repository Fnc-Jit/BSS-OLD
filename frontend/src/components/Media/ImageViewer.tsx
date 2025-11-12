import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease;
  backdrop-filter: blur(10px);
`;

const ViewerContainer = styled.div`
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: rgba(20, 20, 20, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.8);
`;

const Header = styled.div`
  padding: 15px 20px;
  background: rgba(10, 10, 10, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.85em;
`;

const FilePath = styled.div`
  color: #999;
  display: flex;
  align-items: center;
  gap: 10px;
  
  .icon {
    color: #ff3366;
  }
  
  .path {
    color: #666;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #999;
  padding: 5px 15px;
  cursor: pointer;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.9em;
  transition: all 0.3s;
  
  &:hover {
    border-color: #ff3366;
    color: #ff3366;
    box-shadow: 0 0 10px rgba(255, 51, 102, 0.3);
  }
`;

const ImageContainer = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  max-height: calc(90vh - 60px);
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const ImageInfo = styled.div`
  padding: 10px 20px;
  background: rgba(10, 10, 10, 0.9);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75em;
  color: #666;
  display: flex;
  gap: 20px;
`;

interface ImageViewerProps {
  src: string;
  alt: string;
  filename?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ 
  src, 
  alt, 
  filename = 'image.jpg',
  isOpen, 
  onClose 
}) => {
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay $isOpen={isOpen} onClick={handleOverlayClick}>
      <ViewerContainer>
        <Header>
          <FilePath>
            <span className="icon">📁</span>
            <span>C:\</span>
            <span className="path">CHROME</span>
            <span>/</span>
            <span>{filename}</span>
          </FilePath>
          <CloseButton onClick={onClose}>CLOSE</CloseButton>
        </Header>
        
        <ImageContainer>
          <Image src={src} alt={alt} onLoad={handleImageLoad} />
        </ImageContainer>
        
        {imageSize && (
          <ImageInfo>
            <div>SIZE: {imageSize.width} x {imageSize.height}</div>
            <div>FORMAT: {filename.split('.').pop()?.toUpperCase()}</div>
            <div>STATUS: LOADED</div>
          </ImageInfo>
        )}
      </ViewerContainer>
    </Overlay>
  );
};
