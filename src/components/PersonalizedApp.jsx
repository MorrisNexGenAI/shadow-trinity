import React, { useState, useEffect } from 'react';
import App from '../App';
import PersonalOnboarding from './PersonalOnboarding';
import PersonalLearningPanel from './PersonalLearningPanel';
import Tutorial from './Tutorial';
import { loadIdentityProfile } from '../utils/deepIdentityProfiler';
import { loadStyleProfile } from '../utils/styleAnalyzer';
import { getLearningMode } from '../utils/personalLearningSystem';
import './PersonalizedApp.css';

/**
 * Main entry point for the personalized version of the app
 * Handles the user onboarding flow and personalized AI experience
 */
const PersonalizedApp = () => {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [showLearningPanel, setShowLearningPanel] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true); // Always show tutorial initially
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    // Check if we already have personalization data
    const hasIdentityProfile = loadIdentityProfile();
    const hasStyleProfile = loadStyleProfile();
    
    if (hasIdentityProfile && hasStyleProfile) {
      setOnboardingComplete(true);
      setIsPersonalized(true);
      
      try {
        // Get basic user info from local storage
        const identityData = localStorage.getItem('echoTwinIdentityMatrix');
        if (identityData) {
          const parsedData = JSON.parse(identityData);
          setUserData({
            name: parsedData.personalContext.name || 'User',
            interests: parsedData.personalContext.interests || []
          });
        }
      } catch (err) {
        console.error('Error loading user data:', err);
      }
    }
    
    // Force show tutorial for now (demo purposes)
    setShowTutorial(true);
  }, []);
  
  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
    setIsPersonalized(true);
    setShowTutorial(true); // Show tutorial after onboarding
    
    // Get user name from local storage after onboarding
    try {
      const identityData = localStorage.getItem('echoTwinIdentityMatrix');
      if (identityData) {
        const parsedData = JSON.parse(identityData);
        setUserData({
          name: parsedData.personalContext.name || 'User',
          interests: parsedData.personalContext.interests || []
        });
      }
    } catch (err) {
      console.error('Error loading user data after onboarding:', err);
    }
  };
  
  const toggleLearningPanel = () => {
    setShowLearningPanel(prev => !prev);
  };
  
  const handleTutorialClose = () => {
    setShowTutorial(false);
    // Mark that tutorial has been shown
    localStorage.setItem('tutorialShown', 'true');
  };
  
  const handleHelpClick = () => {
    setShowTutorial(true);
  };
  
  // Render onboarding if not complete
  if (!onboardingComplete) {
    return <PersonalOnboarding onComplete={handleOnboardingComplete} />;
  }
  
  // Render main app with personalization
  return (
    <div className="personalized-container">
      <App 
        isPersonalized={isPersonalized} 
        userData={userData}
      />
      
      {isPersonalized && (
        <>
          <div className="controls-container">
            <button 
              className={`training-toggle ${isPersonalized ? 'personalized-toggle' : ''}`}
              onClick={toggleLearningPanel}
            >
              {isPersonalized ? 'Identity Mirror Settings' : 'Training Panel'}
            </button>
            
            <button 
              className="help-button"
              onClick={handleHelpClick}
              aria-label="Show Tutorial"
            >
              ?
            </button>
          </div>
          
          {showLearningPanel && (
            <PersonalLearningPanel 
              onClose={() => setShowLearningPanel(false)}
              userData={userData}
            />
          )}
          
          {showTutorial && (
            <Tutorial onClose={handleTutorialClose} />
          )}
        </>
      )}
    </div>
  );
};

export default PersonalizedApp;