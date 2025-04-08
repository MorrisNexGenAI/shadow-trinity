/**
 * Personal Learning System for Echo Twin
 * Implements continuous learning to become a more accurate reflection of the user
 * Based on the ShadowTrinity concept of Echo Twin evolving with emotional history
 */

import { analyzeText } from './styleAnalyzer';
import { analyzeSample } from './deepIdentityProfiler';
import { generateMirroredText as generateIdMirroredText } from './deepIdentityProfiler';
import { generateMirroredText as generateStyleMirroredText } from './styleAnalyzer';

// Learning data structure
let learningData = {
  // Core learning settings
  settings: {
    mode: 'active',  // 'active', 'passive', or 'disabled'
    feedbackWeight: 0.7, // How much weight to give to explicit feedback (0-1)
    adaptationRate: 0.5, // How quickly the system adapts to new data (0-1)
  },
  
  // Interaction history
  interactions: [], // History of user interactions for learning
  
  // Feedback data
  feedback: {
    positive: 0,
    negative: 0,
    neutral: 0,
    correctionHistory: [], // History of corrections for learning
  },
  
  // Learning stats
  stats: {
    totalSamples: 0,
    totalFeedback: 0,
    adaptations: 0,
    confidenceScore: 0.5, // 0-1 scale of how confident the system is
    lastLearningTimestamp: null,
  },
  
  // Topic and context memory (MemoryLink concept)
  memories: {
    // Organized by topic/context
    topics: {},
    // Chronological memory snippets
    timeline: [],
    // Emotional memory - traces of emotion tied to topics
    emotionalTraces: {}
  }
};

// Initialize the learning system
export const initializeLearningSystem = (userData = null) => {
  // Reset to defaults if no prior data exists
  if (localStorage.getItem('personalLearningData') === null) {
    resetLearningData();
  } else {
    try {
      // Load saved data
      const savedData = localStorage.getItem('personalLearningData');
      if (savedData) {
        learningData = JSON.parse(savedData);
      }
    } catch (error) {
      console.error('Error loading learning data:', error);
      resetLearningData();
    }
  }
  
  // If user data is provided (from onboarding), initialize with it
  if (userData) {
    // Process writing samples as initial interactions
    if (userData.writingSamples && userData.writingSamples.length > 0) {
      userData.writingSamples.forEach((sample, index) => {
        recordInteraction({
          type: 'onboarding',
          text: sample,
          timestamp: Date.now() - (userData.writingSamples.length - index) * 1000,
          context: 'initial_sample'
        });
      });
    }
    
    // Initialize with user name for memories
    if (userData.name) {
      learningData.memories.topics['user_identity'] = {
        name: userData.name,
        examples: [],
        importance: 1.0,
        lastAccessed: Date.now()
      };
    }
    
    // Initialize with interests for memories
    if (userData.interests && userData.interests.length > 0) {
      userData.interests.forEach(interest => {
        learningData.memories.topics[interest.toLowerCase()] = {
          name: interest,
          examples: [],
          importance: 0.8,
          lastAccessed: Date.now()
        };
      });
    }
    
    // Set learning mode based on whether personalization is enabled
    learningData.settings.mode = 'active';
  }
  
  // Save the initialized data
  saveLearningData();
  
  return learningData;
};

/**
 * Record an interaction for learning
 * @param {Object} interaction - The interaction data
 */
export const recordInteraction = (interaction) => {
  // Skip if learning is disabled
  if (learningData.settings.mode === 'disabled') return;
  
  // Validate input
  if (!interaction || !interaction.text) return;
  
  // Create interaction record
  const record = {
    type: interaction.type || 'message',
    text: interaction.text,
    timestamp: interaction.timestamp || Date.now(),
    context: interaction.context || 'general',
    topics: interaction.topics || [],
    emotionalTone: interaction.emotionalTone || null,
    analyzed: false
  };
  
  // Add to interactions history
  learningData.interactions.push(record);
  
  // Keep interactions at a reasonable number
  if (learningData.interactions.length > 100) {
    learningData.interactions = learningData.interactions.slice(-100);
  }
  
  // Update stats
  learningData.stats.totalSamples++;
  learningData.stats.lastLearningTimestamp = Date.now();
  
  // Process interaction for learning immediately in active mode
  if (learningData.settings.mode === 'active') {
    // Analyze the text to update style and identity profiles
    analyzeText(interaction.text);
    analyzeSample(interaction.text);
    
    // Add to memory system
    addToMemory(record);
    
    // Mark as analyzed
    record.analyzed = true;
    learningData.stats.adaptations++;
  }
  
  // Save learning data
  saveLearningData();
};

