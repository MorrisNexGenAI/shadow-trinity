import React, { useState, useEffect } from 'react';
import './Avatar.css';

/**
 * Avatar component for visual representation of the Echo Twin
 * Changes appearance based on mode and emotional state
 */
const Avatar = ({ mode, emotion = 'neutral', userName = '' }) => {
  const [animationState, setAnimationState] = useState('idle');
  
  // Avatar states based on mode and emotion
  const avatarStates = {
    echo: {
      neutral: {
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        pulseColor: 'rgba(156, 136, 255, 0.5)',
        icon: '🌓',
      },
      joy: {
        background: 'linear-gradient(135deg, #fbc2eb, #a6c1ee)',
        pulseColor: 'rgba(251, 194, 235, 0.5)',
        icon: '😊',
      },
      sadness: {
        background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
        pulseColor: 'rgba(37, 117, 252, 0.5)',
        icon: '😔',
      },
      anger: {
        background: 'linear-gradient(135deg, #ff9a9e, #fad0c4)',
        pulseColor: 'rgba(255, 154, 158, 0.5)',
        icon: '😠',
      },
      surprise: {
        background: 'linear-gradient(135deg, #fdcb6e, #e17055)',
        pulseColor: 'rgba(253, 203, 110, 0.5)',
        icon: '😲',
      },
      fear: {
        background: 'linear-gradient(135deg, #a29bfe, #6c5ce7)',
        pulseColor: 'rgba(162, 155, 254, 0.5)',
        icon: '😨',
      }
    },
    logic: {
      neutral: {
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        pulseColor: 'rgba(44, 83, 100, 0.5)',
        icon: '⚙️',
      },
      active: {
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        pulseColor: 'rgba(0, 242, 254, 0.5)',
        icon: '⚙️',
      },
      processing: {
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        pulseColor: 'rgba(104, 223, 243, 0.5)',
        icon: '💻',
      },
      alert: {
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        pulseColor: 'rgba(254, 211, 48, 0.5)',
        icon: '⚠️',
      }
    }
  };
  
  // Get current avatar state
  const getCurrentState = () => {
    return avatarStates[mode]?.[emotion] || avatarStates.echo.neutral;
  };
  
  // Trigger animation when mode or emotion changes
  useEffect(() => {
    setAnimationState('transition');
    const timer = setTimeout(() => {
      setAnimationState('idle');
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [mode, emotion]);
  
  // Get user's initials for avatar display
  const getInitials = () => {
    if (!userName) return '';
    
    const names = userName.trim().split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  
  const currentState = getCurrentState();
  
  return (
    <div 
      className={`avatar-container ${animationState}`}
      style={{ 
        background: currentState.background,
        '--pulse-color': currentState.pulseColor
      }}
    >
      <div className="avatar-icon">
        {currentState.icon}
      </div>
      {userName && (
        <div className="avatar-initials">
          {getInitials()}
        </div>
      )}
      <div className="avatar-pulse"></div>
    </div>
  );
};

export default Avatar;