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

  return (
    <div className="container">
      <nav>
        <button onClick={() => setView('dashboard')}>Dashboard</button>
        <button onClick={() => setView('gallery')}>Gallery</button>
        {session && <button onClick={() => supabase.auth.signOut()}>Logout</button>}
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