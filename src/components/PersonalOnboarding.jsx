import React, { useState, useEffect } from 'react';
import { initializeIdentityProfiler } from '../utils/deepIdentityProfiler';
import { initializeStyleAnalyzer } from '../utils/styleAnalyzer';
import { initializeLearningSystem } from '../utils/personalLearningSystem';

/**
 * Personal onboarding component for Echo Twin
 * Collects essential information to create a personalized twin experience
 */
const PersonalOnboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    name: '',
    interests: [],
    occupation: '',
    communicationPreferences: {
      formal: false,
      casual: false,
      direct: false,
      elaborate: false,
      concise: false,
    },
    writingSamples: [],
    personalIdentity: {
      uniqueTraits: [],
      expressionStyle: '',
      emotionalSignature: ''
    }
  });
  
  const [interestInput, setInterestInput] = useState('');
  const [uniqueTraitInput, setUniqueTraitInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if we already have profile data
    const existingData = localStorage.getItem('echoTwinIdentityMatrix');
    if (existingData) {
      // Ask if the user wants to continue with existing profile or start fresh
      if (window.confirm('An existing Echo Twin profile was found. Would you like to continue with it? Click OK to use existing profile, or Cancel to start fresh.')) {
        // Skip onboarding if using existing profile
        onComplete();
      } else {
        // Clear existing data
        localStorage.removeItem('echoTwinIdentityMatrix');
        localStorage.removeItem('echoTwinIdentityEvolution');
        localStorage.removeItem('echoTwinLearningSamples');
        localStorage.removeItem('echoTwinStyleProfile');
        localStorage.removeItem('personalLearningData');
      }
    }
  }, [onComplete]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setUserData(prev => ({
        ...prev,
        communicationPreferences: {
          ...prev.communicationPreferences,
          [name]: checked
        }
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleInterestAdd = () => {
    if (interestInput.trim()) {
      setUserData(prev => ({
        ...prev,
        interests: [...prev.interests, interestInput.trim()]
      }));
      setInterestInput('');
    }
  };
  
  const handleInterestRemove = (index) => {
    setUserData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };
  
  const handleUniqueTraitAdd = () => {
    if (uniqueTraitInput.trim()) {
      setUserData(prev => ({
        ...prev,
        personalIdentity: {
          ...prev.personalIdentity,
          uniqueTraits: [...prev.personalIdentity.uniqueTraits, uniqueTraitInput.trim()]
        }
      }));
      setUniqueTraitInput('');
    }
  };
  
  const handleUniqueTraitRemove = (index) => {
    setUserData(prev => ({
      ...prev,
      personalIdentity: {
        ...prev.personalIdentity,
        uniqueTraits: prev.personalIdentity.uniqueTraits.filter((_, i) => i !== index)
      }
    }));
  };
  
  const handleAddWritingSample = (sample) => {
    if (sample.trim()) {
      setUserData(prev => ({
        ...prev,
        writingSamples: [...prev.writingSamples, sample.trim()]
      }));
    }
  };
  
  const nextStep = () => {
    // Validate current step
    if (step === 1 && !userData.name.trim()) {
      setError('Please enter your name to continue.');
      return;
    }
    
    if (step === 3 && userData.writingSamples.length < 1) {
      setError('Please provide at least one writing sample to continue.');
      return;
    }
    
    // Clear any previous errors
    setError('');
    
    // If this is the final step, initialize the personalization system
    if (step === 4) {
      setIsProcessing(true);
      
      // Initialize all personalization systems
      try {
        initializeIdentityProfiler(userData);
        initializeStyleAnalyzer(userData);
        initializeLearningSystem(userData);
        
        setTimeout(() => {
          setIsProcessing(false);
          onComplete();
        }, 2000);
      } catch (err) {
        console.error('Error initializing personalization:', err);
        setError('Failed to initialize your personal Echo Twin. Please try again.');
        setIsProcessing(false);
      }
      
      return;
    }
    
    // Move to next step
    setStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
    setError('');
  };
  
  // Render each step of the onboarding process
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="onboarding-step">
            <h3>Basic Information</h3>
            <p className="step-description">
              Let's start with the essentials to create your personalized Echo Twin.
            </p>
            
            <div className="form-group">
              <label htmlFor="name">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="form-input"
                autoComplete="off"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="occupation">Your Occupation (Optional)</label>
              <input
                type="text"
                id="occupation"
                name="occupation"
                value={userData.occupation}
                onChange={handleInputChange}
                placeholder="What do you do?"
                className="form-input"
                autoComplete="off"
              />
            </div>
            
            <div className="form-group">
              <label>Interests</label>
              <div className="interest-input-container">
                <input
                  type="text"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  placeholder="Add an interest"
                  className="form-input"
                  onKeyPress={(e) => e.key === 'Enter' && handleInterestAdd()}
                  autoComplete="off"
                />
                <button 
                  type="button" 
                  onClick={handleInterestAdd}
                  className="add-interest-button"
                >
                  Add
                </button>
              </div>
              
              <div className="interest-list">
                {userData.interests.map((interest, index) => (
                  <div key={index} className="interest-tag">
                    {interest}
                    <button 
                      type="button"
                      onClick={() => handleInterestRemove(index)}
                      className="remove-interest"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="onboarding-step">
            <h3>Communication Style</h3>
            <p className="step-description">
              Tell us about your communication preferences to help Echo Twin match your style.
            </p>
            
            <div className="style-preferences">
              <h4>Formality</h4>
              <div className="preference-slider">
                <div className={`preference-option ${userData.communicationPreferences.formal ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    id="formal"
                    name="formal"
                    checked={userData.communicationPreferences.formal}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="formal">
                    <strong>Formal</strong>
                    <span>Proper, professional, structured</span>
                  </label>
                </div>
                
                <div className="preference-neutral">Neutral</div>
                
                <div className={`preference-option ${userData.communicationPreferences.casual ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    id="casual"
                    name="casual"
                    checked={userData.communicationPreferences.casual}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="casual">
                    <strong>Casual</strong>
                    <span>Relaxed, conversational, natural</span>
                  </label>
                </div>
              </div>
              
              <h4>Directness</h4>
              <div className={`preference-option single-option ${userData.communicationPreferences.direct ? 'selected' : ''}`}>
                <input
                  type="checkbox"
                  id="direct"
                  name="direct"
                  checked={userData.communicationPreferences.direct}
                  onChange={handleInputChange}
                />
                <label htmlFor="direct">
                  <strong>Direct</strong>
                  <span>Clear, straightforward, to the point</span>
                </label>
              </div>
              
              <h4>Detail Level</h4>
              <div className="preference-slider">
                <div className={`preference-option ${userData.communicationPreferences.elaborate ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    id="elaborate"
                    name="elaborate"
                    checked={userData.communicationPreferences.elaborate}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="elaborate">
                    <strong>Elaborate</strong>
                    <span>Detailed, thorough, comprehensive</span>
                  </label>
                </div>
                
                <div className="preference-neutral">Neutral</div>
                
                <div className={`preference-option ${userData.communicationPreferences.concise ? 'selected' : ''}`}>
                  <input
                    type="checkbox"
                    id="concise"
                    name="concise"
                    checked={userData.communicationPreferences.concise}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="concise">
                    <strong>Concise</strong>
                    <span>Brief, succinct, to the point</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="expressionStyle">Describe your expression style (Optional)</label>
              <textarea
                id="expressionStyle"
                name="expressionStyle"
                value={userData.personalIdentity.expressionStyle}
                onChange={(e) => setUserData(prev => ({
                  ...prev,
                  personalIdentity: {
                    ...prev.personalIdentity,
                    expressionStyle: e.target.value
                  }
                }))}
                placeholder="Do you use certain phrases often? Have particular ways of greeting people? Use lots of emojis?"
                className="form-textarea"
              />
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="onboarding-step">
            <h3>Writing Samples</h3>
            <p className="step-description">
              To create a truly personalized experience, Echo Twin needs examples of your writing. 
              This helps it learn your unique style, vocabulary, and expression patterns.
            </p>
            
            <div className="form-group">
              <label htmlFor="writingSample1">Writing Sample</label>
              <textarea
                id="writingSample1"
                placeholder="Write a paragraph as you normally would - maybe something about your day, an opinion, or a story. The more authentic, the better your Echo Twin will be."
                className="form-textarea"
                rows={5}
                onChange={(e) => setUserData(prev => ({
                  ...prev,
                  currentSample: e.target.value
                }))}
                value={userData.currentSample || ''}
              />
              
              <button 
                type="button"
                onClick={() => {
                  if (userData.currentSample) {
                    handleAddWritingSample(userData.currentSample);
                    setUserData(prev => ({ ...prev, currentSample: '' }));
                  }
                }}
                className="add-sample-button"
                disabled={!userData.currentSample}
              >
                Add Sample
              </button>
            </div>
            
            <div className="sample-prompt">
              <h4>Need Inspiration?</h4>
              <p>Try writing about one of these topics:</p>
              <ul className="prompt-list">
                <li>Describe your ideal day</li>
                <li>Share your opinion on a recent movie or book</li>
                <li>Tell a short story about something interesting that happened to you</li>
                <li>Explain why you like or dislike something</li>
              </ul>
              <p className="privacy-note">
                <strong>Note:</strong> Your writing samples are stored locally on your device, not on our servers.
              </p>
            </div>
            
            <div className="samples-container">
              <h4>Your Samples ({userData.writingSamples.length})</h4>
              {userData.writingSamples.map((sample, index) => (
                <div key={index} className="sample-item">
                  <p>{sample.substring(0, 100)}...</p>
                </div>
              ))}
              {userData.writingSamples.length === 0 && (
                <p className="no-samples">No samples added yet.</p>
              )}
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="onboarding-step">
            <h3>Unique Identity Markers</h3>
            <p className="step-description">
              Let's finish by capturing the traits and characteristics that make your 
              communication uniquely yours.
            </p>
            
            <div className="form-group">
              <label>Unique Expressions or Phrases</label>
              <div className="interest-input-container">
                <input
                  type="text"
                  value={uniqueTraitInput}
                  onChange={(e) => setUniqueTraitInput(e.target.value)}
                  placeholder="Add phrases you use often"
                  className="form-input"
                  onKeyPress={(e) => e.key === 'Enter' && handleUniqueTraitAdd()}
                  autoComplete="off"
                />
                <button 
                  type="button" 
                  onClick={handleUniqueTraitAdd}
                  className="add-interest-button"
                >
                  Add
                </button>
              </div>
              
              <div className="interest-list">
                {userData.personalIdentity.uniqueTraits.map((trait, index) => (
                  <div key={index} className="interest-tag trait-tag">
                    {trait}
                    <button 
                      type="button"
                      onClick={() => handleUniqueTraitRemove(index)}
                      className="remove-interest"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              
              <p className="trait-suggestion">
                Examples: "to be honest", "at the end of the day", "well, actually", etc.
              </p>
            </div>
            
            <div className="form-group">
              <label htmlFor="emotionalSignature">Your Emotional Expression Style (Optional)</label>
              <textarea
                id="emotionalSignature"
                name="emotionalSignature"
                value={userData.personalIdentity.emotionalSignature}
                onChange={(e) => setUserData(prev => ({
                  ...prev,
                  personalIdentity: {
                    ...prev.personalIdentity,
                    emotionalSignature: e.target.value
                  }
                }))}
                placeholder="How do you express emotions in text? Are you expressive, reserved, use emojis, etc?"
                className="form-textarea"
              />
            </div>
            
            <div className="summary-container">
              <h4>Creating Your Digital Twin</h4>
              <p>
                With this information, Echo Twin will create a unique neural map of your communication style.
                This allows it to respond as you would, mirroring your unique expression style.
              </p>
              <p>
                Your Twin will continue to learn and evolve with each interaction, becoming a more accurate 
                reflection of your identity over time.
              </p>
              
              {isProcessing && (
                <div className="processing-container">
                  <div className="processing-animation"></div>
                  <p>Analyzing your communication patterns...</p>
                </div>
              )}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="personal-onboarding">
      <div className="onboarding-header">
        <h2>Create Your Echo Twin</h2>
        <div className="step-indicator">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`}></div>
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`}></div>
          <div className={`step-dot ${step >= 3 ? 'active' : ''}`}></div>
          <div className={`step-dot ${step >= 4 ? 'active' : ''}`}></div>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="onboarding-content">
        {renderStep()}
      </div>
      
      <div className="onboarding-navigation">
        {step > 1 && (
          <button 
            type="button" 
            onClick={prevStep}
            className="prev-button"
            disabled={isProcessing}
          >
            Back
          </button>
        )}
        
        <button 
          type="button" 
          onClick={nextStep}
          className="next-button"
          disabled={isProcessing}
        >
          {step < 4 ? 'Next' : 'Create My Echo Twin'}
        </button>
      </div>
    </div>
  );
};

export default PersonalOnboarding;