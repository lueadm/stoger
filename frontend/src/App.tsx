import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import CreateStory from './pages/CreateStory';
import EditStory from './pages/EditStory';
import ReadStory from './pages/ReadStory';
import Stories from './pages/Stories';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuthStore } from './store/authStore';

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/create" 
            element={
              <ProtectedRoute>
                <CreateStory />
              </ProtectedRoute>
            } 
          />
          <Route path="/stories" element={<Stories />} />
          <Route path="/story/:id/edit" element={<EditStory />} />
          <Route path="/story/:id" element={<ReadStory />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
