import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { GhostModeToggle } from './GhostModeToggle';
import { UserManagement } from './UserManagement';

const PanelContainer = styled.div`
  padding: 20px;
  font-family: 'Courier New', monospace;
  color: #00ff00;
`;

const Header = styled.div`
  border: 2px solid #00ff00;
  padding: 10px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 1.2em;
  text-shadow: 0 0 10px #00ff00;
`;

const Section = styled.div`
  border: 1px solid #00ff00;
  padding: 15px;
  margin-bottom: 20px;
  background: rgba(0, 255, 0, 0.05);
`;

const SectionTitle = styled.h3`
  color: #00ff00;
  margin: 0 0 15px 0;
  font-size: 1.1em;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const PermissionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 10px 0;
`;

const PermissionItem = styled.li`
  padding: 5px 0;
  
  &::before {
    content: '> ';
    color: #00ff00;
  }
`;

const TabContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const Tab = styled.button<{ active: boolean }>`
  background: ${props => props.active ? '#00ff00' : 'transparent'};
  color: ${props => props.active ? '#000' : '#00ff00'};
  border: 2px solid #00ff00;
  padding: 10px 20px;
  font-family: 'Courier New', monospace;
  font-size: 1em;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.3s;
  
  &:hover {
    background: #00ff00;
    color: #000;
    box-shadow: 0 0 10px #00ff00;
  }
`;

interface AdminPermissions {
  can_lock_threads: boolean;
  can_pin_threads: boolean;
  can_manage_users: boolean;
  can_view_mod_logs: boolean;
  can_access_admin_panel: boolean;
  ghost_mode_available: boolean;
  is_ghost_mode: boolean;
}

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'logs'>('overview');
  const [permissions, setPermissions] = useState<AdminPermissions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${apiUrl}/api/admin/permissions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPermissions(data.permissions);
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <PanelContainer>
        <Header>💀 LOADING ADMIN PANEL... 💀</Header>
      </PanelContainer>
    );
  }

  if (!permissions?.can_access_admin_panel) {
    return (
      <PanelContainer>
        <Header>⛔ ACCESS DENIED ⛔</Header>
        <Section>
          <p>You do not have permission to access the admin panel.</p>
        </Section>
      </PanelContainer>
    );
  }

  return (
    <PanelContainer>
      <Header>
        👻 ADMIN CONTROL PANEL 👻
        <div style={{ fontSize: '0.7em', marginTop: '5px' }}>
          [GHOST MODE: {permissions.is_ghost_mode ? 'ACTIVE' : 'INACTIVE'}]
        </div>
      </Header>

      <TabContainer>
        <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
          Overview
        </Tab>
        <Tab active={activeTab === 'users'} onClick={() => setActiveTab('users')}>
          User Management
        </Tab>
        <Tab active={activeTab === 'logs'} onClick={() => setActiveTab('logs')}>
          Mod Logs
        </Tab>
      </TabContainer>

      {activeTab === 'overview' && (
        <>
          <Section>
            <SectionTitle>🔑 Admin Permissions</SectionTitle>
            <PermissionList>
              <PermissionItem>Lock/Unlock Threads: {permissions.can_lock_threads ? '✓' : '✗'}</PermissionItem>
              <PermissionItem>Pin/Unpin Threads: {permissions.can_pin_threads ? '✓' : '✗'}</PermissionItem>
              <PermissionItem>Manage Users: {permissions.can_manage_users ? '✓' : '✗'}</PermissionItem>
              <PermissionItem>View Mod Logs: {permissions.can_view_mod_logs ? '✓' : '✗'}</PermissionItem>
              <PermissionItem>Ghost Mode: {permissions.ghost_mode_available ? '✓' : '✗'}</PermissionItem>
            </PermissionList>
          </Section>

          <Section>
            <SectionTitle>👻 Ghost Mode Control</SectionTitle>
            <GhostModeToggle 
              isGhostMode={permissions.is_ghost_mode}
              onToggle={fetchPermissions}
            />
          </Section>
        </>
      )}

      {activeTab === 'users' && (
        <Section>
          <SectionTitle>👥 User Management</SectionTitle>
          <UserManagement />
        </Section>
      )}

      {activeTab === 'logs' && (
        <Section>
          <SectionTitle>📋 Moderation Logs</SectionTitle>
          <p style={{ color: '#888' }}>Moderation logs will be displayed here...</p>
        </Section>
      )}
    </PanelContainer>
  );
};
