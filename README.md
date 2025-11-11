# 💀 Neo-BBS: ASCII from the Afterlife 🧟

A retro-style bulletin board system resurrected from the depths of the digital graveyard with a modern twist. Inspired by classic 1980s BBS systems, Neo-BBS reimagines the vintage online forum experience in the browser using React and Python, complete with text-based navigation, thread replies, and ANSI/ASCII-style theming.

But this time, it's haunted.

## 🧠 Features

- **Retro Terminal UI**: Green-on-black CRT vibes, blinking cursors, and glitchy animations
- **Thematic Boards**: Each board has unique styling (gothic, comedic, etc.)
- **AI-Powered Bots**:
  - **News Bot**: Generates daily bulletins and thread summaries
  - **HauntBot**: Resurrects inactive threads with eerie commentary
  - **Mod Bot**: Detects and handles spam automatically
- **Command-Line Interface**: Navigate using BBS-style commands (`/post`, `/read`, `/news`, etc.)
- **ASCII Art**: Upload images that are converted to ASCII art
- **Ghost Mode**: Admin moderation without disrupting users

## 🏗️ Tech Stack

### Frontend
- React 18+ with TypeScript
- Styled Components for dynamic theming
- Custom terminal emulator
- Fonts: Creepster, Nosifer, Press Start 2P, Silkscreen

### Backend
- Python 3.11+ with FastAPI
- MongoDB Atlas (3 thematic clusters)
- OpenAI API for AI bots
- JWT authentication
- APScheduler for automated tasks

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- MongoDB Atlas account
- OpenAI API key

### Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

Visit http://localhost:3000 to enter the haunted BBS.

## 📁 Project Structure

```
neo-bbs/
├── backend/          # Python FastAPI backend
│   ├── app/
│   │   ├── api/      # API endpoints
│   │   ├── models/   # Data models
│   │   ├── services/ # AI bots and business logic
│   │   └── main.py   # FastAPI app
│   └── tests/        # Backend tests
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   └── App.tsx      # Main app
│   └── public/       # Static assets
└── .kiro/
    └── specs/        # Feature specifications
```

## 🎮 Usage

### For Users
1. Browse boards anonymously or register an account
2. Create threads and post replies
3. Use commands: `/post`, `/read [id]`, `/news`, `/who`, `/back`
4. Upload images to convert to ASCII art with `/ascii`

### For Admins
1. Enable ghost mode for invisible moderation
2. Edit/delete posts and threads
3. Lock threads or user accounts
4. Review moderation logs

## 🧪 Demo Scenarios

- "The Crypt" board auto-generates a daily necrology bulletin
- Users post ASCII memes using `/ascii upload`
- Inactive threads get resurrected by HauntBot
- In `/comedy-night`, puns and skull emojis fill the margins

## 📝 Development

This project uses spec-driven development. See `.kiro/specs/neo-bbs-forum/` for:
- `requirements.md` - Feature requirements
- `design.md` - Technical design
- `tasks.md` - Implementation tasks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🎃 Credits

Built with Kiro AI - where code meets the supernatural.
