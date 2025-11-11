# Implementation Plan

- [x] 1. Set up project structure and development environment
  - Create React frontend project with TypeScript and styled-components
  - Create Python FastAPI backend project with virtual environment
  - Configure MongoDB Atlas with three separate clusters (/crypt, /parlor, /comedy-night)
  - Set up environment configuration files for API keys and database URIs
  - Initialize Git repository with .gitignore for both frontend and backend
  - _Requirements: 10.1, 10.2, 10.3_

- [x] 2. Implement backend data models and database layer
  - [x] 2.1 Create Pydantic models for User, Board, Thread, Post, and ModerationLog
    - Define all model fields with proper types and validation rules
    - Implement password hashing utilities for User model
    - Add indexes for efficient querying (board_id, created_at, author_id)
    - _Requirements: 2.1, 2.2, 10.4_
  
  - [x] 2.2 Implement MongoDB connection and repository pattern
    - Create database connection manager with connection pooling
    - Implement repository classes for each model (UserRepository, ThreadRepository, PostRepository)
    - Add CRUD operations with proper error handling
    - Implement board-specific collection routing based on board_id
    - _Requirements: 10.1, 10.2, 10.3, 10.5_
  
  - [x] 2.3 Write unit tests for data models and repositories
    - Test model validation with valid and invalid data
    - Test repository CRUD operations with in-memory MongoDB
    - Test board-specific data isolation
    - _Requirements: 10.1, 10.2, 10.3_

- [ ] 3. Implement authentication and authorization system
  - [ ] 3.1 Create JWT-based authentication service
    - Implement user registration endpoint with email validation
    - Implement login endpoint with password verification and JWT generation
    - Create JWT token validation middleware
    - Add token refresh mechanism
    - _Requirements: 2.1, 2.2_
  
  - [ ] 3.2 Implement role-based access control
    - Create authorization decorators for user and admin roles
    - Implement ghost mode access control for admin users
    - Add permission checks for thread/post creation, editing, and deletion
    - _Requirements: 9.1, 9.2, 9.3, 9.4_
  
  - [ ] 3.3 Write security tests for authentication
    - Test JWT token generation and validation
    - Test password hashing and verification
    - Test authorization for different user roles
    - Test ghost mode privilege escalation prevention
    - _Requirements: 9.1, 9.2_

- [ ] 4. Implement core API endpoints for boards, threads, and posts
  - [ ] 4.1 Create board management endpoints
    - Implement GET /api/boards to list all available boards
    - Implement GET /api/boards/{board_id} to fetch board details with theme config
    - Implement GET /api/boards/{board_id}/threads with pagination
    - _Requirements: 1.1, 1.2, 3.1, 3.2_
  
  - [ ] 4.2 Create thread management endpoints
    - Implement POST /api/threads with authentication and validation
    - Implement GET /api/threads/{thread_id} to fetch thread with posts
    - Implement PUT /api/threads/{thread_id} for admin editing
    - Implement DELETE /api/threads/{thread_id} with authorization
    - Implement POST /api/threads/{thread_id}/lock for admin thread locking
    - _Requirements: 2.1, 2.2, 2.3, 9.4_
  
  - [ ] 4.3 Create post management endpoints
    - Implement POST /api/threads/{thread_id}/posts with content validation
    - Implement GET /api/threads/{thread_id}/posts with pagination
    - Implement PUT /api/posts/{post_id} for admin editing
    - Implement DELETE /api/posts/{post_id} with authorization
    - _Requirements: 1.3, 2.2, 2.4, 9.3_
  
  - [ ] 4.4 Write integration tests for API endpoints
    - Test complete user flows (register → login → create thread → post reply)
    - Test anonymous viewer access restrictions
    - Test admin operations in ghost mode
    - Test pagination and sorting
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2_

