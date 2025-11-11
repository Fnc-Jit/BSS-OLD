import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import styled from 'styled-components';
import { BlinkingCursor } from '../Terminal/BlinkingCursor';

const CommandContainer = styled.div`
  margin-top: 40px;
  margin-left: -20px;
  margin-right: -20px;
  padding: 24px 20px 32px 20px;
  border-top: 3px solid ${props => props.theme.accentColor}60;
  position: sticky;
  bottom: 0;
  background: #000000;
  box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.8);
  z-index: 100;
  
  &::before {
    content: '';
    position: absolute;
    top: -40px;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(to bottom, transparent, #000000);
    pointer-events: none;
  }
`;

const CommandLine = styled.div`
  display: flex;
  align-items: center;
  font-family: ${props => props.theme.accentFont};
  font-size: 18px;
  background: ${props => props.theme.backgroundColor}ee;
  border: 2px solid ${props => props.theme.textColor}40;
  border-radius: 4px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const Prompt = styled.span`
  color: ${props => props.theme.accentColor};
  margin-right: 12px;
  user-select: none;
  font-size: 20px;
  font-weight: bold;
`;

const InputWrapper = styled.div`
  position: relative;
  flex: 1;
  padding: 4px 8px;
  
  &:focus-within {
    outline: 2px solid ${props => props.theme.accentColor}60;
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

const InputLine = styled.div`
  display: flex;
  align-items: center;
  font-family: ${props => props.theme.accentFont};
  font-size: 18px;
  color: ${props => props.theme.textColor};
  min-height: 1.8em;
  line-height: 1.6;
`;

const TextDisplay = styled.span`
  white-space: pre;
`;

const Input = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: transparent;
  font-family: ${props => props.theme.accentFont};
  font-size: 18px;
  padding: 8px 12px;
  caret-color: transparent;
  
  &::selection {
    background: ${props => props.theme.textColor}40;
    color: ${props => props.theme.textColor};
  }
  
  &::placeholder {
    color: ${props => props.theme.textColor}40;
    font-size: 16px;
  }
`;

const AutocompleteContainer = styled.div`
  position: absolute;
  bottom: 100%;
  left: -16px;
  background: ${props => props.theme.backgroundColor}f5;
  border: 2px solid ${props => props.theme.accentColor}80;
  padding: 8px;
  margin-bottom: 8px;
  min-width: 250px;
  z-index: 10;
  border-radius: 4px;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.4);
`;

const AutocompleteItem = styled.div<{ $isSelected: boolean }>`
  padding: 8px 12px;
  cursor: pointer;
  background: ${props => props.$isSelected ? props.theme.accentColor + '30' : 'transparent'};
  color: ${props => props.theme.textColor};
  border-radius: 2px;
  margin: 2px 0;
  font-size: 16px;
  
  &:hover {
    background: ${props => props.theme.accentColor}30;
  }
`;

// const CommandOutput = styled.div`
//   margin-top: 10px;
//   padding: 10px;
//   border-left: 2px solid ${props => props.theme.accentColor};
//   white-space: pre-wrap;
//   font-family: ${props => props.theme.accentFont};
//   font-size: 14px;
// `;

// const ErrorOutput = styled(CommandOutput)`
//   border-left-color: #ff0000;
//   color: #ff6666;
// `;

const AVAILABLE_COMMANDS = [
  '/home',
  '/back',
  '/post',
  '/read',
  '/news',
  '/who',
  '/ascii',
  '/help'
];

interface CommandInputProps {
  onCommand: (command: string, args: string[]) => void;
  prompt?: string;
}

export const CommandInput: React.FC<CommandInputProps> = ({ 
  onCommand,
  prompt = '>' 
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
  const [selectedAutocomplete, setSelectedAutocomplete] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Update autocomplete suggestions
    if (input.startsWith('/') && input.length > 1) {
      const matches = AVAILABLE_COMMANDS.filter(cmd => 
        cmd.toLowerCase().startsWith(input.toLowerCase())
      );
      setAutocompleteOptions(matches);
      setShowAutocomplete(matches.length > 0);
      setSelectedAutocomplete(0);
    } else {
      setShowAutocomplete(false);
    }
  }, [input]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (showAutocomplete) {
        // Navigate autocomplete
        setSelectedAutocomplete(prev => 
          prev > 0 ? prev - 1 : autocompleteOptions.length - 1
        );
      } else {
        // Navigate history
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          setHistoryIndex(newIndex);
          setInput(history[history.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (showAutocomplete) {
        // Navigate autocomplete
        setSelectedAutocomplete(prev => 
          prev < autocompleteOptions.length - 1 ? prev + 1 : 0
        );
      } else {
        // Navigate history
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          setHistoryIndex(newIndex);
          setInput(history[history.length - 1 - newIndex]);
        } else if (historyIndex === 0) {
          setHistoryIndex(-1);
          setInput('');
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (showAutocomplete && autocompleteOptions.length > 0) {
        setInput(autocompleteOptions[selectedAutocomplete]);
        setShowAutocomplete(false);
      }
    } else if (e.key === 'Escape') {
      setShowAutocomplete(false);
    }
  };

  const handleSubmit = () => {
    if (!input.trim()) return;

    // Add to history
    setHistory(prev => [...prev, input]);
    setHistoryIndex(-1);

    // Parse command and arguments
    const parts = input.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    // Execute command
    onCommand(command, args);

    // Clear input
    setInput('');
    setShowAutocomplete(false);
  };

  const handleAutocompleteClick = (cmd: string) => {
    setInput(cmd);
    setShowAutocomplete(false);
    inputRef.current?.focus();
  };

  return (
    <CommandContainer>
      <CommandLine>
        <Prompt>{prompt}</Prompt>
        <InputWrapper>
          {showAutocomplete && (
            <AutocompleteContainer>
              {autocompleteOptions.map((cmd, index) => (
                <AutocompleteItem
                  key={cmd}
                  $isSelected={index === selectedAutocomplete}
                  onClick={() => handleAutocompleteClick(cmd)}
                >
                  {cmd}
                </AutocompleteItem>
              ))}
            </AutocompleteContainer>
          )}
          <InputLine>
            <TextDisplay>{input || ''}</TextDisplay>
            <BlinkingCursor />
          </InputLine>
          <Input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
            placeholder={input ? '' : 'Type a command... (try /help)'}
          />
        </InputWrapper>
      </CommandLine>
    </CommandContainer>
  );
};
