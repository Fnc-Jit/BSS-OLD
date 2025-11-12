import React from 'react';
import styled from 'styled-components';

const WelcomeContainer = styled.div`
  margin: 40px 0;
  padding: 30px;
  background: rgba(20, 20, 20, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-left: 3px solid #ff3366;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.85em;
  color: #666;
  line-height: 1.8;
`;

const Title = styled.div`
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.2em;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
  letter-spacing: 2px;
  
  span {
    color: #ff3366;
  }
`;

const CommandList = styled.div`
  margin: 20px 0;
  
  div {
    margin: 8px 0;
    padding-left: 20px;
    
    &::before {
      content: '→';
      color: #ff3366;
      margin-right: 10px;
    }
  }
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 51, 102, 0.3), transparent);
  margin: 20px 0;
`;

export const WelcomeMessage: React.FC = () => {
  return (
    <WelcomeContainer>
      <Title>// SYSTEM_<span>READY</span></Title>
      
      <div>CHROME NETWORK INITIALIZED</div>
      <div>CONNECTION: SECURE</div>
      <div>STATUS: ONLINE</div>
      
      <Divider />
      
      <div style={{ color: '#999', marginBottom: '15px' }}>AVAILABLE COMMANDS:</div>
      <CommandList>
        <div>/help - Display command list</div>
        <div>/login - Authenticate user</div>
        <div>/admin - Access control panel</div>
        <div>/home - Return to main</div>
      </CommandList>
      
      <Divider />
      
      <div style={{ fontSize: '0.75em', opacity: 0.5 }}>
        Type a command to begin...
      </div>
    </WelcomeContainer>
  );
};
