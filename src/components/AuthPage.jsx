import React, { useState, useEffect } from 'react';
import './AuthPage.css';

/**
 * AuthPage component for user login and signup
 * Handles both sign up (triggering onboarding) and login with pin verification
 */
const AuthPage = ({ onLogin, onSignup, adminAccessCheck }) => {
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [fullName, setFullName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  
  // Check for stored credentials on mount
  useEffect(() => {
    const storedName = localStorage.getItem('shadow_os_user_name');
    if (storedName) {
      setFullName(storedName);
    }
  }, []);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Validate inputs
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    
    if (mode === 'login' && !pin.trim()) {
      setError('Please enter your PIN');
      return;
    }
    
    // Check for admin access first
    const isAdmin = adminAccessCheck(fullName, pin);
    
    if (isAdmin) {
      // Admin login handled by the adminAccessCheck function
      return;
    }
    
    // Regular user flow
    if (mode === 'login') {
      // Check if user exists in local storage
      const storedUserData = localStorage.getItem('shadow_os_user_data');
      
      if (!storedUserData) {
        setError('No account found. Please sign up first.');
        return;
      }
      
      const userData = JSON.parse(storedUserData);
      
      // Verify name and pin
      if (userData.fullName !== fullName || userData.pin !== pin) {
        setError('Invalid name or PIN. Please try again.');
        return;
      }
      
      // Login successful
      onLogin(userData);
    } else {
      // For signup, just pass the name to start onboarding
      // Pin will be set during onboarding
      onSignup(fullName);
    }
  };
  
  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-form-section">
          <div className="auth-header">
            <h2>{mode === 'login' ? 'Welcome Back' : 'Create Your Account'}</h2>
            <p className="auth-description">
              {mode === 'login' 
                ? 'Sign in to access your personal Echo Twin' 
                : 'Start your journey with a personalized Echo Twin'}
            </p>
          </div>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input 
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="auth-input"
              />
            </div>
            
            {mode === 'login' && (
              <div className="form-group">
                <label htmlFor="pin">Security PIN</label>
                <input 
                  type="password"
                  id="pin"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter your PIN"
                  className="auth-input"
                />
              </div>
            )}
            
            {error && <div className="auth-error">{error}</div>}
            
            <button type="submit" className="auth-button">
              {mode === 'login' ? 'Login' : 'Continue to Onboarding'}
            </button>
          </form>
          
          <div className="auth-mode-toggle">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <button 
                  className="mode-toggle-link"
                  onClick={() => setMode('signup')}
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button 
                  className="mode-toggle-link"
                  onClick={() => setMode('login')}
                >
                  Login
                </button>
              </p>
            )}
          </div>
        </div>
        
        <div className="auth-hero-section">
          <div className="hero-content">
            <h2>Shadow OS</h2>
            <h3>Echo Twin Protocol</h3>
            <p>A digital reflection created from your unique communication patterns and emotional expressions.</p>
            <div className="hero-features">
              <div className="feature">
                <span className="feature-icon">🌓</span>
                <span className="feature-text">Emotional Reflection</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🧠</span>
                <span className="feature-text">Personalized Learning</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🔄</span>
                <span className="feature-text">Adaptive Responses</span>
              </div>
              <div className="feature">
                <span className="feature-icon">🛡️</span>
                <span className="feature-text">Secure & Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;