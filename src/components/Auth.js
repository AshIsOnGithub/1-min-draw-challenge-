import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignIn, setIsSignIn] = useState(true);
  const [showMsg, setShowMsg] = useState(false);
  const [err, setErr] = useState('');

  const handleAuth = async (type) => {
    try {
      setIsLoading(true);
      setErr('');
      
      if (!email || !pwd) {
        setErr('Please fill in all fields');
        return;
      }

      const { data, error } = 
        type === 'SIGN_IN' 
          ? await supabase.auth.signInWithPassword({ email, password: pwd })
          : await supabase.auth.signUp({ email, password: pwd });
      
      if (error) throw error;

      if (!error && type === 'SIGN_UP' && data.user) {
        setShowMsg(true);
        setEmail('');
        setPwd('');
      }
    } catch (error) {
      setErr(error.error_description || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAuth(isSignIn ? 'SIGN_IN' : 'SIGN_UP');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="login-title">
          {isSignIn ? 'Welcome Back!' : 'Create Account'}
        </h2>
        <p className="auth-subtitle">
          {isSignIn 
            ? 'Sign in to continue your artistic journey' 
            : 'Join our creative community today'}
        </p>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          {err && (
            <div className="error-message">
              ⚠️ {err}
            </div>
          )}
          
          <button 
            type="submit" 
            className="auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              isSignIn ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <p className="auth-toggle">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}
          <button 
            onClick={() => {
              setIsSignIn(!isSignIn);
              setErr('');
            }}
            disabled={isLoading}
          >
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </button>
        </p>

        {showMsg && (
          <div className="confirmation-message">
            <span>✅</span>
            <span>Confirmation email sent! Please check your inbox.</span>
          </div>
        )}
      </div>
    </div>
  );
} 