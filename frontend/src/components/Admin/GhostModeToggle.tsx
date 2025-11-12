import React, { useState } from 'react';
import styled from 'styled-components';

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #00ff00;
`;

const ToggleButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? '#00ff00' : '#000'};
  color: ${props => props.active ? '#000' : '#00ff00'};
  border: 2px solid #00ff00;
  padding: 10px 30px;
  font-family: 'Courier New', monospace;
  font-size: 1em;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.3s;
  position: relative;
  
  &:hover {
    box-shadow: 0 0 20px #00ff00;
  }
  
  &::before {
    content: '${props => props.active ? '👻' : '👤'}';
    margin-right: 10px;
  }
`;

const StatusText = styled.div<{ active: boolean }>`
  color: ${props => props.active ? '#00ff00' : '#888'};
  font-size: 0.9em;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Message = styled.div<{ type: 'success' | 'error' }>`
  margin-top: 10px;
  padding: 10px;
  border: 1px solid ${props => props.type === 'success' ? '#00ff00' : '#ff0000'};
  color: ${props => props.type === 'success' ? '#00ff00' : '#ff0000'};
  background: rgba(0, 0, 0, 0.5);
  animation: fadeIn 0.3s;
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

interface GhostModeToggleProps {
  isGhostMode: boolean;
  onToggle: () => void;
}

export const GhostModeToggle: React.FC<GhostModeToggleProps> = ({ isGhostMode, onToggle }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleToggle = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/admin/ghost-mode', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ enabled: !isGhostMode })
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ text: data.message, type: 'success' });
        onToggle();
      } else {
        setMessage({ text: 'Failed to toggle ghost mode', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToggleContainer>
        <ToggleButton 
          active={isGhostMode} 
          onClick={handleToggle}
          disabled={loading}
        >
          {loading ? 'Processing...' : isGhostMode ? 'Disable Ghost Mode' : 'Enable Ghost Mode'}
        </ToggleButton>
        <StatusText active={isGhostMode}>
          Status: {isGhostMode ? 'INVISIBLE' : 'VISIBLE'}
        </StatusText>
      </ToggleContainer>
      
      {message && (
        <Message type={message.type}>
          {message.text}
        </Message>
      )}
      
      <div style={{ marginTop: '15px', color: '#888', fontSize: '0.85em' }}>
        <p>💀 Ghost Mode makes you invisible to regular users</p>
        <p>📝 Your actions will still be logged</p>
        <p>🔍 You won't appear in /who command output</p>
      </div>
    </div>
  );
};
