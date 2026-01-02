import { useAuthStore } from '../store/authStore';
import '../styles/UserProfile.css';

function UserProfile() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <p>No user data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">User Profile</h2>
        
        <div className="profile-info">
          <div className="profile-item">
            <label>Username:</label>
            <span>{user.username}</span>
          </div>
          
          <div className="profile-item">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          
          <div className="profile-item">
            <label>User ID:</label>
            <span className="profile-id">{user.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
