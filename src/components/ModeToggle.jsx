import React from 'react';
import './ModeToggle.css';

/**
 * ModeToggle component for switching between Echo Twin (emotional) and Logic Core (AI) modes
 * Part of the ShadowTrinity concept of balancing emotional and logical aspects
 */
const ModeToggle = ({ mode, setMode }) => {
  return (
    <div className="mode-toggle-container">
      <div className="mode-toggle-label">Mode:</div>
      <div className="mode-toggle">
        <button 
          className={`mode-button ${mode === 'echo' ? 'active' : ''}`}
          onClick={() => setMode('echo')}
        >
          <span className="mode-icon">🌓</span>
          <span className="mode-name">Echo Twin</span>
          <span className="mode-description">Emotional</span>
        </button>
        
        <button 
          className={`mode-button ${mode === 'logic' ? 'active' : ''}`}
          onClick={() => setMode('logic')}
        >
          <span className="mode-icon">⚙️</span>
          <span className="mode-name">Logic Core</span>
          <span className="mode-description">Analytical</span>
        </button>
      </div>
    </div>
  );
};

export default ModeToggle;