import React from 'react';
import { CommandOutput } from './CommandOutput';

const WELCOME_TEXT = `
╔════════════════════════════════════════════════════════╗
║           👻 NEO-BBS COMMAND CENTER 👻                 ║
║            Where the Dead Come to Chat                 ║
╚════════════════════════════════════════════════════════╝

    ⚰️  Welcome, mortal... or should I say, IMMORTAL? ⚰️

    You've entered the spectral realm of Neo-BBS, a 
    haunted bulletin board system where threads never 
    truly die - they just get resurrected by our 
    friendly HauntBot! 

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

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

💀 FUN FACTS ABOUT NEO-BBS:

  • Threads older than 30 days get resurrected
  • News Bot delivers daily bulletins
  • ASCII art is the preferred medium
  • Ghost mode lets admins moderate invisibly
  • The Crypt is where threads rest

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎃 QUICK START:

  1. Type /help to see this message again
  2. Browse boards by clicking above
  3. Use /post to start posting!
  4. Check /news for the latest updates

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Type a command to begin your eternal journey... 👻✨`;

export const WelcomeMessage: React.FC = () => {
  return <CommandOutput output={WELCOME_TEXT} type="info" />;
};
