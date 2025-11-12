import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

const glitch = keyframes`
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
`;

const FormContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 40px;
  background: rgba(20, 20, 20, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0;
  box-shadow: 
    0 0 40px rgba(0, 0, 0, 0.8),
    inset 0 0 40px rgba(0, 0, 0, 0.5);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #ff3366, transparent, #ff3366);
    z-index: -1;
    opacity: 0.3;
  }
`;

const Title = styled.h1`
  color: #fff;
  text-align: center;
  font-family: 'Rajdhani', sans-serif;
  font-size: 2.5em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 4px;
  margin-bottom: 10px;
  
  span {
    color: #ff3366;
    animation: ${glitch} 3s infinite;
  }
`;

const Subtitle = styled.div`
  text-align: center;
  color: #666;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.85em;
  margin-bottom: 40px;
  letter-spacing: 2px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #999;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.85em;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Input = styled.input`
  padding: 15px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-left: 3px solid #ff3366;
  color: #fff;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.1em;
  transition: all 0.3s;
  
  &:focus {
    outline: none;
    border-color: #ff3366;
    box-shadow: 0 0 20px rgba(255, 51, 102, 0.2);
    background: rgba(0, 0, 0, 0.7);
  }
  
  &::placeholder {
    color: #444;
  }
`;

const Button = styled.button`
  padding: 18px;
  background: linear-gradient(135deg, #ff3366 0%, #cc0033 100%);
  color: #fff;
  border: none;
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.2em;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.5s;
  }
  
  &:hover:not(:disabled) {
    box-shadow: 0 0 30px rgba(255, 51, 102, 0.5);
    transform: translateY(-2px);
    
    &::before {
      left: 100%;
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Message = styled.div<{ type: 'success' | 'error' }>`
  padding: 15px;
  border-left: 3px solid ${props => props.type === 'success' ? '#00ff88' : '#ff3366'};
  background: ${props => props.type === 'success' ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 51, 102, 0.1)'};
  color: ${props => props.type === 'success' ? '#00ff88' : '#ff3366'};
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.9em;
`;

const ToggleLink = styled.button`
  background: none;
  border: none;
  color: #ff3366;
  font-family: 'Share Tech Mono', monospace;
  text-decoration: none;
  cursor: pointer;
  margin-top: 10px;
  font-size: 0.9em;
  transition: all 0.3s;
  
  &:hover {
    text-shadow: 0 0 10px rgba(255, 51, 102, 0.5);
    letter-spacing: 1px;
  }
`;

const InfoBox = styled.div`
  margin-top: 30px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.3);
  color: #666;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.85em;
  line-height: 1.8;
  
  strong {
    color: #999;
  }
  
  p {
    margin: 5px 0;
  }
`;

interface LoginFormProps {
  onLoginSuccess: (user: any) => void;
  onCancel?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onCancel }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email, password }
        : { email, username, password };

      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const data = await response.json();
        
        if (isLogin) {
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          setMessage({ text: '✓ ACCESS GRANTED', type: 'success' });
          
          setTimeout(() => {
            onLoginSuccess(data.user);
          }, 500);
        } else {
          setMessage({ text: '✓ REGISTRATION COMPLETE', type: 'success' });
          setIsLogin(true);
          setPassword('');
        }
      } else {
        const error = await response.json();
        setMessage({ text: '✗ ' + (error.detail || 'OPERATION FAILED'), type: 'error' });
      }
    } catch (error: any) {
      setMessage({ text: '✗ CONNECTION ERROR: ' + error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Title>
        {isLogin ? 'L' : 'R'}<span>O</span>{isLogin ? 'GIN' : 'EGISTER'}
      </Title>
      <Subtitle>// {isLogin ? 'AUTHENTICATE' : 'CREATE_ACCOUNT'}</Subtitle>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>EMAIL:</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@system.net"
            required
          />
        </FormGroup>

        {!isLogin && (
          <FormGroup>
            <Label>USERNAME:</Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="operator_name"
              minLength={3}
              maxLength={50}
              required
            />
          </FormGroup>
        )}

        <FormGroup>
          <Label>PASSWORD:</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            minLength={8}
            required
          />
        </FormGroup>

        <Button type="submit" disabled={loading}>
          {loading ? 'PROCESSING...' : isLogin ? 'AUTHENTICATE' : 'CREATE ACCOUNT'}
        </Button>

        {message && (
          <Message type={message.type}>
            {message.text}
          </Message>
        )}

        <ToggleLink type="button" onClick={() => {
          setIsLogin(!isLogin);
          setMessage(null);
        }}>
          {isLogin ? '→ CREATE NEW ACCOUNT' : '→ BACK TO LOGIN'}
        </ToggleLink>

        {onCancel && (
          <ToggleLink type="button" onClick={onCancel}>
            ← RETURN TO MAIN
          </ToggleLink>
        )}
      </Form>

      {isLogin && (
        <InfoBox>
          <p><strong>// TEST_CREDENTIALS</strong></p>
          <p>EMAIL: admin@neobbs.com</p>
          <p>PASS: admin123456</p>
        </InfoBox>
      )}
    </FormContainer>
  );
};
