import { useEffect, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';

const CanvasChallenge = ({ setView }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [randomObject, setRandomObject] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [color, setColor] = useState('#000000');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  
  const getPrompt = async () => {
    try {
      const { data } = await supabase
        .rpc('random_drawing_prompt');

      console.log('Full response:', { data });
      
      if (data && data.length > 0) {
        // Verify the data structure
        console.log('First item:', data[0]);
        setRandomObject(data[0].name || 'Fallback Name');
      } else {
        console.warn('No data received');
        setRandomObject("Random Object");
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setRandomObject("Mystery Item");
    }
  };


  useEffect(() => {
    getPrompt();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleEarlySubmit();
      return;
    }
    
    const timerId = setInterval(() => {
      if (!isSubmitting) {
        setTimeLeft((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isSubmitting]);

  // Drawing functions
  const startDrawing = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    // Calculate scaling factors
    const scaleX = canvas.width / canvas.clientWidth;
    const scaleY = canvas.height / canvas.clientHeight;

    // Get accurate coordinates
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Apply scaling and positioning
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / canvas.clientWidth;
    const scaleY = canvas.height / canvas.clientHeight;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const handleSubmit = async (dataUrl) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Please login to submit drawings');
        return;
      }

      // Get username from user
      const username = user.user_metadata?.username || 'Anonymous Artist';

      const { error } = await supabase
        .from('drawings')
        .insert([{
          image_data: dataUrl,
          prompt: randomObject,
          votes: 0,
          user_id: user.id,
          username: username
        }]);

      if (error) throw error;
      
      setShowSuccess(true);
      setTimeout(() => setView('gallery'), 2000);
    } catch (error) {
      alert('Submission failed: ' + error.message);
    }
  };

  // Update startNewChallenge to use the same function
  const startNewChallenge = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    await getPrompt(); // Now properly defined
    setTimeLeft(60);
    setIsActive(true);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
  };

  const handleEarlySubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const dataUrl = canvasRef.current?.toDataURL() || '';
      await handleSubmit(dataUrl);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="challenge-container">
      {!isActive && (
        <button onClick={startNewChallenge}>
          Start New Challenge
        </button>
      )}
      <button onClick={clearCanvas}>Clear Canvas</button>
      <h2>Draw: {randomObject}</h2>
      <div className="timer-controls">
        <div className="timer">
          ⏳ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
        <button 
          onClick={handleEarlySubmit}
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Drawing'}
        </button>
      </div>
      <input 
        type="color" 
        value={color} 
        onChange={(e) => setColor(e.target.value)} 
      />
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ 
          border: '1px solid #000',
          touchAction: 'none',
          width: '90%',
          maxWidth: '800px',
          margin: '20px auto',
          display: 'block'
        }}
        onMouseDown={startDrawing}
        onMouseUp={() => setIsDrawing(false)}
        onMouseMove={draw}
        onTouchStart={(e) => startDrawing(e.touches[0])}
        onTouchEnd={() => setIsDrawing(false)}
        onTouchMove={(e) => draw(e.touches[0])}
      />
      {showSuccess && (
        <div className="success-message">
          🎉 Drawing submitted successfully! Redirecting to gallery...
        </div>
      )}
    </div>
  );
};

export default CanvasChallenge; 