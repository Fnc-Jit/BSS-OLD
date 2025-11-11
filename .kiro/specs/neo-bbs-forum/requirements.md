# Requirements Document

## Introduction

Neo-BBS is a retro-style bulletin board system that reimagines the classic 1980s BBS experience in a modern web browser. The system combines vintage terminal aesthetics (ANSI/ASCII art, CRT effects, monospace fonts) with contemporary technologies (React frontend, Python backend, MongoDB database) and AI-powered moderation. Each thematic board offers a unique haunted or comedic atmosphere, with an AI sysop bot that generates daily bulletins, moderates content, and resurrects inactive threads.

## Glossary

- **Neo-BBS System**: The complete bulletin board application including frontend, backend, database, and AI components
- **Board**: A thematic discussion area within the system (e.g., /crypt, /parlor, /comedy-night)
- **Thread**: A discussion topic created by a user containing an initial post
- **Post**: A message within a thread, either the initial message or a reply
- **Sysop Bot**: The AI-powered system operator that moderates and generates content
- **HauntBot**: The AI component that resurrects inactive threads
- **News Bot**: The AI component that generates daily bulletins and thread summaries
- **Mod Bot**: The AI component that detects and handles spam or policy violations
- **User**: A registered account holder who can create threads and post replies
- **Anonymous Viewer**: An unauthenticated visitor who can only read content
- **Admin**: A privileged user with ghost mode access and moderation capabilities
- **ASCII Art Parser**: The MCP plugin that converts images to ASCII art
- **Command Interpreter**: The system component that processes BBS-style commands (e.g., /post, /read, /news)

## Requirements

### Requirement 1

**User Story:** As an anonymous viewer, I want to browse threads and posts across different boards, so that I can explore the BBS content without creating an account

#### Acceptance Criteria

1. THE Neo-BBS System SHALL display all available boards with their thematic identifiers
2. WHEN an anonymous viewer selects a board, THE Neo-BBS System SHALL display all threads within that board with timestamps and author information
3. WHEN an anonymous viewer selects a thread, THE Neo-BBS System SHALL display the initial post and all replies in chronological order
4. THE Neo-BBS System SHALL prevent anonymous viewers from creating threads or posting replies
5. THE Neo-BBS System SHALL render all content using the retro terminal aesthetic with monospace fonts and appropriate theme styling

### Requirement 2

**User Story:** As a registered user, I want to create new threads and post replies, so that I can participate in discussions across different boards

#### Acceptance Criteria

1. WHEN a user submits a new thread, THE Neo-BBS System SHALL store the thread with user ID, timestamp, board tag, and message body
2. WHEN a user submits a reply to an existing thread, THE Neo-BBS System SHALL append the reply with user ID and timestamp
3. THE Neo-BBS System SHALL validate that thread titles contain between 3 and 100 characters
4. THE Neo-BBS System SHALL validate that post bodies contain between 1 and 5000 characters
5. WHERE a user includes the /ascii command, THE Neo-BBS System SHALL invoke the ASCII Art Parser to convert uploaded images

### Requirement 3

**User Story:** As a user, I want each board to have a distinct visual theme and atmosphere, so that navigating between boards feels like entering different haunted spaces

#### Acceptance Criteria

1. WHERE the board is /crypt, THE Neo-BBS System SHALL apply gothic fonts (Creepster, Nosifer) and graveyard-themed ASCII borders
2. WHERE the board is /comedy-night, THE Neo-BBS System SHALL apply comical fonts (Press Start 2P, Silkscreen) and inject ghost puns into UI text
3. THE Neo-BBS System SHALL render all boards with green-on-black CRT terminal styling and blinking cursor effects
4. THE Neo-BBS System SHALL display thematic ASCII art headers unique to each board
5. WHEN a user navigates between boards, THE Neo-BBS System SHALL transition with a faux loading animation

### Requirement 4

**User Story:** As a system administrator, I want the News Bot to generate daily bulletins, so that users receive automated summaries and site-wide announcements

#### Acceptance Criteria

