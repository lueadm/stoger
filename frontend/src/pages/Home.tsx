import { Link } from 'react-router-dom';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <h1>Welcome to Stoger</h1>
        <p className="subtitle">AI-Powered Story Generator</p>
        <p className="description">
          Transform your ideas into compelling stories with AI assistance.
          Create, edit, and publish stories with intelligent chapter generation.
        </p>
        <div className="cta-buttons">
          <Link to="/create" className="btn btn-primary">
            Start Creating
          </Link>
          <Link to="/stories" className="btn btn-secondary">
            Browse Stories
          </Link>
        </div>
      </section>

      <section className="features">
        <h2>Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>🤖 AI Generation</h3>
            <p>
              Input a summary and let AI generate a complete story with title,
              chapters, and content.
            </p>
          </div>
          <div className="feature-card">
            <h3>✏️ Collaborative Editing</h3>
            <p>
              Review and edit each chapter manually or ask AI to regenerate
              specific parts.
            </p>
          </div>
          <div className="feature-card">
            <h3>📚 Publishing</h3>
            <p>
              Publish your stories for other users to discover and read.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
