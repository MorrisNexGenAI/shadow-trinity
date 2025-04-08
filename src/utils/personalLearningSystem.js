/**
 * Personal Learning System for Echo Twin
 * Implements continuous learning to become a more accurate reflection of the user
 * Based on the ShadowTrinity concept of Echo Twin evolving with emotional history
 */
import { analyzeText, getStyleProfile, generateMirroredText } from './styleAnalyzer.js';
import { generateAIResponse, analyzeEmotionWithAI } from './aiService.js';

// Store interactions for learning purposes
let interactionHistory = [];
let feedbackHistory = [];

// Store the current learning mode
let learningMode = 'active'; // 'active', 'passive', 'disabled'

/**
 * Initialize the learning system
 */
export const initializeLearningSystem = () => {
  try {
    // Load saved data if available
    const savedInteractions = localStorage.getItem('echoTwinInteractions');
    const savedFeedback = localStorage.getItem('echoTwinFeedback');
    const savedMode = localStorage.getItem('echoTwinLearningMode');
    
    if (savedInteractions) {
      interactionHistory = JSON.parse(savedInteractions);
    }
    
    if (savedFeedback) {
      feedbackHistory = JSON.parse(savedFeedback);
    }
    
    if (savedMode) {
      learningMode = savedMode;
    }
    
    console.log('Personal learning system initialized');
    return true;
  } catch (error) {
    console.error('Error initializing learning system:', error);
    return false;
  }
};

/**
 * Record an interaction for learning
 * @param {Object} interaction - The interaction data
 */
export const recordInteraction = (interaction) => {
  if (learningMode === 'disabled') return;
  
  try {
    // Store the interaction with timestamp
    const interactionWithTimestamp = {
      ...interaction,
      timestamp: Date.now()
    };
    
    // Add to history
    interactionHistory.push(interactionWithTimestamp);
    
    // Limit history size
    if (interactionHistory.length > 200) {
      interactionHistory.shift();
    }
    
    // Save to localStorage
    localStorage.setItem('echoTwinInteractions', JSON.stringify(interactionHistory));
    
    // In active learning mode, analyze the user's message immediately
    if (learningMode === 'active' && interaction.userMessage) {
      analyzeText(interaction.userMessage);
    }
    
    return true;
  } catch (error) {
    console.error('Error recording interaction:', error);
    return false;
  }
};

/**
 * Record user feedback for improving mimicry
 * @param {Object} feedback - The feedback data
 */
export const recordFeedback = (feedback) => {
  try {
    // Store the feedback with timestamp
    const feedbackWithTimestamp = {
      ...feedback,
      timestamp: Date.now()
    };
    
    // Add to history
    feedbackHistory.push(feedbackWithTimestamp);
    
    // Limit history size
    if (feedbackHistory.length > 100) {
      feedbackHistory.shift();
    }
    
    // Save to localStorage
    localStorage.setItem('echoTwinFeedback', JSON.stringify(feedbackHistory));
    
    return true;
  } catch (error) {
    console.error('Error recording feedback:', error);
    return false;
  }
};

/**
 * Change the learning mode
 * @param {string} mode - The learning mode ('active', 'passive', 'disabled')
 */
export const setLearningMode = (mode) => {
  if (['active', 'passive', 'disabled'].includes(mode)) {
    learningMode = mode;
    localStorage.setItem('echoTwinLearningMode', mode);
    return true;
  }
  return false;
};

/**
 * Get the current learning mode
 * @returns {string} - The current learning mode
 */
export const getLearningMode = () => {
  return learningMode;
};

/**
 * Get interaction statistics for the learning dashboard
 * @returns {Object} - Statistics about recorded interactions
 */
export const getLearningStats = () => {
  try {
    // Count total interactions
    const totalInteractions = interactionHistory.length;
    
    // Count positive feedback instances
    const positiveFeedback = feedbackHistory.filter(item => item.positive).length;
    
    // Count negative feedback instances
    const negativeFeedback = feedbackHistory.filter(item => !item.positive).length;
    
    // Calculate feedback ratio
    const feedbackRatio = totalInteractions > 0
      ? Math.round((positiveFeedback / (positiveFeedback + negativeFeedback || 1)) * 100)
      : 0;
    
    // Get recent interaction timestamp
    const lastInteractionTime = interactionHistory.length > 0
      ? interactionHistory[interactionHistory.length - 1].timestamp
      : null;
    
    // Calculate trend (more positive or negative feedback recently)
    const recentFeedback = feedbackHistory.slice(-20);
    const recentPositive = recentFeedback.filter(item => item.positive).length;
    const recentNegative = recentFeedback.filter(item => !item.positive).length;
    const trend = recentPositive > recentNegative
      ? 'improving'
      : recentNegative > recentPositive
        ? 'needs_improvement'
        : 'stable';
    
    return {
      totalInteractions,
      positiveFeedback,
      negativeFeedback,
      feedbackRatio,
      lastInteractionTime,
      trend,
      learningMode
    };
  } catch (error) {
    console.error('Error getting learning stats:', error);
    return {
      totalInteractions: 0,
      positiveFeedback: 0,
      negativeFeedback: 0,
      feedbackRatio: 0,
      lastInteractionTime: null,
      trend: 'unknown',
      learningMode
    };
  }
};

