import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const VotingGallery = () => {
  const [drawings, setDrawings] = useState([]);

  useEffect(() => {
    fetchDrawings();
  }, []);

  const fetchDrawings = async () => {
    const { data, error } = await supabase
      .from('drawings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setDrawings(data);
  };

  const handleVote = async (id, currentVotes) => {
    // Optimistic update
    setDrawings(prev => prev.map(d => 
      d.id === id ? { ...d, votes: d.votes + 1 } : d
    ));

    const { error } = await supabase
      .from('drawings')
      .update({ votes: currentVotes + 1 })
      .eq('id', id);

    if (error) {
      // Rollback if error
      setDrawings(prev => prev.map(d => 
        d.id === id ? { ...d, votes: currentVotes } : d
      ));
    }
  };

  return (
    <div className="gallery">
      <h1 className="gallery-title">Have a look at other players' art 🎨</h1>
      {drawings.map((drawing) => (
        <div key={drawing.id} className="drawing-card">
          <img src={drawing.image_data} alt={drawing.prompt} />
          <div className="drawing-info">
            <p className="prompt">Prompt: {drawing.prompt}</p>
            <p className="artist">Artist: {drawing.username}</p>
          </div>
          <div className="vote-section">
            <button onClick={() => handleVote(drawing.id, drawing.votes)}>
              👍 {drawing.votes || 0}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VotingGallery; 