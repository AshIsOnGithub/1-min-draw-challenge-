import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLogin = async (type) => {
    try {
      setLoading(true);
      const { data, error } = 
        type === 'LOGIN' 
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });
      
      if (error) throw error;

      if (!error && type === 'SIGNUP' && data.user) {
        setShowConfirmation(true);
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(isLogin ? 'LOGIN' : 'SIGNUP');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Welcome Back!' : 'Create Account'}</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="auth-submit-btn">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <p className="auth-toggle">
          {isLogin ? "New here? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </p>
        {showConfirmation && (
          <div className="confirmation-message">
            ✅ Confirmation email sent! Please check your inbox.
          </div>
        )}
      </div>
    </div>
  );
} 