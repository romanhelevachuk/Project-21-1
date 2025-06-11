import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useAuth } from '../contexts/AuthContext';

const HeaderContainer = styled.header`
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #00ff88;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: color 0.3s ease;

  &:hover {
    color: #00ff88;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 0.5rem 1.5rem;
  border: 1px solid ${props => props.primary ? '#00ff88' : 'rgba(255, 255, 255, 0.2)'};
  background: ${props => props.primary ? 'rgba(0, 255, 136, 0.1)' : 'transparent'};
  color: ${props => props.primary ? '#00ff88' : '#fff'};
  border-radius: 4px;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.primary ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-1px);
  }
`;

const Header: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          <span>CS2</span>
          <span style={{ color: '#00ff88' }}>Stats</span>
        </Logo>
        <NavLinks>
          {isAuthenticated ? (
            <>
              <NavLink to="/profile">Profile</NavLink>
              <NavLink to="/matches">Matches</NavLink>
              <NavLink to="/analytics">Analytics</NavLink>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <AuthButtons>
              <Button onClick={() => navigate('/login')}>Login</Button>
              <Button primary onClick={() => navigate('/register')}>Register</Button>
            </AuthButtons>
          )}
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header; 