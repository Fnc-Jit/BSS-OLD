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

const TextArea = styled.textarea`
  background-color: ${props => props.theme.backgroundColor};
  color: ${props => props.theme.textColor};
  border: 2px solid ${props => props.theme.textColor}40;
  padding: 15px;
  font-family: ${props => props.theme.accentFont};
  font-size: 14px;
  min-height: 150px;
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

interface ReplyFormProps {
  threadId: string;
  onSubmit: (content: string) => Promise<void>;
  onCancel: () => void;
  isAuthenticated: boolean;
}

export const ReplyForm: React.FC<ReplyFormProps> = ({
  threadId,
  onSubmit,
  onCancel,
  isAuthenticated,
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const MAX_LENGTH = 5000;
  const MIN_LENGTH = 1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('You must be logged in to reply');
      return;
    }

    if (content.length < MIN_LENGTH) {
      setError('Reply cannot be empty');
      return;
    }

    if (content.length > MAX_LENGTH) {
      setError(`Reply is too long (max ${MAX_LENGTH} characters)`);
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      await onSubmit(content);
      setSuccess(true);
      setContent('');
      
      setTimeout(() => {
        setSuccess(false);
        onCancel();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to post reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOverLimit = content.length > MAX_LENGTH;

  if (!isAuthenticated) {
    return (
      <FormWrapper>
        <ASCIIBorder borderType="dashed" cornerChar="🔒">
          <ErrorMessage>
            You must be logged in to reply to threads.
            <br />
            Please log in or register to participate.
          </ErrorMessage>
        </ASCIIBorder>
      </FormWrapper>
    );
  }

  return (
    <FormWrapper>
      <ASCIIBorder borderType="solid" cornerChar="💬">
        <Form onSubmit={handleSubmit}>
          <h3 style={{ 
            fontFamily: 'inherit', 
            color: 'inherit',
            marginBottom: '10px' 
          }}>
            Reply to Thread
          </h3>
          
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your message from beyond..."
            disabled={isSubmitting}
          />
          
          <CharCount isOverLimit={isOverLimit}>
            {content.length} / {MAX_LENGTH} characters
          </CharCount>

          {error && <ErrorMessage>{error}</ErrorMessage>}
          {success && <SuccessMessage>Reply posted successfully! 👻</SuccessMessage>}

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
              disabled={isSubmitting || isOverLimit || content.length < MIN_LENGTH}
            >
              {isSubmitting ? 'Posting...' : 'Post Reply'}
            </Button>
          </ButtonGroup>
        </Form>
      </ASCIIBorder>
    </FormWrapper>
  );
};
