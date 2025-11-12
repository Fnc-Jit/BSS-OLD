import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  font-family: 'Courier New', monospace;
`;

const SearchBox = styled.input`
  width: 100%;
  padding: 10px;
  background: #000;
  border: 2px solid #00ff00;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: 1em;
  margin-bottom: 20px;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 10px #00ff00;
  }
  
  &::placeholder {
    color: #006600;
  }
`;

const UserCard = styled.div`
  border: 1px solid #00ff00;
  padding: 15px;
  margin-bottom: 15px;
  background: rgba(0, 255, 0, 0.05);
  transition: all 0.3s;
  
  &:hover {
    background: rgba(0, 255, 0, 0.1);
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
  }
`;

const UserHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const UserName = styled.div`
  font-size: 1.1em;
  font-weight: bold;
  color: #00ff00;
`;

const UserRole = styled.span<{ role: string }>`
  padding: 3px 10px;
  border: 1px solid ${props => props.role === 'admin' ? '#ff00ff' : '#00ff00'};
  color: ${props => props.role === 'admin' ? '#ff00ff' : '#00ff00'};
  font-size: 0.8em;
  text-transform: uppercase;
`;

const UserInfo = styled.div`
  color: #888;
  font-size: 0.9em;
  margin: 5px 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ActionButton = styled.button<{ variant?: 'danger' | 'success' }>`
  background: transparent;
  color: ${props => props.variant === 'danger' ? '#ff0000' : props.variant === 'success' ? '#00ff00' : '#00ff00'};
  border: 1px solid ${props => props.variant === 'danger' ? '#ff0000' : props.variant === 'success' ? '#00ff00' : '#00ff00'};
  padding: 5px 15px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.3s;
  
  &:hover {
    background: ${props => props.variant === 'danger' ? '#ff0000' : props.variant === 'success' ? '#00ff00' : '#00ff00'};
    color: #000;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LockStatus = styled.div<{ locked: boolean }>`
  color: ${props => props.locked ? '#ff0000' : '#00ff00'};
  font-size: 0.9em;
  margin: 5px 0;
  
  &::before {
    content: '${props => props.locked ? '🔒' : '🔓'}';
    margin-right: 5px;
  }
`;

const Message = styled.div<{ type: 'success' | 'error' }>`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid ${props => props.type === 'success' ? '#00ff00' : '#ff0000'};
  color: ${props => props.type === 'success' ? '#00ff00' : '#ff0000'};
  background: rgba(0, 0, 0, 0.5);
`;

const LockDurationInput = styled.input`
  width: 60px;
  padding: 5px;
  background: #000;
  border: 1px solid #00ff00;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  margin: 0 5px;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 5px #00ff00;
  }
`;

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  created_at: string;
  is_locked: boolean;
  spam_warnings?: number;
}

export const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchedUser, setSearchedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [lockDuration, setLockDuration] = useState<number>(24);

  const searchUser = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/admin/users/${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSearchedUser(data);
      } else {
        setMessage({ text: 'User not found', type: 'error' });
        setSearchedUser(null);
      }
    } catch (error) {
      setMessage({ text: 'Failed to search user', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const lockUser = async (userId: string) => {
    setLoading(true);
    setMessage(null);
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/admin/users/lock', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          user_id: userId,
          lock_duration_hours: lockDuration
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage({ text: data.message, type: 'success' });
        searchUser(); // Refresh user data
      } else {
        const error = await response.json();
        setMessage({ text: error.detail || 'Failed to lock user', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const unlockUser = async (userId: string) => {
    setLoading(true);
    setMessage(null);
    
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/admin/users/${userId}/unlock`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessage({ text: data.message, type: 'success' });
        searchUser(); // Refresh user data
      } else {
        setMessage({ text: 'Failed to unlock user', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Network error', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <SearchBox
        type="text"
        placeholder="Enter User ID to search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && searchUser()}
      />
      
      <ActionButton onClick={searchUser} disabled={loading || !searchTerm.trim()}>
        {loading ? 'Searching...' : 'Search User'}
      </ActionButton>

      {message && (
        <Message type={message.type}>
          {message.text}
        </Message>
      )}

      {searchedUser && (
        <UserCard>
          <UserHeader>
            <UserName>{searchedUser.username}</UserName>
            <UserRole role={searchedUser.role}>{searchedUser.role}</UserRole>
          </UserHeader>
          
          <UserInfo>📧 {searchedUser.email}</UserInfo>
          <UserInfo>🆔 {searchedUser.id}</UserInfo>
          <UserInfo>📅 Joined: {new Date(searchedUser.created_at).toLocaleDateString()}</UserInfo>
          {searchedUser.spam_warnings !== undefined && (
            <UserInfo>⚠️ Spam Warnings: {searchedUser.spam_warnings}</UserInfo>
          )}
          
          <LockStatus locked={searchedUser.is_locked}>
            {searchedUser.is_locked ? 'Account Locked' : 'Account Active'}
          </LockStatus>

          <ActionButtons>
            {!searchedUser.is_locked ? (
              <>
                <LockDurationInput
                  type="number"
                  min="1"
                  max="168"
                  value={lockDuration}
                  onChange={(e) => setLockDuration(parseInt(e.target.value) || 24)}
                />
                <ActionButton 
                  variant="danger"
                  onClick={() => lockUser(searchedUser.id)}
                  disabled={loading}
                >
                  Lock for {lockDuration}h
                </ActionButton>
              </>
            ) : (
              <ActionButton 
                variant="success"
                onClick={() => unlockUser(searchedUser.id)}
                disabled={loading}
              >
                Unlock Account
              </ActionButton>
            )}
          </ActionButtons>
        </UserCard>
      )}
    </Container>
  );
};
