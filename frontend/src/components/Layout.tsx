import { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import '../styles/Layout.css';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const { isAuthenticated, user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <h1 className="logo">
            <Link to="/">Stoger</Link>
          </h1>
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/create" className="nav-link">Create Story</Link>
            <Link to="/stories" className="nav-link">Browse Stories</Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="nav-link">Profile</Link>
                <button onClick={handleLogout} className="nav-link nav-button">
                  Logout ({user?.username})
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 Stoger - AI-Powered Story Generator</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