/**
 * Record user feedback for improving mimicry
 * @param {Object} feedback - The feedback data
 */
export const recordFeedback = (feedback) => {
  // Skip if learning is disabled
  if (learningData.settings.mode === 'disabled') return;
  
  // Validate input
  if (!feedback || !feedback.originalText) return;
  
  // Create feedback record
  const record = {
    originalText: feedback.originalText,
    responseText: feedback.responseText || null,
    correctedText: feedback.correctedText || null,
    rating: feedback.rating || 'neutral', // 'positive', 'negative', 'neutral'
    timestamp: Date.now()
  };
  
  // Update feedback counters
  if (record.rating === 'positive') {
    learningData.feedback.positive++;
  } else if (record.rating === 'negative') {
    learningData.feedback.negative++;
  } else {
    learningData.feedback.neutral++;
  }
  
  // If it's a correction (has correctedText), add to correction history
  if (record.correctedText) {
    learningData.feedback.correctionHistory.push(record);
    
    // Keep correction history at a reasonable size
    if (learningData.feedback.correctionHistory.length > 30) {
      learningData.feedback.correctionHistory = learningData.feedback.correctionHistory.slice(-30);
    }
    
    // Learn from the correction (give it high weight)
    analyzeText(record.correctedText);
    analyzeSample(record.correctedText, 1.5); // Higher weight for corrections
  }
  
  // Update stats
  learningData.stats.totalFeedback++;
  
  // Update confidence score
  const positiveRatio = learningData.feedback.positive / 
    Math.max(1, learningData.feedback.positive + learningData.feedback.negative);
  
  learningData.stats.confidenceScore = 
    (learningData.stats.confidenceScore * 0.8) + (positiveRatio * 0.2);
  
  // Save learning data
  saveLearningData();
};

/**
 * Change the learning mode
 * @param {string} mode - The learning mode ('active', 'passive', 'disabled')
 */
export const setLearningMode = (mode) => {
  if (['active', 'passive', 'disabled'].includes(mode)) {
    learningData.settings.mode = mode;
    
    // If changing to active, process any unanalyzed interactions
    if (mode === 'active') {
      const unanalyzed = learningData.interactions.filter(interaction => !interaction.analyzed);
      unanalyzed.forEach(interaction => {
        analyzeText(interaction.text);
        analyzeSample(interaction.text);
        interaction.analyzed = true;
        learningData.stats.adaptations++;
      });
    }
    
    saveLearningData();
  }
};

/**
 * Get the current learning mode
 * @returns {string} - The current learning mode
 */
export const getLearningMode = () => {
  return learningData.settings.mode;
};

/**
 * Get interaction statistics for the learning dashboard
 * @returns {Object} - Statistics about recorded interactions
 */
export const getLearningStats = () => {
  // Calculate additional stats
  const now = Date.now();
  const recentInteractions = learningData.interactions.filter(
    interaction => (now - interaction.timestamp) < 7 * 24 * 60 * 60 * 1000 // 1 week
  ).length;
  
  // Return stats with calculated values
  return {
    ...learningData.stats,
    feedbackStats: {
      positive: learningData.feedback.positive,
      negative: learningData.feedback.negative,
      neutral: learningData.feedback.neutral,
      corrections: learningData.feedback.correctionHistory.length
    },
    interactionStats: {
      total: learningData.interactions.length,
      recent: recentInteractions,
      byType: countInteractionsByType()
    },
    memoryStats: {
      topicCount: Object.keys(learningData.memories.topics).length,
      timelineEntries: learningData.memories.timeline.length,
      emotionalTraceCount: Object.keys(learningData.memories.emotionalTraces).length
    }
  };
};

/**
 * Helper function to count interactions by type
 */
const countInteractionsByType = () => {
  const counts = {};
  
  learningData.interactions.forEach(interaction => {
    if (!counts[interaction.type]) {
      counts[interaction.type] = 0;
    }
    counts[interaction.type]++;
  });
  
  return counts;
};

