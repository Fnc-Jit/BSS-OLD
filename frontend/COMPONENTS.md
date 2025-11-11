# Neo-BBS Frontend Components

## Terminal Components

### TerminalContainer
Main container with CRT effects, scanlines, and screen glow.
- Provides retro terminal aesthetic
- Includes flickering animation
- CRT curvature and shadow effects

### BlinkingCursor
Animated cursor for command prompts.
- Classic blinking animation
- Themed color support

### LoadingAnimation
Loading indicator with progress bar.
- Animated dots
- Optional progress bar
- Customizable message

### BootSequence
System boot animation on app load.
- Sequential message display
- Haunted system initialization
- Calls onComplete callback when done

## Theme Components

### ThemeProvider
Context provider for board-specific themes.
- Manages theme state
- Provides theme switching
- Includes 4 themes: default, crypt, parlor, comedy-night

### ASCIIHeader
Displays board-specific ASCII art headers.
- Shows theme-specific art
- Fallback to default header
- Glowing text effect

### ASCIIBorder
Decorative border component with corner decorations.
- Supports solid, double, dashed borders
- Customizable corner characters
- Themed colors

## Theme Configurations

### Default Theme
- Green on black terminal
- Courier New font
- Standard borders

### Crypt Theme (/crypt)
- Creepster font
- Red accents
- Double borders
- Gothic ASCII art

### Parlor Theme (/parlor)
- Standard monospace
- Orange accents
- Solid borders
- Ghost-themed art

### Comedy Night Theme (/comedy-night)
- Press Start 2P font
- Magenta accents
- Dashed borders
- Comedy-themed art

## Usage Example

```tsx
import { ThemeProvider } from './components/Theme';
import { TerminalContainer } from './components/Terminal';
import { ASCIIHeader, ASCIIBorder } from './components/Theme';

function App() {
  return (
    <ThemeProvider>
      <TerminalContainer>
        <ASCIIHeader />
        <ASCIIBorder borderType="double" cornerChar="💀">
          <p>Your content here</p>
        </ASCIIBorder>
      </TerminalContainer>
    </ThemeProvider>
  );
}
```

## Styling

All components use styled-components with theme support. The theme is accessible via:

```tsx
import { useTheme } from './components/Theme';

const MyComponent = () => {
  const { theme, setTheme } = useTheme();
  
  // Switch to crypt theme
  setTheme('crypt');
  
  return <div>Theme: {theme.boardId}</div>;
};
```
