import React, { useState, useEffect } from 'react';
import './Tutorial.css';

const Tutorial = ({ onClose }) => {
  // Force the tutorial to be visible when component mounts
  useEffect(() => {
    document.body.style.overflow = 'hidden'; // Prevent scrolling behind tutorial
    
    // Clean up when component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  const [currentStep, setCurrentStep] = useState(0);
  
  const tutorialSteps = [
    {
      title: "Welcome to Shadow OS",
      content: "Shadow OS is your personalized AI companion that adapts to your unique communication style. It's designed to be your 'Echo Twin' - a digital reflection of yourself.",
      image: "🌓"
    },
    {
      title: "ShadowTrinity Vision",
      content: "Shadow OS is built on ShadowTrinity concepts: Emotional Reflection, Bio-inspired Architecture, Identity Mirroring, and MemoryLink.",
      image: "🔄"
    },
    {
      title: "Personalization",
      content: "During onboarding, Shadow OS collects writing samples and preferences to understand your unique style. This creates a personalized experience unlike any other AI.",
      image: "👤"
    },
    {
      title: "Deep Identity Profiling",
      content: "The system analyzes your communication patterns, emotional tendencies, vocabulary preferences, and signature expressions to build your digital identity.",
      image: "🧠"
    },
    {
      title: "Continuous Learning",
      content: "Your Echo Twin constantly evolves, learning more about your style with each interaction to become a more accurate reflection of you.",
      image: "📈"
    },
    {
      title: "Get Started",
      content: "Complete the onboarding process to create your Echo Twin. The more information you provide, the more personalized your experience will be.",
      image: "🚀"
    }
  ];
  
  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    onClose();
  };
  
  const currentTutorialStep = tutorialSteps[currentStep];
  
  return (
    <div className="tutorial-overlay">
      <div className="tutorial-container">
        <div className="tutorial-header">
          <h2>Tutorial</h2>
          <button className="close-button" onClick={handleSkip}>×</button>
        </div>
        
        <div className="tutorial-content">
          <div className="tutorial-image">
            <span className="tutorial-emoji">{currentTutorialStep.image}</span>
          </div>
          
          <h3>{currentTutorialStep.title}</h3>
          <p>{currentTutorialStep.content}</p>
        </div>
        
        <div className="tutorial-progress">
          {tutorialSteps.map((_, index) => (
            <div 
              key={index} 
              className={`progress-dot ${index === currentStep ? 'active' : ''}`}
              onClick={() => setCurrentStep(index)}
            />
          ))}
        </div>
        
        <div className="tutorial-buttons">
          <button 
            className="tutorial-button secondary" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </button>
          
          <button 
            className="tutorial-button secondary" 
            onClick={handleSkip}
          >
            Skip
          </button>
          
          <button 
            className="tutorial-button primary" 
            onClick={handleNext}
          >
            {currentStep === tutorialSteps.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;