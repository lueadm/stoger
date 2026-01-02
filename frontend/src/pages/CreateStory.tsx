import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storyService } from '../services/api';
import { getErrorMessage } from '../utils/errorHandler';
import '../styles/CreateStory.css';

const MAX_SUMMARY_LENGTH = 1000;

function CreateStory() {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_SUMMARY_LENGTH) {
      setSummary(value);
      setError(''); // Clear error when user starts typing
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!summary.trim()) {
      setError('Please enter a story summary.');
      return;
    }

    if (summary.length < 20) {
      setError('Summary must be at least 20 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const story = await storyService.generateStory(summary);
      setSuccess(true);
      
      // Delay redirect slightly to show success state
      setTimeout(() => {
        navigate(`/story/${story.id}/edit`);
      }, 1500);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to generate story. Please try again.'));
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    if (!summary.trim()) {
      setError('Please enter a story summary.');
      return;
    }

    if (summary.length < 20) {
      setError('Summary must be at least 20 characters long.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const story = await storyService.generateStory(summary);
      setSuccess(true);
      
      // Delay redirect slightly to show success state
      setTimeout(() => {
        navigate(`/story/${story.id}/edit`);
      }, 1500);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to generate story. Please try again.'));
      setLoading(false);
    }
  };

  const remainingChars = MAX_SUMMARY_LENGTH - summary.length;
  const isNearLimit = remainingChars < 100;

  return (
    <div className="create-story">
      <h1>Create a New Story</h1>
      <p className="instructions">
        Provide a brief summary of your story idea, and our AI will generate a
        complete story with chapters for you to review and edit.
      </p>

      <form onSubmit={handleSubmit} className="story-form">
        <div className="form-group">
          <label htmlFor="summary">
            Story Summary
            <span className={`char-counter ${isNearLimit ? 'char-counter-warning' : ''}`}>
              {remainingChars} characters remaining
            </span>
          </label>
          <textarea
            id="summary"
            value={summary}
            onChange={handleSummaryChange}
            placeholder="Enter your story idea here... (e.g., 'A young wizard discovers a magical book that transports them to different worlds.')"
            rows={8}
            required
            disabled={loading || success}
            className={error ? 'input-error' : ''}
          />
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={handleRetry}
              disabled={loading}
            >
              Retry
            </button>
          </div>
        )}

        {success && (
          <div className="success-message">
            <svg className="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p>Story generated successfully! Redirecting to editor...</p>
          </div>
        )}

        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p className="loading-text">Generating your story with AI...</p>
            <p className="loading-subtext">This may take a few moments</p>
          </div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary btn-full" 
          disabled={loading || success || !summary.trim()}
        >
          {loading ? 'Generating Story...' : success ? 'Success!' : 'Generate Story'}
        </button>
      </form>
    </div>
  );
}

export default CreateStory;