/**
 * Add an interaction to the memory system
 * @param {Object} interaction - The interaction to add to memory
 */
const addToMemory = (interaction) => {
  // Add to timeline
  learningData.memories.timeline.push({
    text: interaction.text.substring(0, 100) + (interaction.text.length > 100 ? '...' : ''),
    timestamp: interaction.timestamp,
    context: interaction.context,
    emotionalTone: interaction.emotionalTone
  });
  
  // Keep timeline at a reasonable size
  if (learningData.memories.timeline.length > 30) {
    learningData.memories.timeline = learningData.memories.timeline.slice(-30);
  }
  
  // Extract potential topics from text
  const topics = extractTopics(interaction.text);
  
  // Add to topics memory
  topics.forEach(topic => {
    if (!learningData.memories.topics[topic]) {
      // Create new topic
      learningData.memories.topics[topic] = {
        name: topic,
        examples: [],
        importance: 0.5,
        lastAccessed: interaction.timestamp
      };
    }
    
    // Add example if it's not too similar to existing ones
    if (learningData.memories.topics[topic].examples.length < 5) {
      learningData.memories.topics[topic].examples.push(
        interaction.text.substring(0, 100) + (interaction.text.length > 100 ? '...' : '')
      );
    }
    
    // Update topic importance and access time
    learningData.memories.topics[topic].importance += 0.1;
    learningData.memories.topics[topic].lastAccessed = interaction.timestamp;
  });
  
  // Add emotional trace if available
  if (interaction.emotionalTone) {
    topics.forEach(topic => {
      if (!learningData.memories.emotionalTraces[topic]) {
        learningData.memories.emotionalTraces[topic] = [];
      }
      
      learningData.memories.emotionalTraces[topic].push({
        emotion: interaction.emotionalTone,
        strength: 0.8,
        timestamp: interaction.timestamp
      });
      
      // Keep emotional traces at a reasonable size
      if (learningData.memories.emotionalTraces[topic].length > 10) {
        learningData.memories.emotionalTraces[topic] = 
          learningData.memories.emotionalTraces[topic].slice(-10);
      }
    });
  }
};

/**
 * Extract potential topics from text
 * @param {string} text - Text to extract topics from
 * @returns {Array<string>} - Extracted topics
 */
const extractTopics = (text) => {
  const topics = [];
  
  // Simple approach: extract nouns and noun phrases
  // This is a very basic implementation - could be improved with NLP
  
  // Check for existing topics in the text
  Object.keys(learningData.memories.topics).forEach(topic => {
    if (text.toLowerCase().includes(topic.toLowerCase())) {
      topics.push(topic);
    }
  });
  
  // Extract new potential topics (simple approach)
  const words = text.match(/\\b[A-Z][a-z]{2,}\\b/g) || []; // Capitalized words as potential topics
  words.forEach(word => {
    if (!topics.includes(word.toLowerCase())) {
      topics.push(word.toLowerCase());
    }
  });
  
  return topics.slice(0, 3); // Limit to 3 topics
};

/**
 * Apply MemoryLink concept to recall previous interactions
 * @param {string} topic - Optional topic to recall memories about
 * @returns {Object|null} - A relevant memory or null if none found
 */
export const recallMemory = (topic = null) => {
  // If no specific topic, try to find a relevant one
  if (!topic) {
    // Get topics ordered by importance
    const topTopics = Object.entries(learningData.memories.topics)
      .sort((a, b) => b[1].importance - a[1].importance)
      .slice(0, 3)
      .map(entry => entry[0]);
    
    if (topTopics.length === 0) return null;
    
    // Choose a random topic from the top ones
    topic = topTopics[Math.floor(Math.random() * topTopics.length)];
  }
  
  // Look for the topic
  const topicMemory = learningData.memories.topics[topic];
  if (!topicMemory) return null;
  
  // Update access time
  topicMemory.lastAccessed = Date.now();
  saveLearningData();
  
  // Construct memory from topic data
  const memory = {
    topic: topicMemory.name,
    examples: topicMemory.examples,
    importance: topicMemory.importance,
    emotionalTraces: learningData.memories.emotionalTraces[topic] || []
  };
  
  return memory;
};

/**
 * Generate a response that mimics the user's style
 * Core feature of Echo Twin's identity mirroring
 * @param {string} message - The message to respond to
 * @param {Object} options - Additional options for response generation
 * @returns {Promise<string>} - A response in the user's style
 */
