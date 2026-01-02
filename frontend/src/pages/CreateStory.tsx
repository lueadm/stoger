import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storyService } from '../services/api';
import '../styles/CreateStory.css';

function CreateStory() {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const story = await storyService.generateStory(summary);
      navigate(`/story/${story.id}/edit`);
    } catch (err) {
      setError('Failed to generate story. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-story">
      <h1>Create a New Story</h1>
      <p className="instructions">
        Provide a brief summary of your story idea, and our AI will generate a
        complete story with chapters for you to review and edit.
      </p>

      <form onSubmit={handleSubmit} className="story-form">
        <div className="form-group">
          <label htmlFor="summary">Story Summary</label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Enter your story idea here... (e.g., 'A young wizard discovers a magical book that transports them to different worlds.')"
            rows={8}
            required
            disabled={loading}
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Generating Story...' : 'Generate Story'}
        </button>
      </form>
    </div>
  );
}

export default CreateStory;
