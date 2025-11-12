import React, { useState } from 'react';
import styled from 'styled-components';

const FormContainer = styled.div`
  max-width: 500px;
  margin: 50px auto;
  padding: 30px;
  border: 2px solid #00ff00;
  background: rgba(0, 0, 0, 0.8);
`;

const Title = styled.h1`
  color: #00ff00;
  text-align: center;
  font-family: 'Courier New', monospace;
  text-shadow: 0 0 10px #00ff00;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
  text-transform: uppercase;
`;

const Input = styled.input`
  padding: 10px;
  background: #000;
  border: 1px solid #00ff00;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  font-size: 1em;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 10px #00ff00;
  }
  
  &::placeholder {
    color: #006600;
  }
`;

const Button = styled.button`
  padding: 15px;
  background: #00ff00;
  color: #000;
  border: none;
  font-family: 'Courier New', monospace;
  font-size: 1.1em;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 0 20px #00ff00;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Message = styled.div<{ type: 'success' | 'error' }>`
  padding: 10px;
  border: 1px solid ${props => props.type === 'success' ? '#00ff00' : '#ff0000'};
  color: ${props => props.type === 'success' ? '#00ff00' : '#ff0000'};
  background: rgba(0, 0, 0, 0.5);
  font-family: 'Courier New', monospace;
  text-align: center;
`;

const ToggleLink = styled.button`
  background: none;
  border: none;
  color: #00ff00;
  font-family: 'Courier New', monospace;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 10px;
  
  &:hover {
    text-shadow: 0 0 5px #00ff00;
  }
`;

const InfoBox = styled.div`
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #888;
  color: #888;
  font-family: 'Courier New', monospace;
  font-size: 0.85em;
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
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email, password }
        : { email, username, password };

      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const data = await response.json();
        
        if (isLogin) {
          // Store tokens
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('refresh_token', data.refresh_token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          setMessage({ text: '✅ Login successful!', type: 'success' });
          
          // Call success callback
          setTimeout(() => {
            onLoginSuccess(data.user);
          }, 500);
        } else {
          setMessage({ text: '✅ Registration successful! Please login.', type: 'success' });
          setIsLogin(true);
          setPassword('');
        }
      } else {
        const error = await response.json();
        setMessage({ text: '❌ ' + (error.detail || 'Operation failed'), type: 'error' });
      }
    } catch (error: any) {
      setMessage({ text: '❌ Network error: ' + error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormContainer>
      <Title>👻 {isLogin ? 'LOGIN' : 'REGISTER'} 👻</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Email:</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ghost@neobbs.com"
            required
          />
        </FormGroup>

        {!isLogin && (
          <FormGroup>
            <Label>Username:</Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ghost_user"
              minLength={3}
              maxLength={50}
              required
            />
          </FormGroup>
        )}

        <FormGroup>
          <Label>Password:</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            minLength={8}
            required
          />
        </FormGroup>

        <Button type="submit" disabled={loading}>
          {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
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
          {isLogin ? 'Need an account? Register here' : 'Already have an account? Login here'}
        </ToggleLink>

        {onCancel && (
          <ToggleLink type="button" onClick={onCancel}>
            ← Back to home
          </ToggleLink>
        )}
      </Form>

      {isLogin && (
        <InfoBox>
          <p><strong>Test Admin Account:</strong></p>
          <p>Email: admin@neobbs.com</p>
          <p>Password: admin123456</p>
        </InfoBox>
      )}
    </FormContainer>
  );
};