1. WHEN the system clock reaches midnight UTC, THE Neo-BBS System SHALL trigger the News Bot to generate a daily bulletin
2. THE News Bot SHALL analyze thread activity from the previous 24 hours and generate a summary
3. THE News Bot SHALL post the bulletin as a pinned thread in a designated /news board
4. THE Neo-BBS System SHALL format News Bot posts with distinctive styling to indicate automated content
5. THE News Bot SHALL include thread titles, activity metrics, and thematic commentary in each bulletin

### Requirement 5

**User Story:** As a system administrator, I want the HauntBot to resurrect inactive threads, so that forgotten discussions are revived with eerie commentary

#### Acceptance Criteria

1. WHEN a thread has received no replies for 72 hours, THE Neo-BBS System SHALL mark the thread as eligible for resurrection
2. THE HauntBot SHALL generate a contextually relevant revival message with haunted theming
3. THE HauntBot SHALL post the revival message as a reply to the inactive thread
4. THE Neo-BBS System SHALL limit HauntBot resurrections to one per thread
5. THE HauntBot SHALL include thematic elements such as ghost emojis and spooky phrases in revival messages

### Requirement 6

**User Story:** As a system administrator, I want the Mod Bot to detect and handle spam, so that the boards remain free of low-quality or malicious content

#### Acceptance Criteria

1. WHEN a user submits a post, THE Mod Bot SHALL analyze the content for spam indicators
2. IF the Mod Bot detects repeated identical posts from the same user, THEN THE Neo-BBS System SHALL issue an automated warning
3. IF the Mod Bot detects three spam violations from a single user, THEN THE Neo-BBS System SHALL lock the user's posting ability for 24 hours
4. THE Mod Bot SHALL flag posts containing excessive external links or promotional content
5. THE Neo-BBS System SHALL log all Mod Bot actions with timestamps and reasoning for admin review

### Requirement 7

**User Story:** As a user, I want to interact with the BBS using text-based commands, so that I can navigate and post using a retro command-line interface

#### Acceptance Criteria

1. WHEN a user enters /post, THE Command Interpreter SHALL display the thread creation interface
2. WHEN a user enters /read [thread_id], THE Command Interpreter SHALL display the specified thread
3. WHEN a user enters /news, THE Command Interpreter SHALL display the latest News Bot bulletin
4. WHEN a user enters /who, THE Command Interpreter SHALL display currently active users
5. WHEN a user enters /back, THE Command Interpreter SHALL navigate to the previous screen

### Requirement 8

**User Story:** As a user, I want to upload images that are converted to ASCII art, so that I can share visual content in the retro terminal aesthetic

#### Acceptance Criteria

1. WHEN a user uploads an image file, THE ASCII Art Parser SHALL convert the image to ASCII representation
2. THE ASCII Art Parser SHALL support common image formats including JPEG, PNG, and GIF
3. THE Neo-BBS System SHALL limit ASCII art output to 80 characters width and 40 lines height
4. THE Neo-BBS System SHALL render the ASCII art using monospace fonts with appropriate contrast
5. WHERE the conversion fails, THE Neo-BBS System SHALL display an error message and reject the upload

### Requirement 9

**User Story:** As an admin, I want ghost mode access to moderate content invisibly, so that I can manage the boards without disrupting the user experience

#### Acceptance Criteria

1. WHERE a user has admin privileges, THE Neo-BBS System SHALL provide access to ghost mode
2. WHILE in ghost mode, THE Neo-BBS System SHALL hide the admin's presence from the /who command output
3. WHILE in ghost mode, THE Neo-BBS System SHALL allow the admin to edit or delete any post
4. WHILE in ghost mode, THE Neo-BBS System SHALL allow the admin to lock or unlock threads
5. THE Neo-BBS System SHALL log all ghost mode actions with admin ID and timestamp

### Requirement 10

**User Story:** As a developer, I want the system to use MongoDB with thematic board clusters, so that each board maintains independent data with appropriate lifecycle management

#### Acceptance Criteria

1. THE Neo-BBS System SHALL store thread and post data in MongoDB collections organized by board identifier
2. THE Neo-BBS System SHALL maintain separate database clusters for /crypt, /parlor, and /comedy-night boards
3. WHEN a thread is created, THE Neo-BBS System SHALL store the document in the collection corresponding to its board tag
4. THE Neo-BBS System SHALL index threads by timestamp and board tag for efficient retrieval
5. THE Neo-BBS System SHALL implement data retention policies appropriate to each board's theme
