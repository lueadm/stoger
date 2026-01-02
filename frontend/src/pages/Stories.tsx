import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storyService } from '../services/api';
import { Story } from '../types';
import '../styles/Stories.css';

function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const data = await storyService.getStories();
      setStories(data);
    } catch (err) {
      console.error('Failed to load stories:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="stories">
      <h1>Browse Stories</h1>
      
      {stories.length === 0 ? (
        <div className="empty-state">
          <p>No stories published yet.</p>
          <Link to="/create" className="btn btn-primary">
            Create the First Story
          </Link>
        </div>
      ) : (
        <div className="stories-grid">
          {stories.map((story) => (
            <Link
              key={story.id}
              to={`/story/${story.id}`}
              className="story-card"
            >
              <h2>{story.title}</h2>
              <p className="summary">{story.summary}</p>
              <div className="story-meta">
                <span>{story.chapters.length} chapters</span>
                <span>{new Date(story.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Stories;