/**
 * Apply MemoryLink concept to recall previous interactions
 * @param {string} topic - Optional topic to recall memories about
 * @returns {Object|null} - A relevant memory or null if none found
 */
export const recallMemory = (topic = null) => {
  try {
    if (interactionHistory.length === 0) {
      return null;
    }
    
    let relevantMemories = [];
    
    if (topic) {
      // Find memories relevant to the topic
      relevantMemories = interactionHistory.filter(interaction => 
        interaction.userMessage && 
        interaction.userMessage.toLowerCase().includes(topic.toLowerCase())
      );
    }
    
    // If no topic-specific memories found, select based on other criteria
    if (relevantMemories.length === 0) {
      // Choose memories with positive feedback
      const positiveInteractions = interactionHistory.filter(interaction => {
        const feedback = feedbackHistory.find(f => 
          f.interactionId === interaction.id && f.positive
        );
        return feedback !== undefined;
      });
      
      if (positiveInteractions.length > 0) {
        relevantMemories = positiveInteractions;
      } else {
        // Use random selection from all memories
        relevantMemories = interactionHistory;
      }
    }
    
    // Select a memory, prioritizing more recent ones (70% chance)
    const useRecentMemory = Math.random() < 0.7;
    let selectedMemory;
    
    if (useRecentMemory && relevantMemories.length > 3) {
      // Select from the most recent third of memories
      const recentMemories = relevantMemories.slice(-Math.floor(relevantMemories.length / 3));
      selectedMemory = recentMemories[Math.floor(Math.random() * recentMemories.length)];
    } else {
      // Random selection from all relevant memories
      selectedMemory = relevantMemories[Math.floor(Math.random() * relevantMemories.length)];
    }
    
    return selectedMemory;
  } catch (error) {
    console.error('Error recalling memory:', error);
    return null;
  }
};

/**
 * Generate a response that mimics the user's style
 * Core feature of Echo Twin's identity mirroring
 * @param {string} message - The message to respond to
 * @param {Object} options - Additional options for response generation
 * @returns {Promise<string>} - A response in the user's style
 */
export const generatePersonalizedResponse = async (message, options = {}) => {
  try {
    // Analyze the emotional content of the message
    let emotionalAnalysis;
    try {
      emotionalAnalysis = await analyzeEmotionWithAI(message);
    } catch (error) {
      console.error('Error analyzing emotion:', error);
      emotionalAnalysis = { emotion: 'neutral', intensity: 5 };
    }
    
    // Check if we should use a remembered response
    const useMemory = !options.disableMemory && Math.random() < 0.2;
    
    let baseResponse;
    if (useMemory) {
      // Try to find a relevant memory
      const memory = recallMemory(message.split(' ').slice(0, 3).join(' '));
      
      if (memory && memory.aiResponse) {
        baseResponse = `I recall we discussed this. ${memory.aiResponse}`;
      }
    }
    
    // If no memory was used or found, generate a new response
    if (!baseResponse) {
      try {
        baseResponse = await generateAIResponse(message, options.conversationHistory || []);
      } catch (error) {
        console.error('Error generating AI response:', error);
        baseResponse = "I'm processing that in my own way... Let me think about what you said.";
      }
    }
    
    // Apply style transformation to make it sound like the user
    const styleProfile = getStyleProfile();
    
    // Skip mirroring if no style profile exists yet
    if (!styleProfile || !styleProfile.ownerIdentity.name) {
      return baseResponse;
    }
    
    // Create emotion overrides based on the message analysis
    // This makes Echo Twin respond in a mood appropriate to the conversation
    const moodOverrides = {
      joy: emotionalAnalysis.emotion === 'positive' || emotionalAnalysis.emotion === 'excited' ? 7 : 3,
      intensity: emotionalAnalysis.intensity || 5,
      curiosity: emotionalAnalysis.emotion === 'curious' ? 8 : 4,
      sorrow: emotionalAnalysis.emotion === 'negative' ? 7 : 2
    };
    
    // Transform the response to match the user's style
    const personalizedResponse = generateMirroredText(baseResponse, moodOverrides);
    
    // Record this interaction for learning
    const interactionId = Date.now().toString();
    recordInteraction({
      id: interactionId,
      userMessage: message,
      aiResponse: personalizedResponse,
      emotionalAnalysis
    });
    
    return personalizedResponse;
  } catch (error) {
    console.error('Error generating personalized response:', error);
    return "I'm still learning to express myself in your style. Can you share more with me?";
  }
};

/**
 * Clear all learning data (for privacy or reset purposes)
 */
export const clearLearningData = () => {
  try {
    interactionHistory = [];
    feedbackHistory = [];
    localStorage.removeItem('echoTwinInteractions');
    localStorage.removeItem('echoTwinFeedback');
    return true;
  } catch (error) {
    console.error('Error clearing learning data:', error);
    return false;
  }
};

// Export default interface
export default {
  initializeLearningSystem,
  recordInteraction,
  recordFeedback,
  setLearningMode,
  getLearningMode,
  getLearningStats,
  recallMemory,
  generatePersonalizedResponse,
  clearLearningData
};