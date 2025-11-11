# Command System Components

This directory contains the command-line interface components for the Neo-BBS forum.

## Components

### CommandInput
A command-line style input field with the following features:
- Command history navigation (up/down arrow keys)
- Autocomplete suggestions for available commands (Tab to complete)
- Blinking cursor for retro terminal aesthetic
- Supports all BBS-style commands

**Props:**
- `onCommand: (command: string, args: string[]) => void` - Callback when command is submitted
- `prompt?: string` - Custom prompt character (default: '>')

### CommandOutput
Displays command execution results in terminal format.

**Props:**
- `command?: string` - The command that was executed (displayed as echo)
- `output: string` - The command output text
- `type?: 'success' | 'error' | 'info'` - Output type for styling

### CommandHandler
High-level component that integrates command input with backend execution and navigation.

**Props:**
- `onNavigate?: (destination: string, data?: any) => void` - Callback for navigation commands
- `onBack?: () => void` - Callback for /back command
- `contextKey?: string` - Unique key for maintaining separate command histories per page

**Features:**
- Sends commands to backend API endpoint `/api/commands/execute`
- Handles local commands (/help, /back, /home) without backend calls
- Displays command history with output
- Separate command histories per page context
- Error handling for network issues, authentication, and rate limiting
- Navigation state management
- Sticky floating input box with scroll protection

### WelcomeMessage
Displays the welcome message with ASCII art and command list on the home page.

## Available Commands

- `/home` - Return to home page
- `/back` - Navigate to previous screen
- `/post` - Create a new thread
- `/read [thread_id]` - Read a specific thread
- `/news` - View latest News Bot bulletin
- `/who` - List active users
- `/ascii` - Upload image as ASCII art
- `/help` - Show help message

## Usage Example

```tsx
import { CommandHandler, WelcomeMessage } from './components/Command';

function App() {
  const currentView = 'home';
  
  return (
    <>
      {/* Show welcome message only on home page */}
      {currentView === 'home' && <WelcomeMessage />}
      
      {/* Command handler available on all pages */}
      <CommandHandler
        contextKey={currentView} // Separate history per page
        onNavigate={(destination, data) => {
          if (destination === 'home') {
            // Navigate to home page
          } else if (destination === 'create-thread') {
            // Navigate to thread creation form
          } else if (destination === 'thread') {
            // Navigate to thread view with data.threadId
          }
        }}
        onBack={() => {
          // Handle back navigation
        }}
      />
    </>
  );
}
```

## Integration with Backend

The command system expects a backend endpoint at `POST /api/commands/execute` with the following format:

**Request:**
```json
{
  "command": "/read",
  "args": ["thread_id_123"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Command executed successfully",
  "data": {
    // Command-specific data
  }
}
```

**Error Response:**
```json
{
  "error": {
    "code": "UNKNOWN_COMMAND",
    "message": "Command not recognized"
  }
}
```
