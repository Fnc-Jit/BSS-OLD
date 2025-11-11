# Neo-BBS Frontend

💀 ASCII from the Afterlife - React Frontend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env if needed
```

3. Run development server:
```bash
npm start
```

The app will open at http://localhost:3000

## Available Scripts

- `npm start` - Run development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App

## Project Structure

```
frontend/
├── public/           # Static files
├── src/
│   ├── components/   # React components
│   ├── services/     # API services
│   ├── styles/       # Styled components
│   ├── types/        # TypeScript types
│   └── App.tsx       # Main app component
└── package.json      # Dependencies
```

## Features

- Retro terminal UI with CRT effects
- Board-specific theming
- Command-line interface
- ASCII art rendering
- Real-time updates
