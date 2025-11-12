import React, { useState } from 'react';
import styled from 'styled-components';
import { ASCIIBorder } from '../Theme/ASCIIBorder';

const FormWrapper = styled.div`
  margin: 20px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const Input = styled.input`
  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.textColor};
  border: 2px solid ${props => props.theme.textColor}40;
  padding: 12px;
  font-family: ${props => props.theme.accentFont};
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.accentColor};
    box-shadow: 0 0 10px ${props => props.theme.accentColor}40;
  }
  
  &::placeholder {
    color: ${props => props.theme.textColor}60;
  }
`;

const TextArea = styled.textarea`
  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.textColor};
  border: 2px solid ${props => props.theme.textColor}40;
  padding: 15px;
  font-family: ${props => props.theme.accentFont};
  font-size: 14px;
  min-height: 200px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.accentColor};
    box-shadow: 0 0 10px ${props => props.theme.accentColor}40;
  }
  
  &::placeholder {
    color: ${props => props.theme.textColor}60;
  }
`;

const CharCount = styled.div<{ isOverLimit: boolean }>`
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: ${props => props.isOverLimit ? '#ff0000' : props.theme.textColor}80;
  text-align: right;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background: transparent;
  border: none;
  color: ${props => props.variant === 'primary' ? '#ff3366' : '#999'};
  padding: 8px 20px;
  padding-bottom: 12px;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.9em;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  /* Ruler notches at bottom */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 6px;
    background-image: repeating-linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.3) 0px,
      rgba(255, 255, 255, 0.3) 1px,
      transparent 1px,
      transparent 8px
    );
  }
  
  &:hover:not(:disabled) {
    color: ${props => props.variant === 'primary' ? '#ff6699' : '#fff'};
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

const ErrorMessage = styled.div`
  color: #ff0000;
  font-family: ${props => props.theme.accentFont};
  padding: 10px;
  border: 1px solid #ff0000;
  background-color: #ff000020;
`;

const SuccessMessage = styled.div`
  color: #00ff00;
  font-family: ${props => props.theme.accentFont};
  padding: 10px;
  border: 1px solid #00ff00;
  background-color: #00ff0020;
`;

interface NewThreadFormProps {
  boardId: string;
  onSubmit: (title: string, content: string) => Promise<void>;
  onCancel: () => void;
  isAuthenticated: boolean;
}

export const NewThreadForm: React.FC<NewThreadFormProps> = ({
  boardId,
  onSubmit,
  onCancel,
  isAuthenticated,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const TITLE_MAX = 100;
  const TITLE_MIN = 3;
  const CONTENT_MAX = 5000;
  const CONTENT_MIN = 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('You must be logged in to create threads');
      return;
    }

    if (title.length < TITLE_MIN || title.length > TITLE_MAX) {
      setError(`Title must be between ${TITLE_MIN} and ${TITLE_MAX} characters`);
      return;
    }

    if (content.length < CONTENT_MIN || content.length > CONTENT_MAX) {
      setError(`Content must be between ${CONTENT_MIN} and ${CONTENT_MAX} characters`);
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      await onSubmit(title, content);
      setSuccess(true);
      setTitle('');
      setContent('');
      
      setTimeout(() => {
        setSuccess(false);
        onCancel();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create thread');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTitleOverLimit = title.length > TITLE_MAX;
  const isContentOverLimit = content.length > CONTENT_MAX;

  if (!isAuthenticated) {
    return (
      <FormWrapper>
        <ASCIIBorder borderType="dashed" cornerChar="🔒">
          <ErrorMessage>
            You must be logged in to create threads.
            <br />
            Please log in or register to participate.
          </ErrorMessage>
        </ASCIIBorder>
      </FormWrapper>
    );
  }

  return (
    <FormWrapper>
      <ASCIIBorder borderType="double" cornerChar="📝">
        <Form onSubmit={handleSubmit}>
          <h3 style={{ 
            fontFamily: 'inherit', 
            color: 'inherit',
            marginBottom: '10px' 
          }}>
            Create New Thread in /{boardId}
          </h3>
          
          <div>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Thread title..."
              disabled={isSubmitting}
            />
            <CharCount isOverLimit={isTitleOverLimit}>
              {title.length} / {TITLE_MAX} characters
            </CharCount>
          </div>
          
          <div>
            <TextArea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Your message from the afterlife..."
              disabled={isSubmitting}
            />
            <CharCount isOverLimit={isContentOverLimit}>
              {content.length} / {CONTENT_MAX} characters
            </CharCount>
          </div>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>Thread created successfully! 💀</SuccessMessage>}

          <ButtonGroup>
            <Button 
              type="button" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
              disabled={
                isSubmitting || 
                isTitleOverLimit || 
                isContentOverLimit ||
                title.length < TITLE_MIN ||
                content.length < CONTENT_MIN
              }
            >
              {isSubmitting ? 'Creating...' : 'Create Thread'}
            </Button>
          </ButtonGroup>
        </Form>
      </ASCIIBorder>
    </FormWrapper>
  );
};
