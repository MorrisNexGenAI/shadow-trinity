import { useState, useEffect } from 'react';
import './App.css';

// Import components
import Header from './components/header';
import EchoTwin from './components/Echotwin';
import ResponseArea from './components/ResponsiveArea';
import MessageForm from './components/MessageForm';
import TrainingPanel from './components/TrainingPanel';
import ModeToggle from './components/ModeToggle';
import QuizPanel from './components/QuizPanel';
import Avatar from './components/Avatar';

// Import the emotional analyzer utilities
import { analyzeEmotionAndRespond } from './utils/emotionalAnalyzer.js';
import { processMessage } from './utils/trainableAnalyzer.js';

// Import AI service utilities
import { generateAIResponse, generateLogicCoreResponse } from './utils/aiService.js';

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
  
  // Current mode state - 'echo' (emotional) or 'logic' (analytical)
  const [mode, setMode] = useState('echo');
  
  // State for detected emotion from user messages
  const [currentEmotion, setCurrentEmotion] = useState('neutral');
  
  // State to toggle the quiz panel visibility
  const [showQuizPanel, setShowQuizPanel] = useState(false);
  
  // Conversation history for context in AI responses
  const [conversationHistory, setConversationHistory] = useState([]);
  
  /**
   * Handles message submission from the MessageForm component
   * Analyzes the message and updates the response state
   * @param {string} message - The user's message
   */
  const handleMessageSubmit = async (message) => {
    try {
      // Show processing state (could be used for UI effects)
      setIsProcessing(true);
      
      // Set a temporary processing message based on current mode
      setResponse(mode === 'echo' 
        ? 'Processing your message...' 
        : 'Analyzing input. Please wait.'
      );
      
      // Add user message to conversation history
      const updatedHistory = [
        ...conversationHistory,
        { role: 'user', content: message }
      ];
      setConversationHistory(updatedHistory);
      
      let newResponse;
      let analysisResult = null;
      
      // First, determine which mode we're in (Echo Twin or Logic Core)
      if (mode === 'logic') {
        // LOGIC CORE MODE: analytical, factual, structured responses
        try {
          // Use the Hugging Face-powered Logic Core response
          newResponse = await generateLogicCoreResponse(message, updatedHistory.slice(-6));
        } catch (aiError) {
          console.error("Error with Logic Core service:", aiError);
          
          // Fall back to a simpler analytical response
          newResponse = "My logical processing systems are experiencing difficulties. Please try again or switch to Echo Twin mode.";
          setError("Logic Core processing unavailable.");
        }
      } else {
        // ECHO TWIN MODE: emotional, personalized, empathetic responses
        
        // Determine if we should use personalized processing or standard processing
        if (isPersonalized) {
          try {
            // First get a standard response to use as a base
            let baseResponse;
            
            try {
              // Try to get an enhanced AI response with the new service
              baseResponse = await generateAIResponse(message, updatedHistory.slice(-6), 'echo', userData);
              
              // Also analyze emotion for the avatar
              const emotionAnalysis = await analyzeEmotionWithAI(message);
              if (emotionAnalysis && emotionAnalysis.emotion) {
                setCurrentEmotion(emotionAnalysis.emotion);
                analysisResult = emotionAnalysis;
              }
            } catch (aiError) {
              console.error("Error with AI service:", aiError);
              // Fall back to trainable analyzer
              const result = processMessage(message);
              baseResponse = result.response;
              analysisResult = result.analysis;
              if (analysisResult && analysisResult.emotion) {
                setCurrentEmotion(analysisResult.emotion);
              }
            }
            
            // Now apply the personalization layer
            newResponse = await generatePersonalizedResponse(message, {
              baseResponse,
              includePersonalReferences: Math.random() > 0.6, // Occasionally include personal context
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
              if (analysisResult && analysisResult.emotion) {
                setCurrentEmotion(analysisResult.emotion);
              }
            } else {
              try {
                newResponse = await generateAIResponse(message, updatedHistory.slice(-6), 'echo');
                
                // Analyze emotion separately
                const emotionAnalysis = await analyzeEmotionWithAI(message);
                if (emotionAnalysis && emotionAnalysis.emotion) {
                  setCurrentEmotion(emotionAnalysis.emotion);
                  analysisResult = emotionAnalysis;
                }
              } catch (aiError) {
                newResponse = await analyzeEmotionAndRespond(message);
              }
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
            if (analysisResult && analysisResult.emotion) {
              setCurrentEmotion(analysisResult.emotion);
            }
          } else {
            try {
              // Use the enhanced AI service
              newResponse = await generateAIResponse(message, updatedHistory.slice(-6), 'echo');
              
              // Analyze emotion separately for avatar
              const emotionAnalysis = await analyzeEmotionWithAI(message);
              if (emotionAnalysis && emotionAnalysis.emotion) {
                setCurrentEmotion(emotionAnalysis.emotion);
                analysisResult = emotionAnalysis;
              }
              
            } catch (aiError) {
              console.error("Error with AI service:", aiError);
              
              // Try the older emotion analysis as fallback
              try {
                newResponse = await analyzeEmotionAndRespond(message);
              } catch (emotionError) {
                // If all AI services fail, fall back to trainable analyzer
                const result = processMessage(message);
                newResponse = result.response;
                analysisResult = result.analysis;
                if (analysisResult && analysisResult.emotion) {
                  setCurrentEmotion(analysisResult.emotion);
                }
                
                // Show error about falling back
                setError("AI services unavailable. Using local emotion analysis instead.");
              }
            }
          }
        }
      }
      
      // Update the response with the result
      setResponse(newResponse);
      
      // Add assistant response to conversation history
      setConversationHistory([
        ...updatedHistory,
        { role: 'assistant', content: newResponse }
      ]);
      
      // Store the interaction for training purposes
      setLastInteraction({
        message,
        response: newResponse,
        analysis: analysisResult,
        timestamp: Date.now(),
        mode: mode
      });
      
    } catch (error) {
      console.error("Error processing message:", error);
      setError("Could not process your message. System is experiencing technical difficulties.");
      
      // Ultimate fallback for catastrophic failures
      setResponse(mode === 'echo' 
        ? "Echo Twin is experiencing technical difficulties. Please try again later." 
        : "Logic Core process failed. System requires maintenance."
      );
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

  // Handler for quiz completion
  const handleQuizComplete = (category, results) => {
    console.log(`Quiz completed in category: ${category}`, results);
    
    // Use the quiz results to enhance the user profile
    if (results && results.length > 0) {
      // Record the interaction for learning
      recordInteraction({
        type: 'quiz',
        category,
        results,
        timestamp: Date.now(),
      });
      
      // Acknowledge the quiz completion
      setResponse(`Thank you for completing the ${category} quiz. This helps me understand you better.`);
    }
  };

  return (
    <div className="shadow-os-container">
      {/* Mode Toggle for switching between Echo Twin and Logic Core */}
      <ModeToggle mode={mode} setMode={setMode} />
      
      {/* Header component with title and version */}
      <Header />
      
      {/* Avatar display with emotion state */}
      <div className="avatar-wrapper">
        <Avatar 
          mode={mode} 
          emotion={currentEmotion} 
          userName={userData?.name} 
        />
      </div>
      
      {/* EchoTwin component with avatar and name */}
      <EchoTwin 
        processing={isProcessing} 
        personalized={isPersonalized}
        userName={userData?.name}
        mode={mode}
      />
      
      {/* ResponseArea component to display AI responses */}
      <ResponseArea 
        response={response} 
        error={error} 
        trainingMode={
          mode === 'logic' 
            ? "Logic Core" 
            : (isPersonalized 
                ? "Echo Twin (Personalized)" 
                : (useTrainableAnalyzer ? "Echo Twin (Training)" : "Echo Twin (Cloud AI)"))
        } 
      />
      
      {/* MessageForm component for user input */}
      <MessageForm onMessageSubmit={handleMessageSubmit} isProcessing={isProcessing} />
      
      {/* Quiz button for learning more about the user */}
      <button 
        className="quiz-toggle-button"
        onClick={() => setShowQuizPanel(true)}
      >
        Take Learning Quiz
      </button>
      
      {/* Footer section */}
      <div className="footer">
        © 2025 SHADOW OS | {mode === 'echo' ? 'ECHO TWIN' : 'LOGIC CORE'} PROTOCOL
        {mode === 'echo' && !isPersonalized && (
          <div className="mode-toggle">
            <span className="mode-label">Engine: {useTrainableAnalyzer ? "Training" : "Cloud AI"}</span>
            <button 
              className="toggle-button"
              onClick={toggleAnalyzer}
            >
              {useTrainableAnalyzer ? "Use Cloud AI" : "Use Training Mode"}
            </button>
          </div>
        )}
        {mode === 'echo' && isPersonalized && (
          <div className="personalized-indicator">
            Identity Mirror Active
          </div>
        )}
      </div>
      
      {/* Only show the standard training panel in Echo Twin non-personalized mode */}
      {mode === 'echo' && !isPersonalized && (
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
      
      {/* Quiz Panel for user learning */}
      {showQuizPanel && (
        <QuizPanel 
          onClose={() => setShowQuizPanel(false)}
          onQuizComplete={handleQuizComplete}
        />
      )}
    </div>
  );
}

export default App;