- [ ] 5. Implement command interpreter system
  - [ ] 5.1 Create command parser and router
    - Implement POST /api/commands/execute endpoint
    - Create command parser to extract command and arguments
    - Build command router to dispatch to appropriate handlers
    - Add command validation and error responses
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ] 5.2 Implement individual command handlers
    - Create /post handler to return thread creation interface data
    - Create /read handler to fetch and return thread by ID
    - Create /news handler to fetch latest News Bot bulletin
    - Create /who handler to list active users (excluding ghost mode admins)
    - Create /back handler to return navigation history
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 9.2_
  
  - [ ] 5.3 Write tests for command interpreter
    - Test command parsing with various input formats
    - Test each command handler with valid and invalid arguments
    - Test error handling for unknown commands
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 6. Implement ASCII Art Parser MCP plugin
  - [ ] 6.1 Create image to ASCII conversion service
    - Implement image loading and format validation (JPEG, PNG, GIF)
    - Create image resizing logic to target dimensions (80x40)
    - Implement grayscale conversion and brightness mapping
    - Map pixel brightness to ASCII character set
    - Add error handling for invalid images
    - _Requirements: 8.1, 8.2, 8.3, 8.5_
  
  - [ ] 6.2 Integrate ASCII parser with post creation
    - Add /ascii command handler to command interpreter
    - Implement image upload endpoint
    - Store ASCII art in Post model ascii_art field
    - Render ASCII art with monospace font styling
    - _Requirements: 2.5, 8.4_
  
  - [ ] 6.3 Write tests for ASCII art conversion
    - Test conversion with sample images
    - Test format validation and error handling
    - Test dimension constraints
    - _Requirements: 8.1, 8.2, 8.3, 8.5_

- [ ] 7. Implement News Bot AI service
  - [ ] 7.1 Create News Bot service with OpenAI integration
    - Set up OpenAI API client with error handling
    - Implement daily bulletin generation method
    - Create prompt template with thread activity context
    - Add token management and rate limiting
    - _Requirements: 4.2, 4.3, 4.5_
  
  - [ ] 7.2 Implement scheduled task for daily bulletin
    - Configure APScheduler for midnight UTC execution
    - Create task to fetch thread activity from last 24 hours
    - Generate bulletin using News Bot service
    - Post bulletin to /news board as pinned thread
    - Add error handling and retry logic
    - _Requirements: 4.1, 4.3, 4.4_
  
  - [ ] 7.3 Write tests for News Bot
    - Mock OpenAI API responses
    - Test bulletin generation with sample activity data
    - Test scheduled task execution
    - Test error handling for API failures
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 8. Implement HauntBot resurrection service
  - [ ] 8.1 Create HauntBot service with thread monitoring
    - Implement query to find threads inactive for 72+ hours
    - Filter out already-resurrected threads
    - Create contextual revival message generator
    - Build prompt template with thread context and haunted theming
    - _Requirements: 5.1, 5.2, 5.4_
  
  - [ ] 8.2 Implement scheduled task for thread resurrection
    - Configure periodic check (e.g., every 6 hours)
    - Process eligible threads and generate revival messages
    - Post revival messages as replies with bot identification
    - Mark threads as resurrected to prevent duplicates
    - Add ghost emoji and spooky phrases to messages
    - _Requirements: 5.2, 5.3, 5.5_
  
  - [ ] 8.3 Write tests for HauntBot
    - Mock OpenAI API responses
    - Test inactive thread detection logic
    - Test resurrection message generation
    - Test duplicate resurrection prevention
    - _Requirements: 5.1, 5.2, 5.4_

- [ ] 9. Implement Mod Bot spam detection service
  - [ ] 9.1 Create Mod Bot service with content analysis
    - Implement spam indicator detection (repeated content, excessive links)
    - Create user violation tracking system
    - Build prompt template for AI-based content analysis
    - Add OpenAI integration for advanced spam detection
    - _Requirements: 6.1, 6.2, 6.4_
  
  - [ ] 9.2 Implement automated moderation actions
    - Create warning system for first-time violations
    - Implement 24-hour account lock for three violations
    - Add moderation log creation for all actions
    - Integrate Mod Bot check into post creation flow
    - _Requirements: 6.2, 6.3, 6.5_
  
  - [ ] 9.3 Write tests for Mod Bot
    - Mock OpenAI API responses
    - Test spam detection with various content patterns
    - Test violation tracking and action escalation
    - Test moderation log creation
    - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [x] 10. Implement frontend terminal container and theme engine
  - [x] 10.1 Create terminal container component
    - Build main terminal window with CRT shader effects
    - Implement blinking cursor animation
    - Add green-on-black color scheme with CSS variables
    - Create faux loading animations for navigation
    - _Requirements: 1.5, 3.3, 3.5_
  
  - [x] 10.2 Create theme engine with board-specific styling
    - Define ThemeConfig interface with font and color properties
    - Implement theme switching logic based on board context
    - Load board-specific fonts (Creepster, Nosifer, Press Start 2P, Silkscreen)
    - Apply dynamic CSS variables for theme changes
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 10.3 Create ASCII art header component
    - Load and display board-specific ASCII art headers
    - Implement ASCII border rendering for posts
    - Add thematic decorations (skull emojis, ghost puns)
    - _Requirements: 3.4, 5.5_

