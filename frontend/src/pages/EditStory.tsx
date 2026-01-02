import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { storyService } from '../services/api';
import { Story, Chapter } from '../types';
import '../styles/EditStory.css';

function EditStory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingChapter, setEditingChapter] = useState<string | null>(null);
  const [chapterContent, setChapterContent] = useState('');

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

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapter(chapter.id);
    setChapterContent(chapter.content);
  };

  const handleSaveChapter = async (chapterId: string) => {
    if (!id) return;

    try {
      await storyService.updateChapter(id, chapterId, chapterContent);
      setEditingChapter(null);
      await loadStory();
    } catch (err) {
      console.error('Failed to save chapter:', err);
    }
  };

  const handleRegenerateChapter = async (chapterId: string) => {
    if (!id) return;

    try {
      await storyService.regenerateChapter(id, chapterId);
      await loadStory();
    } catch (err) {
      console.error('Failed to regenerate chapter:', err);
    }
  };

  const handlePublish = async () => {
    if (!id) return;

    try {
      await storyService.publishStory(id);
      navigate(`/story/${id}`);
    } catch (err) {
      console.error('Failed to publish story:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!story) return <div>Story not found</div>;

  return (
    <div className="edit-story">
      <div className="story-header">
        <h1>{story.title}</h1>
        <p className="summary">{story.summary}</p>
        <button onClick={handlePublish} className="btn btn-primary">
          Publish Story
        </button>
      </div>

      <div className="chapters">
        {story.chapters.map((chapter) => (
          <div key={chapter.id} className="chapter-card">
            <div className="chapter-header">
              <h2>{chapter.title}</h2>
              <div className="chapter-actions">
                {editingChapter === chapter.id ? (
                  <>
                    <button
                      onClick={() => handleSaveChapter(chapter.id)}
                      className="btn btn-small btn-primary"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingChapter(null)}
                      className="btn btn-small btn-secondary"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditChapter(chapter)}
                      className="btn btn-small btn-secondary"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleRegenerateChapter(chapter.id)}
                      className="btn btn-small btn-secondary"
                    >
                      Regenerate with AI
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="chapter-content">
              {editingChapter === chapter.id ? (
                <textarea
                  value={chapterContent}
                  onChange={(e) => setChapterContent(e.target.value)}
                  rows={15}
                  className="chapter-editor"
                />
              ) : (
                <p>{chapter.content}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EditStory;
