import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Layout.css';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
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
