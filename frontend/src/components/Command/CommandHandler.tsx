import React, { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { CommandInput } from './CommandInput';
import { CommandOutput } from './CommandOutput';
import { apiService } from '../../services/api';

const CommandSection = styled.div`
  margin-top: 20px;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 20px;
`;

const OutputHistory = styled.div`
  margin-bottom: 10px;
  overflow: visible;
  max-height: none;
`;

interface CommandResult {
  id: string;
  command: string;
  output: string;
  type: 'success' | 'error' | 'info';
  timestamp: number;
}

interface CommandHandlerProps {
  onNavigate?: (destination: string, data?: any) => void;
  onBack?: () => void;
  contextKey?: string;
}

// Store command histories per context - using a module-level variable to persist across renders
const commandHistories: Record<string, CommandResult[]> = {};

export const CommandHandler: React.FC<CommandHandlerProps> = ({ 
  onNavigate,
  onBack,
  contextKey = 'default'
}) => {
  // Use ref to track the current context key
  const currentContextRef = useRef(contextKey);
  
  // Initialize or retrieve history for this context
  const [results, setResults] = useState<CommandResult[]>(() => {
    if (!commandHistories[contextKey]) {
      commandHistories[contextKey] = [];
    }
    return commandHistories[contextKey];
  });
  // const [navigationHistory, setNavigationHistory] = useState<string[]>([]);

  // Update results when context changes
  useEffect(() => {
    // Save current context's results before switching
    if (currentContextRef.current !== contextKey) {
      commandHistories[currentContextRef.current] = results;
      
      // Load new context's results
      if (!commandHistories[contextKey]) {
        commandHistories[contextKey] = [];
      }
      setResults([...commandHistories[contextKey]]);
      currentContextRef.current = contextKey;
    }
  }, [contextKey, results]);

  // Save results to the context-specific history whenever they change
  useEffect(() => {
    commandHistories[contextKey] = results;
  }, [results, contextKey]);

  const addResult = useCallback((command: string, output: string, type: 'success' | 'error' | 'info' = 'info') => {
    const result: CommandResult = {
      id: Date.now().toString(),
      command,
      output,
      type,
      timestamp: Date.now()
    };
    setResults(prev => [...prev, result]);
  }, []);

  const handleLocalCommand = useCallback((command: string, args: string[]): boolean => {
    const cmd = command.toLowerCase();

    // Handle /help locally
    if (cmd === '/help') {
      const helpText = `
╔════════════════════════════════════════════════════════╗
║           👻 NEO-BBS COMMAND CENTER 👻                 ║
╚════════════════════════════════════════════════════════╝

📜 AVAILABLE COMMANDS:

  /home              🏠  Return to home page
  /back              ⬅️  Navigate to previous screen
  /post              🖊️  Create a new thread
  /read [thread_id]  📖  Read a specific thread
  /news              📰  View latest News Bot bulletin
  /who               👥  List active users (and ghosts)
  /ascii             🎨  Upload image as ASCII art
  /help              ❓  Show this help message

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 TIP: Use UP/DOWN arrows to navigate history
     Use TAB to autocomplete commands

👻 Happy haunting!`;
      addResult(command, helpText, 'info');
      return true;
    }

    // Handle /home locally
    if (cmd === '/home') {
      if (onNavigate) {
        onNavigate('home');
        addResult(command, 'Returning to home page...', 'success');
      } else {
        addResult(command, 'Navigation not available', 'error');
      }
      return true;
    }

    // Handle /back locally
    if (cmd === '/back') {
      if (onBack) {
        onBack();
        addResult(command, 'Navigating back...', 'success');
      } else {
        addResult(command, 'No previous screen in history', 'error');
      }
      return true;
    }

    return false;
  }, [addResult, onBack, onNavigate]);

  const handleCommand = useCallback(async (command: string, args: string[]) => {
    // Check if it's a local command first
    if (handleLocalCommand(command, args)) {
      return;
    }

    // Validate command format
    if (!command.startsWith('/')) {
      addResult(command, 'INVALID COMMAND: Commands must start with /', 'error');
      return;
    }

    try {
      // Send command to backend
      const response = await apiService.executeCommand({ command, args });
      
      // Handle response based on command type
      const data = response.data;
      
      if (data.success) {
        // Handle navigation commands
        if (command === '/post' && onNavigate) {
          onNavigate('create-thread', data.data);
          addResult(command, 'Opening thread creation interface...', 'success');
        } else if (command === '/read' && onNavigate) {
          if (args.length === 0) {
            addResult(command, 'ERROR: /read requires a thread ID', 'error');
          } else {
            onNavigate('thread', { threadId: args[0] });
            addResult(command, `Loading thread ${args[0]}...`, 'success');
          }
        } else if (command === '/news' && onNavigate) {
          onNavigate('news', data.data);
          addResult(command, 'Loading News Bot bulletin...', 'success');
        } else if (command === '/who') {
          const users = data.data?.users || [];
          const userList = users.length > 0 
            ? users.map((u: any) => `  - ${u.username}`).join('\n')
            : '  No users currently active';
          addResult(command, `Active users:\n${userList}`, 'info');
        } else {
          // Generic success response
          addResult(command, data.message || 'Command executed successfully', 'success');
        }
        
        // Update navigation history
        // setNavigationHistory(prev => [...prev, command]);
      } else {
        addResult(command, data.message || 'Command failed', 'error');
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        addResult(command, 'UNKNOWN COMMAND: Type /help for available commands', 'error');
      } else if (error.response?.status === 401) {
        addResult(command, 'AUTHENTICATION REQUIRED: Please log in to use this command', 'error');
      } else if (error.response?.status === 429) {
        addResult(command, 'SYSTEM OVERLOAD: Rate limit exceeded. Please wait before trying again.', 'error');
      } else if (error.response?.data?.error) {
        addResult(command, `ERROR: ${error.response.data.error.message}`, 'error');
      } else if (error.message) {
        addResult(command, `CONNECTION LOST: ${error.message}`, 'error');
      } else {
        addResult(command, 'SYSTEM ERROR: An unexpected error occurred', 'error');
      }
    }
  }, [handleLocalCommand, addResult, onNavigate]);

  return (
    <CommandSection>
      {results.length > 0 && (
        <OutputHistory>
          {results.map(result => (
            <CommandOutput
              key={result.id}
              command={result.command}
              output={result.output}
              type={result.type}
            />
          ))}
        </OutputHistory>
      )}
      <CommandInput onCommand={handleCommand} />
    </CommandSection>
  );
};
