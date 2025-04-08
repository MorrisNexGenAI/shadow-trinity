import React, { useState, useEffect } from 'react';
import App from '../App';
import PersonalOnboarding from './PersonalOnboarding';
import PersonalLearningPanel from './PersonalLearningPanel';
import { loadIdentityProfile } from '../utils/deepIdentityProfiler';
import { loadStyleProfile } from '../utils/styleAnalyzer';
import { getLearningMode } from '../utils/personalLearningSystem';

/**
 * Main entry point for the personalized version of the app
 * Handles the user onboarding flow and personalized AI experience
 */
const PersonalizedApp = () => {
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [showLearningPanel, setShowLearningPanel] = useState(false);
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
  }, []);
  
  const handleOnboardingComplete = () => {
    setOnboardingComplete(true);
    setIsPersonalized(true);
    
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
          <button 
            className={`training-toggle ${isPersonalized ? 'personalized-toggle' : ''}`}
            onClick={toggleLearningPanel}
          >
            {isPersonalized ? 'Identity Mirror Settings' : 'Training Panel'}
          </button>
          
          {showLearningPanel && (
            <PersonalLearningPanel 
              onClose={() => setShowLearningPanel(false)}
              userData={userData}
            />
          )}
        </>
      )}
    </div>
  );
};

export default PersonalizedApp;