import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Creepster&family=Press+Start+2P&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Courier New', monospace;
    background-color: #000;
    color: #00ff00;
    overflow: hidden;
  }

  #root {
    width: 100vw;
    height: 100vh;
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background: #000;
  }

  ::-webkit-scrollbar-thumb {
    background: #00ff00;
    border: 1px solid #000;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #00cc00;
  }
`;
