import { useState, useEffect } from 'react';
import '../App.css';

// Import components
import Header from './header';
import EchoTwin from './Echotwin';
import ResponseArea from './ResponsiveArea';
import MessageForm from './MessageForm';
import TrainingPanel from './TrainingPanel';
import PersonalOnboarding from './PersonalOnboarding';
import PersonalLearningPanel from './PersonalLearningPanel';

// Import utils
import { analyzeEmotionAndRespond } from '../utils/emotionalAnalyzer.js';
import { processMessage } from '../utils/trainableAnalyzer.js';
import { loadStyleProfile, initializeStyleAnalyzer } from '../utils/styleAnalyzer.js';
import { 
  initializeLearningSystem, 
  generatePersonalizedResponse,
  recordFeedback
} from '../utils/personalLearningSystem.js';

/**
 * Enhanced App component with personalization features
 * Supports the Identity Mirror concept from ShadowTrinity
 */
function PersonalizedApp() {
  // Core Echo Twin states
  const [response, setResponse] = useState('Welcome to Echo Twin. Let\'s begin your personalization setup.');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [showTrainingPanel, setShowTrainingPanel] = useState(false);
  const [lastInteraction, setLastInteraction] = useState(null);
  const [useTrainableAnalyzer, setUseTrainableAnalyzer] = useState(false);
  
  // New personalization states
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [personalizedSetupComplete, setPersonalizedSetupComplete] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showLearningPanel, setShowLearningPanel] = useState(false);
  
  // Initialize the personalization systems
  useEffect(() => {
    // Check if user already completed onboarding
    const storedProfile = loadStyleProfile();
    const storedUserData = localStorage.getItem('echoTwinPersonalData');
    
    if (storedProfile && storedUserData) {
      setUserData(JSON.parse(storedUserData));
      setShowOnboarding(false);
      setPersonalizedSetupComplete(true);
      
      // Initialize learning system
      initializeLearningSystem();
      
      // Change the welcome message to be personalized
      setResponse(`Welcome back, ${JSON.parse(storedUserData).name}. Echo Twin is ready to mirror your style.`);
    }
  }, []);

  /**
   * Handle message submission with personalized response
   * @param {string} message - User's message
   */
  const handleMessageSubmit = async (message) => {
    try {
      // Show processing state
      setIsProcessing(true);
      setResponse('Processing your message...');
      
      let newResponse;
      let analysisResult = null;
      
      // Generate a response based on the mode and personalization status
      if (personalizedSetupComplete) {
        // Use the personalized response system
        try {
          newResponse = await generatePersonalizedResponse(message);
        } catch (personalizedError) {
          console.error("Error generating personalized response:", personalizedError);
          
          // Fall back to trainable analyzer if personalized system fails
          const result = processMessage(message);
          newResponse = result.response;
          analysisResult = result.analysis;
          
          setError("Personalization system unavailable. Using local emotion analysis instead.");
        }
      } else if (useTrainableAnalyzer) {
        // Use the trainable analyzer directly
        const result = processMessage(message);
        newResponse = result.response;
        analysisResult = result.analysis;
      } else {
        try {
          // Try the Hugging Face-powered response
          newResponse = await analyzeEmotionAndRespond(message);
        } catch (aiError) {
          console.error("Error with AI service:", aiError);
          // If Hugging Face service fails, fall back to trainable analyzer
          const result = processMessage(message);
          newResponse = result.response;
          analysisResult = result.analysis;
          
          // Show error about falling back
          setError("AI service unavailable. Using local emotion analysis instead.");
        }
      }
      
      // Update the response with the result
      setResponse(newResponse);
      
      // Store the interaction for training purposes
      const newInteraction = {
        message,
        response: newResponse,
        analysis: analysisResult,
        timestamp: Date.now()
      };
      
      setLastInteraction(newInteraction);
      
      // Record interaction feedback opportunity
      if (personalizedSetupComplete) {
        // Automatically record neutral feedback (user can update it later)
        recordFeedback({
          interactionId: newInteraction.timestamp.toString(),
          positive: true,
          emotion: analysisResult?.emotion || 'unknown',
          notes: 'Automatic feedback'
        });
      }
      
    } catch (error) {
      console.error("Error processing message:", error);
      setError("Could not process your message. System is experiencing technical difficulties.");
      
      // Ultimate fallback for catastrophic failures
      setResponse("Echo Twin is experiencing technical difficulties. Please try again later.");
    } finally {
      // Always reset the processing state when done
      setIsProcessing(false);
    }
  };

  // Toggle between analyzers
  const toggleAnalyzer = () => {
    setUseTrainableAnalyzer(!useTrainableAnalyzer);
    setResponse(
      !useTrainableAnalyzer
        ? "Switched to locally trained emotional intelligence. I'm learning from our interactions."
        : "Switched to cloud-based AI. I'll try to use external intelligence when available."
    );
  };

  /**
   * Handle the completion of the personalization onboarding process
   * @param {Object} personalData - User's personalization data
   */
  const handleOnboardingComplete = (personalData) => {
    setUserData(personalData);
    setShowOnboarding(false);
    setPersonalizedSetupComplete(true);
    
    // Initialize style analyzer with the user data
    initializeStyleAnalyzer(personalData);
    
    // Initialize learning system
    initializeLearningSystem();
    
    // Welcome message with user's name
    setResponse(`Thank you, ${personalData.name}. Echo Twin is now set up to mirror your unique style. Let's start a conversation.`);
  };

  return (
    <div className="shadow-os-container">
      {/* Header component with title and version */}
      <Header />
      
      {/* EchoTwin component with avatar and name */}
      <EchoTwin 
        processing={isProcessing} 
        personalized={personalizedSetupComplete}
        userName={userData?.name}
      />
      
      {/* ResponseArea component to display AI responses */}
      <ResponseArea 
        response={response} 
        error={error} 
        trainingMode={personalizedSetupComplete ? "Personalized" : useTrainableAnalyzer ? "Local Training" : "Cloud AI"} 
      />
      
      {/* MessageForm component for user input */}
      <MessageForm 
        onMessageSubmit={handleMessageSubmit} 
        isProcessing={isProcessing} 
        personalized={personalizedSetupComplete}
      />
      
      {/* Footer section */}
      <div className="footer">
        © 2025 SHADOW OS | ECHO TWIN PROTOCOL
        <div className="mode-toggle">
          {personalizedSetupComplete ? (
            <>
              <span className="mode-label">Mode: Personalized</span>
              <button 
                className="toggle-button"
                onClick={() => setShowLearningPanel(true)}
              >
                Learning Settings
              </button>
            </>
          ) : (
            <>
              <span className="mode-label">Mode: {useTrainableAnalyzer ? "Training" : "Cloud AI"}</span>
              <button 
                className="toggle-button"
                onClick={toggleAnalyzer}
              >
                {useTrainableAnalyzer ? "Use Cloud AI" : "Use Training Mode"}
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Training Panel Toggle Button - only shown if not in personalized mode */}
      {!personalizedSetupComplete && (
        <button 
          className="training-toggle"
          onClick={() => setShowTrainingPanel(!showTrainingPanel)}
        >
          {showTrainingPanel ? "CLOSE TRAINING" : "TRAIN ECHO TWIN"}
        </button>
      )}
      
      {/* Personalized Learning Toggle Button - only shown in personalized mode */}
      {personalizedSetupComplete && (
        <button 
          className="training-toggle personalized-toggle"
          onClick={() => setShowLearningPanel(!showLearningPanel)}
        >
          {showLearningPanel ? "CLOSE LEARNING" : "YOUR ECHO TWIN"}
        </button>
      )}
      
      {/* Conditional render of the Training Panel */}
      {showTrainingPanel && !personalizedSetupComplete && (
        <TrainingPanel 
          lastInteraction={lastInteraction}
          onClose={() => setShowTrainingPanel(false)}
        />
      )}
      
      {/* Conditional render of the Learning Panel */}
      {showLearningPanel && personalizedSetupComplete && (
        <PersonalLearningPanel 
          onClose={() => setShowLearningPanel(false)}
        />
      )}
      
      {/* Conditional render of the Onboarding Panel */}
      {showOnboarding && (
        <PersonalOnboarding 
          onComplete={handleOnboardingComplete}
        />
      )}
    </div>
  );
}

export default PersonalizedApp;