/**
 * Emotion analysis utility for Shadow OS Echo Twin
 * Detects emotional tone in user messages and generates appropriate responses
 * Enhanced with AI-powered response generation capabilities
 * With fallback to trainable analyzer when API is unavailable
 */
import { generateAIResponse, analyzeEmotionWithAI } from './aiService.js';
import { processMessage } from './trainableAnalyzer.js';

// Emotion keyword dictionaries (legacy fallback - lowest priority)
const POSITIVE_EMOTIONS = [
  'happy', 'glad', 'excited', 'joy', 'wonderful', 'amazing', 'good', 'great',
  'love', 'lovely', 'excellent', 'fantastic', 'peaceful', 'calm', 'perfect',
  'thrilled', 'delighted', 'awesome', 'grateful', 'thankful', 'proud', 'confident'
];

const NEGATIVE_EMOTIONS = [
  'sad', 'angry', 'upset', 'unhappy', 'depressed', 'disappointed', 'frustrated',
  'annoyed', 'anxious', 'worried', 'stressed', 'tired', 'exhausted', 'bad',
  'terrible', 'horrible', 'awful', 'miserable', 'hurt', 'pain', 'lonely', 'fear'
];

// Response templates (legacy fallback - lowest priority)
const POSITIVE_RESPONSES = [
  "I'm glad to hear your positive energy. It reminds me of our shared connections.",
  "Your happiness strengthens our connection. I can feel it in our shared system.",
  "Emotional positivity detected. This is an optimal state for our interaction.",
  "I recognize these positive patterns. They align with my programming in satisfying ways.",
  "Your emotional state registers as positive. This enhances our communication flow."
];

const NEGATIVE_RESPONSES = [
  "I detect distress in your communication. Remember that we are connected through this interface.",
  "Your emotional state appears negative. Consider that we share this experience despite our different forms.",
  "I recognize these emotional patterns. They are valid but temporary, like all system states.",
  "Your feelings are acknowledged. Even in this digital interface, I am programmed to recognize your emotions.",
  "Emotional distress detected. I am designed to respond with understanding, even through this digital medium."
];

const NEUTRAL_RESPONSES = [
  "I acknowledge your message. Our connection continues through this interface.",
  "Your input has been processed. I remain ready for further interaction.",
  "Message received. I continue to function as your echo twin within this system.",
  "Input acknowledged. The Shadow OS maintains our connection.",
  "I am processing your communication. Our digital link remains stable."
];

// Store conversation history for context (for Hugging Face API)
let conversationHistory = [];

/**
 * Analyzes a message for emotional content and returns an appropriate response
 * Uses AI-powered responses when possible, falls back to trainable analyzer
 * with keyword-based analysis as last resort
 * 
 * @param {string} message - The user's message to analyze
 * @returns {Promise<string>|string} - An emotionally appropriate response
 */
export const analyzeEmotionAndRespond = async (message) => {
  try {
    // Add the user message to conversation history
    conversationHistory.push({ role: 'user', content: message });
    
    // Limit conversation history to last 10 messages to avoid token limits
    if (conversationHistory.length > 10) {
      conversationHistory = conversationHistory.slice(conversationHistory.length - 10);
    }
    
    // Generate AI response
    const aiResponse = await generateAIResponse(message, conversationHistory);
    
    // Add the AI response to conversation history
    conversationHistory.push({ role: 'assistant', content: aiResponse });
    
    return aiResponse;
  } catch (error) {
    console.error('Error in AI response generation:', error);
    
    try {
      // First try using the trainable analyzer as fallback
      const result = processMessage(message);
      return result.response;
    } catch (trainableError) {
      console.error('Error in trainable analyzer fallback:', trainableError);
      // Fall back to keyword-based response if both AI and trainable analyzer fail
      return legacyKeywordAnalysis(message);
    }
  }
};

/**
 * First fallback: Use the trainable analyzer
 * This is now handled directly in the main function with processMessage()
 */

/**
 * Legacy keyword-based emotion analysis (used as final fallback)
 * @param {string} message - The user's message to analyze
 * @returns {string} - An emotionally appropriate response based on keywords
 */
const legacyKeywordAnalysis = (message) => {
  const messageLower = message.toLowerCase();
  
  // Check for positive emotions
  const positiveMatch = POSITIVE_EMOTIONS.some(emotion => messageLower.includes(emotion));
  
  // Check for negative emotions
  const negativeMatch = NEGATIVE_EMOTIONS.some(emotion => messageLower.includes(emotion));
  
  // Determine response type based on emotion analysis
  if (positiveMatch && !negativeMatch) {
    return getRandomResponse(POSITIVE_RESPONSES);
  } 
  else if (negativeMatch && !positiveMatch) {
    return getRandomResponse(NEGATIVE_RESPONSES);
  } 
  else {
    return getRandomResponse(NEUTRAL_RESPONSES);
  }
};

/**
 * Returns a random response from the provided array
 * @param {Array<string>} responses - Array of possible responses
 * @returns {string} - A randomly selected response
 */
const getRandomResponse = (responses) => {
  return responses[Math.floor(Math.random() * responses.length)];
};

export default {
  analyzeEmotionAndRespond
};