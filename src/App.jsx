import { useState, useEffect } from 'react';
import './App.css';

// Import components
import Header from './components/header';
import EchoTwin from './components/Echotwin';
import ResponseArea from './components/ResponsiveArea';
import MessageForm from './components/MessageForm';
import TrainingPanel from './components/TrainingPanel';

// Import the emotional analyzer utilities
import { analyzeEmotionAndRespond } from './utils/emotionalAnalyzer.js';
import { processMessage } from './utils/trainableAnalyzer.js';

// Import personalization utilities
import { recordInteraction, generatePersonalizedResponse } from './utils/personalLearningSystem.js';

/**
 * The main App component that composes all Shadow OS parts
 * @param {Object} props - Component props
 * @param {boolean} props.isPersonalized - Whether the app is in personalized mode
 * @param {Object} props.userData - User data from personalization
 */
function App({ isPersonalized = false, userData = null }) {
  // Initial state with a welcoming message
  const [response, setResponse] = useState(
    isPersonalized && userData?.name 
      ? `Welcome back, ${userData.name}. Your Echo Twin is active.` 
      : 'Echo Twin ready. How are you feeling today?'
  );
  
  // Loading state to show when AI is processing
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Error state for any AI processing issues
  const [error, setError] = useState(null);
  
  // State to toggle the training panel visibility
  const [showTrainingPanel, setShowTrainingPanel] = useState(false);
  
  // State to remember the last interaction for training purposes
  const [lastInteraction, setLastInteraction] = useState(null);
  
  // State to track whether we're using the trainable analyzer or Hugging Face AI
  const [useTrainableAnalyzer, setUseTrainableAnalyzer] = useState(false);
  
  /**
   * Handles message submission from the MessageForm component
   * Analyzes the message and updates the response state
   * @param {string} message - The user's message
   */
  const handleMessageSubmit = async (message) => {
    try {
      // Show processing state (could be used for UI effects)
      setIsProcessing(true);
      
      // Set a temporary processing message
      setResponse('Processing your message...');
      
      let newResponse;
      let analysisResult = null;
      
      // Determine if we should use personalized processing or standard processing
      if (isPersonalized) {
        try {
          // First get a standard response to use as a base
          let baseResponse;
          
          try {
            // Try to get a Hugging Face powered response first
            baseResponse = await analyzeEmotionAndRespond(message);
          } catch (aiError) {
            // Fall back to trainable analyzer
            const result = processMessage(message);
            baseResponse = result.response;
            analysisResult = result.analysis;
          }
          
          // Now apply the personalization layer
          newResponse = await generatePersonalizedResponse(message, {
            baseResponse,
            includePersonalReferences: Math.random() > 0.7, // Occasionally include personal context
            includeMemories: Math.random() > 0.7, // Occasionally include memories
            emotionalTone: analysisResult?.emotion // Pass along detected emotion if available
          });
          
          // Record the interaction for continuous learning
          recordInteraction({
            type: 'message',
            text: message,
            context: 'chat',
            emotionalTone: analysisResult?.emotion
          });
          
        } catch (personalizationError) {
          console.error("Error with personalization:", personalizationError);
          
          // Fall back to standard processing
          if (useTrainableAnalyzer) {
            const result = processMessage(message);
            newResponse = result.response;
            analysisResult = result.analysis;
          } else {
            newResponse = await analyzeEmotionAndRespond(message);
          }
          
          // Show error about falling back
          setError("Personalization unavailable. Using standard response instead.");
        }
      } else {
        // Use standard processing (non-personalized)
        if (useTrainableAnalyzer) {
          // Use the trainable analyzer directly
          const result = processMessage(message);
          newResponse = result.response;
          analysisResult = result.analysis;
        } else {
          try {
            // First try the Hugging Face-powered response
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
      }
      
      // Update the response with the result
      setResponse(newResponse);
      
      // Store the interaction for training purposes
      setLastInteraction({
        message,
        response: newResponse,
        analysis: analysisResult,
        timestamp: Date.now()
      });
      
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

  // Toggle the analyzer type between Hugging Face AI and trainable
  const toggleAnalyzer = () => {
    setUseTrainableAnalyzer(!useTrainableAnalyzer);
    setResponse(
      !useTrainableAnalyzer
        ? "Switched to locally trained emotional intelligence. I'm learning from our interactions."
        : "Switched to cloud-based AI. I'll try to use external intelligence when available."
    );
  };

  // Effect to restore training data from localStorage on mount
  useEffect(() => {
    try {
      const storedData = localStorage.getItem('echoTwinTrainingData');
      if (storedData) {
        // Import the training data from localStorage if available
        import('./utils/trainableAnalyzer.js')
          .then(module => {
            module.importTrainingData(JSON.parse(storedData));
            console.log("Training data restored from local storage");
          })
          .catch(error => {
            console.error("Failed to import trainableAnalyzer module:", error);
          });
      }
    } catch (error) {
      console.error("Failed to restore training data:", error);
    }
  }, []);

  return (
    <div className="shadow-os-container">
      {/* Header component with title and version */}
      <Header />
      
      {/* EchoTwin component with avatar and name */}
      <EchoTwin 
        processing={isProcessing} 
        personalized={isPersonalized}
        userName={userData?.name}
      />
      
      {/* ResponseArea component to display AI responses */}
      <ResponseArea 
        response={response} 
        error={error} 
        trainingMode={
          isPersonalized 
            ? "Personalized" 
            : (useTrainableAnalyzer ? "Local Training" : "Cloud AI")
        } 
      />
      
      {/* MessageForm component for user input */}
      <MessageForm onMessageSubmit={handleMessageSubmit} isProcessing={isProcessing} />
      
      {/* Footer section */}
      <div className="footer">
        © 2025 SHADOW OS | ECHO TWIN PROTOCOL
        {!isPersonalized && (
          <div className="mode-toggle">
            <span className="mode-label">Mode: {useTrainableAnalyzer ? "Training" : "Cloud AI"}</span>
            <button 
              className="toggle-button"
              onClick={toggleAnalyzer}
            >
              {useTrainableAnalyzer ? "Use Cloud AI" : "Use Training Mode"}
            </button>
          </div>
        )}
        {isPersonalized && (
          <div className="personalized-indicator">
            Identity Mirror Active
          </div>
        )}
      </div>
      
      {/* Only show the standard training panel in non-personalized mode */}
      {!isPersonalized && (
        <>
          {/* Training Panel Toggle Button */}
          <button 
            className="training-toggle"
            onClick={() => setShowTrainingPanel(!showTrainingPanel)}
          >
            {showTrainingPanel ? "CLOSE TRAINING" : "TRAIN ECHO TWIN"}
          </button>
          
          {/* Conditional render of the Training Panel */}
          {showTrainingPanel && (
            <TrainingPanel 
              lastInteraction={lastInteraction}
              onClose={() => setShowTrainingPanel(false)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
