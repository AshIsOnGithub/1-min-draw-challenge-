import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import CanvasChallenge from './components/CanvasChallenge';
import VotingGallery from './components/VotingGallery';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [session, setSession] = useState(null);
  const [view, setView] = useState('dashboard');

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    const createShootingStar = () => {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      document.body.appendChild(star);
      
      setTimeout(() => star.remove(), 2000);
    };
    
    const interval = setInterval(createShootingStar, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <nav>
        {session && (
          <>
            <button onClick={() => setView('dashboard')}>Dashboard</button>
            <button onClick={() => setView('gallery')}>Gallery</button>
            <button onClick={() => supabase.auth.signOut()}>Logout</button>
          </>
        )}
      </nav>
      
      {!session ? (
        <Auth />
      ) : view === 'dashboard' ? (
        <Dashboard setView={setView} />
      ) : (
        <>
          {view === 'challenge' && <CanvasChallenge setView={setView} key={Date.now()} />}
          {view === 'gallery' && <VotingGallery />}
        </>
      )}
    </div>
  );
}

export default App; 