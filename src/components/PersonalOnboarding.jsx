import { useState } from 'react';
import '../styles/PersonalOnboarding.css';

/**
 * PersonalOnboarding Component
 * Guides the user through the initial setup process to personalize Echo Twin
 * Collects essential information to begin mirroring the user's style
 */
const PersonalOnboarding = ({ onComplete }) => {
  // Multi-step form state
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    writingSamples: [],
    communicationPreferences: {
      formal: false,
      casual: false,
      technical: false,
      creative: false,
      direct: false,
      elaborate: false
    },
    emotionalTendencies: {
      analytical: 0,
      expressive: 0,
      calm: 0,
      passionate: 0,
      serious: 0,
      humorous: 0
    },
    personalPhrases: []
  });
  
  // Current sample being written
  const [currentSample, setCurrentSample] = useState('');
  const [currentPhrase, setCurrentPhrase] = useState('');
  
  // Add a writing sample to the collection
  const addWritingSample = () => {
    if (currentSample.trim().length > 0) {
      setUserData({
        ...userData,
        writingSamples: [...userData.writingSamples, currentSample]
      });
      setCurrentSample('');
    }
  };
  
  // Add a personal phrase to the collection
  const addPersonalPhrase = () => {
    if (currentPhrase.trim().length > 0) {
      setUserData({
        ...userData,
        personalPhrases: [...userData.personalPhrases, currentPhrase]
      });
      setCurrentPhrase('');
    }
  };
  
  // Update communication preferences
  const togglePreference = (preference) => {
    setUserData({
      ...userData,
      communicationPreferences: {
        ...userData.communicationPreferences,
        [preference]: !userData.communicationPreferences[preference]
      }
    });
  };
  
  // Update emotional tendencies with slider values
  const updateEmotionalTendency = (tendency, value) => {
    setUserData({
      ...userData,
      emotionalTendencies: {
        ...userData.emotionalTendencies,
        [tendency]: parseInt(value)
      }
    });
  };
  
  // Move to the next step in the onboarding process
  const nextStep = () => {
    if (step === 1 && !userData.name) {
      alert("Please enter your name to continue.");
      return;
    }
    
    if (step === 2 && userData.writingSamples.length === 0) {
      alert("Please provide at least one writing sample to continue.");
      return;
    }
    
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Complete onboarding and save data
      if (currentSample) addWritingSample();
      if (currentPhrase) addPersonalPhrase();
      
      // Filter out any empty strings from arrays
      const cleanedData = {
        ...userData,
        writingSamples: userData.writingSamples.filter(sample => sample.trim().length > 0),
        personalPhrases: userData.personalPhrases.filter(phrase => phrase.trim().length > 0)
      };
      
      // Save to localStorage for persistence
      localStorage.setItem('echoTwinPersonalData', JSON.stringify(cleanedData));
      
      // Call the completion handler
      onComplete(cleanedData);
    }
  };
  
  // Go back to the previous step
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  return (
    <div className="onboarding-container">
      <div className="onboarding-panel">
        <div className="onboarding-header">
          <h2>Echo Twin Personalization</h2>
          <div className="step-indicator">
            Step {step} of 4
          </div>
        </div>
        
        <div className="onboarding-content">
          {step === 1 && (
            <div className="onboarding-step">
              <h3>Welcome to Your Echo Twin</h3>
              <p className="step-description">
                Echo Twin will learn to mirror your unique communication style. 
                First, let's start with your name.
              </p>
              
              <div className="form-group">
                <label htmlFor="userName">Your Name</label>
                <input
                  type="text"
                  id="userName"
                  value={userData.name}
                  onChange={(e) => setUserData({...userData, name: e.target.value})}
                  placeholder="Enter your name"
                  className="text-input"
                />
              </div>
              
              <div className="privacy-notice">
                <p>
                  <strong>Privacy Note:</strong> All information you provide stays on your device 
                  and is used only to personalize Echo Twin to mirror your style.
                  No data is sent to external servers without your explicit permission.
                </p>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="onboarding-step">
              <h3>Your Writing Style</h3>
              <p className="step-description">
                Provide samples of your typical writing to help Echo Twin understand your style.
                These can be messages, emails, or any text that represents how you communicate.
              </p>
              
              <div className="form-group">
                <label htmlFor="writingSample">Writing Sample</label>
                <textarea
                  id="writingSample"
                  value={currentSample}
                  onChange={(e) => setCurrentSample(e.target.value)}
                  placeholder="Type a sample of your writing here..."
                  className="text-area"
                  rows={4}
                />
                <button 
                  className="add-button"
                  onClick={addWritingSample}
                >
                  Add Sample
                </button>
              </div>
              
              {userData.writingSamples.length > 0 && (
                <div className="samples-container">
                  <h4>Your Samples ({userData.writingSamples.length})</h4>
                  <ul className="samples-list">
                    {userData.writingSamples.map((sample, index) => (
                      <li key={index} className="sample-item">
                        <p>{sample.substring(0, 50)}...</p>
                        <button 
                          className="remove-button"
                          onClick={() => {
                            setUserData({
                              ...userData,
                              writingSamples: userData.writingSamples.filter((_, i) => i !== index)
                            });
                          }}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          {step === 3 && (
            <div className="onboarding-step">
              <h3>Communication Preferences</h3>
              <p className="step-description">
                Select the communication styles that best represent you.
                This helps Echo Twin understand your preferences.
              </p>
              
              <div className="preferences-grid">
                {Object.keys(userData.communicationPreferences).map((pref) => (
                  <div key={pref} className="preference-item">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={userData.communicationPreferences[pref]}
                        onChange={() => togglePreference(pref)}
                      />
                      <span className="checkbox-text">{pref.charAt(0).toUpperCase() + pref.slice(1)}</span>
                    </label>
                  </div>
                ))}
              </div>
              
              <h3>Emotional Expression</h3>
              <p className="step-description">
                Rate how you typically express yourself on these scales.
              </p>
              
              <div className="sliders-container">
                {Object.keys(userData.emotionalTendencies).map((tendency, index) => {
                  // Create pair names for each slider
                  const pairs = [
                    ['Analytical', 'Intuitive'],
                    ['Reserved', 'Expressive'],
                    ['Calm', 'Intense'],
                    ['Practical', 'Passionate'],
                    ['Serious', 'Lighthearted'],
                    ['Literal', 'Humorous']
                  ];
                  
                  return (
                    <div key={tendency} className="slider-group">
                      <label>
                        <span className="slider-left">{pairs[index][0]}</span>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={userData.emotionalTendencies[tendency]}
                          onChange={(e) => updateEmotionalTendency(tendency, e.target.value)}
                          className="emotion-slider"
                        />
                        <span className="slider-right">{pairs[index][1]}</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {step === 4 && (
            <div className="onboarding-step">
              <h3>Personal Phrases & Final Setup</h3>
              <p className="step-description">
                Add unique phrases or expressions you commonly use.
                These will help Echo Twin sound authentically like you.
              </p>
              
              <div className="form-group">
                <label htmlFor="personalPhrase">Your Phrases or Expressions</label>
                <input
                  type="text"
                  id="personalPhrase"
                  value={currentPhrase}
                  onChange={(e) => setCurrentPhrase(e.target.value)}
                  placeholder="Add a phrase you commonly use..."
                  className="text-input"
                />
                <button 
                  className="add-button"
                  onClick={addPersonalPhrase}
                >
                  Add Phrase
                </button>
              </div>
              
              {userData.personalPhrases.length > 0 && (
                <div className="phrases-container">
                  <h4>Your Phrases ({userData.personalPhrases.length})</h4>
                  <ul className="phrases-list">
                    {userData.personalPhrases.map((phrase, index) => (
                      <li key={index} className="phrase-item">
                        <p>"{phrase}"</p>
                        <button 
                          className="remove-button"
                          onClick={() => {
                            setUserData({
                              ...userData,
                              personalPhrases: userData.personalPhrases.filter((_, i) => i !== index)
                            });
                          }}
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="completion-text">
                <p>
                  Echo Twin will start with these preferences and continue learning from your interactions.
                  Every message you send helps it better mirror your unique style.
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="onboarding-actions">
          {step > 1 && (
            <button className="back-button" onClick={prevStep}>
              Back
            </button>
          )}
          <button className="next-button" onClick={nextStep}>
            {step < 4 ? 'Next' : 'Complete Setup'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalOnboarding;