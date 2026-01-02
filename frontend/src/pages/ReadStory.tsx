import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { storyService } from '../services/api';
import { Story } from '../types';
import '../styles/ReadStory.css';

function ReadStory() {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStory();
  }, [id]);

  const loadStory = async () => {
    if (!id) return;
    
    try {
      const data = await storyService.getStory(id);
      setStory(data);
    } catch (err) {
      console.error('Failed to load story:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!story) return <div className="error">Story not found</div>;

  return (
    <div className="read-story">
      <div className="story-header">
        <h1>{story.title}</h1>
        <p className="summary">{story.summary}</p>
        <div className="story-meta">
          <span>Published: {new Date(story.createdAt).toLocaleDateString()}</span>
          <span>{story.chapters.length} chapters</span>
        </div>
      </div>

      <div className="chapters">
        {story.chapters.map((chapter, index) => (
          <div key={chapter.id} className="chapter">
            <h2>Chapter {index + 1}: {chapter.title}</h2>
            <div className="chapter-content">
              <p>{chapter.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReadStory;
