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

/**
 * The main App component that composes all Shadow OS parts
 */
function App() {
  // Initial state with a welcoming message
  const [response, setResponse] = useState('Echo Twin ready. How are you feeling today?');
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
      
      // Check if we should use the trainable analyzer or try Hugging Face AI first
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
      <EchoTwin processing={isProcessing} />
      
      {/* ResponseArea component to display AI responses */}
      <ResponseArea 
        response={response} 
        error={error} 
        trainingMode={useTrainableAnalyzer ? "Local Training" : "Cloud AI"} 
      />
      
      {/* MessageForm component for user input */}
      <MessageForm onMessageSubmit={handleMessageSubmit} isProcessing={isProcessing} />
      
      {/* Footer section */}
      <div className="footer">
        © 2025 SHADOW OS | ECHO TWIN PROTOCOL
        <div className="mode-toggle">
          <span className="mode-label">Mode: {useTrainableAnalyzer ? "Training" : "Cloud AI"}</span>
          <button 
            className="toggle-button"
            onClick={toggleAnalyzer}
          >
            {useTrainableAnalyzer ? "Use Cloud AI" : "Use Training Mode"}
          </button>
        </div>
      </div>
      
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
    </div>
  );
}

export default App;
