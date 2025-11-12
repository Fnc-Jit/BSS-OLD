import React, { useState } from 'react';
import styled from 'styled-components';
import { ImageViewer } from './ImageViewer';

const ThumbnailContainer = styled.div`
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;
  
  &:hover {
    border-color: #ff3366;
    box-shadow: 0 0 20px rgba(255, 51, 102, 0.2);
    
    .overlay {
      opacity: 1;
    }
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const HoverOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.9em;
  color: #ff3366;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const FileInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7em;
  color: #666;
`;

interface ImageThumbnailProps {
  src: string;
  alt: string;
  filename?: string;
  width?: string;
  height?: string;
}

export const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ 
  src, 
  alt, 
  filename,
  width = '200px',
  height = '200px'
}) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <>
      <ThumbnailContainer 
        style={{ width, height }}
        onClick={() => setIsViewerOpen(true)}
      >
        <Thumbnail src={src} alt={alt} />
        <HoverOverlay className="overlay">
          CLICK TO VIEW
        </HoverOverlay>
        {filename && (
          <FileInfo>
            {filename}
          </FileInfo>
        )}
      </ThumbnailContainer>

      <ImageViewer
        src={src}
        alt={alt}
        filename={filename}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </>
  );
};
