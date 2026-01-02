import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateStory from './pages/CreateStory';
import EditStory from './pages/EditStory';
import ReadStory from './pages/ReadStory';
import Stories from './pages/Stories';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateStory />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/story/:id/edit" element={<EditStory />} />
          <Route path="/story/:id" element={<ReadStory />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
