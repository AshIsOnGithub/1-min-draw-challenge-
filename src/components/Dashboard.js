import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Dashboard({ setView }) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (user?.user_metadata?.username) {
        setUsername(user.user_metadata.username);
      }
    };
    getUserData();
  }, []);

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { username }
      });
      if (error) throw error;
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <div className="welcome-section">
          <h1>Welcome{username && `, ${username}`}! 👋</h1>
          <p>Ready to unleash your creativity?</p>
        </div>

        <form onSubmit={handleUsernameSubmit} className="username-form">
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Choose your artist name"
            />
            <label>Your Display Name</label>
            <span className="input-border" />
          </div>
          <button 
            type="submit" 
            className="save-button"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Name'}
          </button>
        </form>

        <button 
          onClick={() => setView('challenge')}
          className="start-button"
          disabled={!username}
        >
          🎨 Start Drawing Challenge
          <span className="hover-effect"></span>
        </button>

        <div className="art-preview">
          {/* Floating pencil elements removed */}
        </div>
      </div>
    </div>
  );
}