export const generatePersonalizedResponse = async (message, options = {}) => {
  // If a base response is provided, use it; otherwise start with a generic response
  const baseResponse = options.baseResponse || 
    "I understand what you're saying. That's an interesting point.";
  
  // Check confidence level to determine how much personalization to apply
  const confidenceLevel = learningData.stats.confidenceScore;
  let response = baseResponse;
  
  // Apply emotional tone adjustment if specified
  const emotionalTone = options.emotionalTone || null;
  let moodOverrides = null;
  
  if (emotionalTone) {
    moodOverrides = {
      joy: emotionalTone === 'joy' ? 8 : 0,
      sadness: emotionalTone === 'sadness' ? 8 : 0,
      anger: emotionalTone === 'anger' ? 8 : 0,
      surprise: emotionalTone === 'surprise' ? 8 : 0,
    };
  }
  
  // Apply style mirroring with confidence-based blending
  if (confidenceLevel > 0.3) {
    try {
      // Merge identity and style mirroring
      const idStyled = generateIdMirroredText(baseResponse, { 
        includePersonalReferences: options.includePersonalReferences || false 
      });
      
      // Apply style-based mirroring on top
      response = generateStyleMirroredText(idStyled, moodOverrides);
      
      // For low confidence, blend with original response
      if (confidenceLevel < 0.7) {
        // This is a simplified blending - in reality, you might want more sophisticated merging
        const blendRatio = (confidenceLevel - 0.3) / 0.4; // 0.3-0.7 -> 0-1
        
        // Very simple blend: choose sections from each version
        const originalSentences = baseResponse.split('.');
        const personalizedSentences = response.split('.');
        
        if (originalSentences.length > 1 && personalizedSentences.length > 1) {
          // Take some sentences from each
          const mixedSentences = [];
          
          for (let i = 0; i < Math.max(originalSentences.length, personalizedSentences.length); i++) {
            if (i < personalizedSentences.length && Math.random() < blendRatio) {
              mixedSentences.push(personalizedSentences[i]);
            } else if (i < originalSentences.length) {
              mixedSentences.push(originalSentences[i]);
            }
          }
          
          response = mixedSentences.join('.');
        }
      }
    } catch (error) {
      console.error('Error generating personalized response:', error);
      response = baseResponse; // Fallback to base response on error
    }
  }
  
  // Apply memory-based personalization
  if (options.includeMemories && Math.random() < 0.3) {
    try {
      const memory = recallMemory();
      if (memory && memory.examples.length > 0) {
        // Reference the memory in the response
        const memoryInsight = memory.examples[Math.floor(Math.random() * memory.examples.length)];
        
        // Add memory reference if it's not already included
        if (!response.includes(memory.topic)) {
          const memoryPhrases = [
            `That reminds me of ${memory.topic}.`,
            `This is similar to ${memory.topic} we discussed.`,
            `I recall something about ${memory.topic}.`,
            `Speaking of ${memory.topic}...`
          ];
          
          const phrase = memoryPhrases[Math.floor(Math.random() * memoryPhrases.length)];
          response = response + ' ' + phrase;
        }
      }
    } catch (error) {
      console.error('Error adding memory to response:', error);
      // Continue without memory addition
    }
  }
  
  return response;
};

/**
 * Clear all learning data (for privacy or reset purposes)
 */
export const clearLearningData = () => {
  resetLearningData();
  saveLearningData();
};

/**
 * Reset learning data to defaults
 */
const resetLearningData = () => {
  learningData = {
    settings: {
      mode: 'active',
      feedbackWeight: 0.7,
      adaptationRate: 0.5,
    },
    interactions: [],
    feedback: {
      positive: 0,
      negative: 0,
      neutral: 0,
      correctionHistory: [],
    },
    stats: {
      totalSamples: 0,
      totalFeedback: 0,
      adaptations: 0,
      confidenceScore: 0.5,
      lastLearningTimestamp: null,
    },
    memories: {
      topics: {},
      timeline: [],
      emotionalTraces: {}
    }
  };
};

/**
 * Save learning data to localStorage
 */
const saveLearningData = () => {
  try {
    localStorage.setItem('personalLearningData', JSON.stringify(learningData));
  } catch (error) {
    console.error('Error saving learning data:', error);
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