- [x] 11. Implement frontend board and thread views
  - [x] 11.1 Create board list and board view components
    - Implement board list display with thematic identifiers
    - Create board view with thread list and pagination
    - Add thread sorting options (newest, most active)
    - Display thread metadata (author, timestamp, post count)
    - _Requirements: 1.1, 1.2_
  
  - [x] 11.2 Create thread view component
    - Display thread title and initial post
    - Render all replies in chronological order
    - Show user information and timestamps for each post
    - Apply board-specific theming to thread display
    - Render ASCII art in posts with monospace styling
    - _Requirements: 1.3, 1.5, 8.4_
  
  - [x] 11.3 Implement reply interface for authenticated users
    - Create reply form with text input validation
    - Add character count display (1-5000 characters)
    - Implement post submission with loading state
    - Show success/error messages in terminal style
    - Disable reply interface for anonymous viewers
    - _Requirements: 1.4, 2.2, 2.4_

- [x] 12. Implement frontend command input system
  - [x] 12.1 Create command input component
    - Build command-line style input field with prompt
    - Implement command history navigation (up/down arrows)
    - Add autocomplete suggestions for available commands
    - Display command output in terminal format
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [x] 12.2 Integrate command execution with backend
    - Send commands to POST /api/commands/execute endpoint
    - Handle command responses and update UI accordingly
    - Display error messages for invalid commands
    - Implement navigation state management for /back command
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 13. Implement frontend authentication and user management
  - [ ] 13.1 Create login and registration forms
    - Build registration form with email and password validation
    - Create login form with credential input
    - Implement JWT token storage in localStorage
    - Add authentication state management (React Context or Redux)
    - _Requirements: 2.1_
  
  - [ ] 13.2 Implement authentication flow
    - Add authentication check on app initialization
    - Implement automatic token refresh
    - Create logout functionality with token cleanup
    - Add authentication guards for protected routes
    - Display user status in terminal header
    - _Requirements: 1.4, 2.1, 2.2_

- [ ] 14. Implement admin ghost mode interface
  - [ ] 14.1 Create admin control panel
    - Build ghost mode toggle in admin interface
    - Display moderation logs with filtering options
    - Show active users list with admin indicators
    - _Requirements: 9.1, 9.2, 6.5_
  
  - [ ] 14.2 Implement admin moderation actions
    - Add edit/delete buttons for posts and threads (visible only to admins)
    - Create thread lock/unlock controls
    - Implement user account management (view violations, manual lock/unlock)
    - Log all admin actions with timestamps
    - _Requirements: 9.3, 9.4, 9.5_

- [ ] 15. Implement error handling and user feedback
  - [ ] 15.1 Create error handling system
    - Implement global error boundary in React
    - Create custom error display component with retro styling
    - Add network error detection and retry mechanism
    - Display "CONNECTION LOST", "INVALID COMMAND", "SYSTEM OVERLOAD" messages
    - _Requirements: 1.5, 3.3_
  
  - [ ] 15.2 Add loading states and feedback
    - Implement loading indicators with terminal-style animations
    - Add success messages for user actions (post created, reply sent)
    - Create rate limit cooldown timer display
    - _Requirements: 3.5_

- [ ] 16. Implement frontend-backend integration and polish
  - [ ] 16.1 Connect all frontend components to API endpoints
    - Wire board list to GET /api/boards
    - Connect thread views to thread and post endpoints
    - Integrate command system with backend command interpreter
    - Add ASCII art upload to post creation flow
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 8.1_
  
  - [ ] 16.2 Add final UI polish and animations
    - Implement smooth transitions between boards
    - Add typing animation for bot posts
    - Create boot-up sequence on app load
    - Fine-tune CRT effects and cursor blinking
    - Optimize font loading and rendering
    - _Requirements: 3.3, 3.5, 4.4, 5.5_
  
  - [ ] 16.3 Write end-to-end tests
    - Test anonymous browsing flow
    - Test user registration and posting flow
    - Test command execution
    - Test admin moderation actions
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 9.3, 9.4_
