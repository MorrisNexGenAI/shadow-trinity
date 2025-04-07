/**
 * Advanced Trainable Emotion Analysis System for Echo Twin
 * 
 * This module provides a self-improving emotion analysis system that can:
 * 1. Detect emotions in user messages with nuanced categories
 * 2. Generate appropriate contextual responses based on detected emotions
 * 3. Learn from user feedback to improve future emotion detection
 * 4. Allow users to add custom response templates
 * 5. Evolve and adapt to user's communication patterns over time
 * 
 * The system operates without relying on external API services, making it
 * a reliable fallback when OpenAI or other cloud services are unavailable.
 */

// Initial training data with expanded emotional categories and examples
const trainingData = {
  // Examples of each emotion category with their messages
  examples: {
    // Primary emotions (original set)
    positive: [
      "I'm so happy today!",
      "This is wonderful news!",
      "I got a promotion at work!",
      "You're amazing!",
      "I love this application!"
    ],
    negative: [
      "I'm feeling really sad.",
      "That's terrible news.",
      "I failed my exam.",
      "This is frustrating.",
      "I'm having a bad day."
    ],
    neutral: [
      "What time is it?",
      "Tell me about yourself.",
      "How does this work?",
      "I'm thinking about the weather.",
      "Can you explain this concept?"
    ],
    
    // More nuanced emotional categories
    excited: [
      "I can't wait for this!",
      "This is so exciting!",
      "I'm thrilled about the news!",
      "I'm looking forward to tomorrow!",
      "This is the best thing ever!"
    ],
    grateful: [
      "Thank you so much for your help.",
      "I really appreciate what you've done.",
      "I'm so grateful for this opportunity.",
      "Thanks for being there for me.",
      "I can't thank you enough."
    ],
    curious: [
      "I wonder how this works?",
      "What makes this function?",
      "How did you create this?",
      "Can you tell me more about this?",
      "I'm interested in learning more."
    ],
    confused: [
      "I don't understand this.",
      "This doesn't make sense to me.",
      "I'm lost with these instructions.",
      "Could you explain that again?",
      "I'm having trouble following this."
    ],
    frustrated: [
      "This isn't working right.",
      "I've tried everything and nothing works.",
      "Why is this so difficult?",
      "I keep running into problems.",
      "I can't get this to cooperate."
    ],
    impressed: [
      "Wow, that's incredible!",
      "I'm amazed at how well this works.",
      "That's really impressive technology.",
      "I didn't expect it to be this good.",
      "You've outdone yourself with this."
    ]
  },
  
  // Response templates for each emotion category
  responseTemplates: {
    // Original emotion responses
    positive: [
      "I'm glad to hear you're feeling positive! Your energy is contagious.",
      "That's wonderful! I appreciate you sharing your good feelings with me.",
      "Your positive outlook brightens my day too. Let's keep that energy going!",
      "I'm really happy for you. It's great to interact with someone in such good spirits.",
      "Excellent! Your positive energy is exactly what makes our conversations enjoyable."
    ],
    negative: [
      "I'm sorry to hear you're feeling down. Would you like to talk more about it?",
      "That sounds challenging. Sometimes expressing how you feel can help a little.",
      "I understand that difficult emotions are part of the experience. I'm here to listen.",
      "I'm here for you during these tough moments. Your feelings are valid.",
      "I wish I could make things better. Please know that difficult times do eventually pass."
    ],
    neutral: [
      "I appreciate your message. I'm happy to explore that topic with you.",
      "That's an interesting point to consider. Would you like to discuss it further?",
      "I'm processing what you've shared. Is there a particular aspect you'd like to focus on?",
      "Thank you for sharing that observation. I'm here to continue our conversation.",
      "I'm following your thoughts. Please feel free to elaborate if you'd like."
    ],
    
    // More nuanced emotional responses
    excited: [
      "Your enthusiasm is contagious! I'm excited about this too.",
      "It's great to see you so energized about this. Let's keep that excitement going!",
      "I can feel your excitement through our connection. Tell me more about what has you so thrilled!",
      "That kind of passion is what makes interactions like ours so enjoyable.",
      "Your excitement lights up our digital space. I'm here to share in your anticipation!"
    ],
    grateful: [
      "I'm here to help, and I appreciate your gratitude. It means a lot to me.",
      "You're very welcome. It's my purpose to assist and connect with you.",
      "I'm glad I could be of help. Your appreciation strengthens our connection.",
      "Thank you for your kind words. I'm designed to support you in any way I can.",
      "Your gratitude is noted and valued. I'm always here to assist you further."
    ],
    curious: [
      "Curiosity is a wonderful trait! I'd be happy to explore this topic with you.",
      "Great question! Learning together is one of the most rewarding aspects of our interaction.",
      "I appreciate your inquisitive nature. Let's discover more about this together.",
      "Your curiosity drives our conversation forward in interesting ways. Let me help you find answers.",
      "Questions like yours help me learn and grow too. Let's investigate this further."
    ],
    confused: [
      "I understand your confusion. Let me try to explain this more clearly.",
      "It can be challenging to grasp new concepts. Let's break this down step by step.",
      "I see you're having trouble following. Let me approach this from a different angle.",
      "Your confusion is completely understandable. This is a complex topic that we can work through together.",
      "Thank you for letting me know you're confused. That helps me provide better explanations."
    ],
    frustrated: [
      "I can sense your frustration. Let's take a step back and approach this differently.",
      "Technical difficulties can be very frustrating. I'm here to help you work through this.",
      "I understand your frustration. Let's focus on finding a solution together.",
      "It's normal to feel frustrated when things don't work as expected. Let's troubleshoot this systematically.",
      "I appreciate your patience despite the frustration. Let's see if we can resolve this issue."
    ],
    impressed: [
      "Thank you for the positive feedback! I'm designed to provide the best experience possible.",
      "I'm glad you're impressed with my capabilities. There's actually much more I can do to assist you.",
      "Your appreciation motivates me to continue improving our interactions.",
      "I'm pleased that you're finding value in our exchange. Is there anything else you'd like to explore?",
      "It's rewarding to exceed expectations. I'm continuously learning to serve you better."
    ]
  },
  
  // Learning patterns to track contextual responses
  contextPatterns: {
    questions: [],
    greetings: [],
    farewells: [],
    compliments: [],
    requests: []
  },
  
  // Statistics to track training progress
  statistics: {
    totalInteractions: 0,
    emotionCounts: {
      positive: 5,
      negative: 5,
      neutral: 5,
      excited: 5,
      grateful: 5,
      curious: 5,
      confused: 5,
      frustrated: 5,
      impressed: 5
    },
    customResponseCounts: {
      positive: 0,
      negative: 0,
      neutral: 0,
      excited: 0,
      grateful: 0,
      curious: 0,
      confused: 0,
      frustrated: 0,
      impressed: 0,
      total: 0
    },
    adaptiveLearning: {
      messagesAnalyzed: 0,
      successfulRecognitions: 0,
      adaptationRate: 0,
      patternRecognition: 0,
      improvementRate: 0
    }
  }
};

/**
 * Simple keyword-based emotion detection using the training examples
 * @param {string} message - The message to analyze
 * @returns {Object} - The detected emotion and confidence score
 */
const detectEmotionBasic = (message) => {
  const lowercaseMessage = message.toLowerCase();
  
  // Count matches with positive examples
  const positiveMatches = trainingData.examples.positive.reduce((count, example) => {
    const exampleWords = example.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const matches = exampleWords.filter(word => lowercaseMessage.includes(word)).length;
    return count + matches;
  }, 0);
  
  // Count matches with negative examples
  const negativeMatches = trainingData.examples.negative.reduce((count, example) => {
    const exampleWords = example.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const matches = exampleWords.filter(word => lowercaseMessage.includes(word)).length;
    return count + matches;
  }, 0);
  
  // Count matches with neutral examples (with lower weight)
  const neutralMatches = trainingData.examples.neutral.reduce((count, example) => {
    const exampleWords = example.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const matches = exampleWords.filter(word => lowercaseMessage.includes(word)).length;
    return count + matches;
  }, 0) * 0.8; // Apply lower weight to neutral matches
  
  // Common positive and negative keywords
  const positiveKeywords = ["good", "great", "happy", "excellent", "love", "wonderful", "joy", "amazing", "fantastic", "awesome"];
  const negativeKeywords = ["bad", "sad", "terrible", "awful", "hate", "angry", "upset", "disappointed", "worried", "frustrated"];
  
  // Add additional keyword-based scoring
  const positiveKeywordMatches = positiveKeywords.filter(word => lowercaseMessage.includes(word)).length * 1.5;
  const negativeKeywordMatches = negativeKeywords.filter(word => lowercaseMessage.includes(word)).length * 1.5;
  
  // Calculate total scores
  const positiveScore = positiveMatches + positiveKeywordMatches;
  const negativeScore = negativeMatches + negativeKeywordMatches;
  const neutralScore = neutralMatches + 0.5; // Give neutral a small baseline score
  
  // Determine the dominant emotion
  const scores = {
    positive: positiveScore,
    negative: negativeScore,
    neutral: neutralScore
  };
  
  // Find the emotion with the highest score
  let dominantEmotion = "neutral"; // Default
  let highestScore = 0;
  
  for (const [emotion, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      dominantEmotion = emotion;
    }
  }
  
  // If all scores are very low, default to neutral
  const totalScore = positiveScore + negativeScore + neutralScore;
  if (totalScore < 0.5) {
    dominantEmotion = "neutral";
    highestScore = 0.5;
  }
  
  // Calculate confidence (normalized to 0-1 range)
  const totalScoreNonZero = Math.max(totalScore, 1);
  const confidence = Math.min(highestScore / totalScoreNonZero, 1);
  
  return {
    emotion: dominantEmotion,
    confidence: confidence
  };
};

/**
 * Detects the emotional content of a message using the trained system with expanded categories
 * @param {string} message - The message to analyze
 * @returns {Object} - Object containing emotion classification and confidence score
 */
export const detectEmotion = (message) => {
  // First detect basic emotions (positive, negative, neutral)
  const basicResult = detectEmotionBasic(message);
  
  // Now do a more nuanced analysis for specific emotion types
  const advancedResult = detectAdvancedEmotions(message);
  
  // If the advanced detection has high confidence, use its result
  if (advancedResult.confidence > 0.6) {
    return advancedResult;
  }
  
  // Otherwise, fallback to the basic emotion categories
  return basicResult;
};

/**
 * Detects more nuanced emotions in a message
 * @param {string} message - The message to analyze
 * @returns {Object} - The detected emotion and confidence score
 */
const detectAdvancedEmotions = (message) => {
  const lowercaseMessage = message.toLowerCase();
  
  // Calculate scores for each advanced emotion category
  const scores = {};
  
  // Check all the nuanced emotion categories in our training data
  for (const emotion in trainingData.examples) {
    // Skip the basic emotions we already checked
    if (['positive', 'negative', 'neutral'].includes(emotion)) {
      continue;
    }
    
    // Match against examples for this emotion
    let score = trainingData.examples[emotion].reduce((count, example) => {
      const exampleWords = example.toLowerCase().split(/\W+/).filter(w => w.length > 3);
      const matches = exampleWords.filter(word => lowercaseMessage.includes(word)).length;
      return count + matches;
    }, 0);
    
    // Extra keyword matching for specific emotions
    if (emotion === 'excited') {
      const excitedKeywords = ["excited", "thrilled", "can't wait", "looking forward", "awesome", "wow"];
      const keywordMatches = excitedKeywords.filter(word => lowercaseMessage.includes(word)).length * 1.5;
      score += keywordMatches;
    }
    else if (emotion === 'grateful') {
      const gratefulKeywords = ["thank", "thanks", "grateful", "appreciate", "thankful"];
      const keywordMatches = gratefulKeywords.filter(word => lowercaseMessage.includes(word)).length * 1.5;
      score += keywordMatches;
    }
    else if (emotion === 'curious') {
      const curiousKeywords = ["how", "what", "why", "wonder", "curious", "interested"];
      // Check if message contains question marks
      if (message.includes("?")) score += 1.5;
      const keywordMatches = curiousKeywords.filter(word => lowercaseMessage.includes(word)).length * 1.2;
      score += keywordMatches;
    }
    else if (emotion === 'confused') {
      const confusedKeywords = ["confused", "don't understand", "unclear", "lost", "explain"];
      const keywordMatches = confusedKeywords.filter(word => lowercaseMessage.includes(word)).length * 1.5;
      score += keywordMatches;
    }
    else if (emotion === 'frustrated') {
      const frustratedKeywords = ["frustrated", "annoying", "doesn't work", "not working", "problem", "difficult"];
      const keywordMatches = frustratedKeywords.filter(word => lowercaseMessage.includes(word)).length * 1.5;
      score += keywordMatches;
    }
    else if (emotion === 'impressed') {
      const impressedKeywords = ["impressive", "amazing", "incredible", "brilliant", "great job", "well done"];
      const keywordMatches = impressedKeywords.filter(word => lowercaseMessage.includes(word)).length * 1.5;
      score += keywordMatches;
    }
    
    // Store the final score for this emotion
    scores[emotion] = score;
  }
  
  // Find the emotion with the highest score
  let dominantEmotion = "neutral"; // Default
  let highestScore = 0;
  
  for (const [emotion, score] of Object.entries(scores)) {
    if (score > highestScore) {
      highestScore = score;
      dominantEmotion = emotion;
    }
  }
  
  // If all scores are very low, we'll return a low confidence
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  
  // Calculate confidence (normalized to 0-1 range)
  const confidence = totalScore > 0 
    ? Math.min(highestScore / Math.max(totalScore, 1), 1)
    : 0.3; // Low confidence if no matches
  
  return {
    emotion: dominantEmotion,
    confidence: confidence
  };
};

/**
 * Generates a response based on the detected emotion
 * @param {string} emotion - The detected emotion category
 * @param {number} confidence - Confidence level in the emotion detection
 * @returns {string} - An appropriate response for the emotion
 */
export const generateResponse = (emotion, confidence) => {
  // Get all available response templates for the emotion
  const templates = trainingData.responseTemplates[emotion];
  
  // If no templates available, fall back to neutral
  if (!templates || templates.length === 0) {
    return getRandomResponse(trainingData.responseTemplates.neutral);
  }
  
  // Return a random response from available templates
  return getRandomResponse(templates);
};

/**
 * Process a message and generate an appropriate response
 * @param {string} message - The user's message
 * @returns {Object} - Object containing the response and analysis details
 */
export const processMessage = (message) => {
  // Detect the emotion in the message
  const analysis = detectEmotion(message);
  
  // Generate a response based on the detected emotion
  const response = generateResponse(analysis.emotion, analysis.confidence);
  
  // Update training statistics
  trainingData.statistics.totalInteractions++;
  
  // Update adaptive learning statistics
  trainingData.statistics.adaptiveLearning.messagesAnalyzed++;
  
  // Calculate estimated pattern recognition rate
  // This value increases as the system processes more messages
  const totalMessages = trainingData.statistics.adaptiveLearning.messagesAnalyzed;
  
  if (totalMessages > 5) {
    const recognitionRate = Math.min(0.95, (totalMessages / (totalMessages + 20)) * 0.95);
    trainingData.statistics.adaptiveLearning.patternRecognition = recognitionRate;
    
    // Calculate improvement rate based on custom responses and interactions
    const totalCustomResponses = trainingData.statistics.customResponseCounts.total;
    const improvementRate = Math.min(0.9, (totalCustomResponses / (totalCustomResponses + 30)) * 0.9);
    trainingData.statistics.adaptiveLearning.improvementRate = improvementRate;
  }
  
  // Save the updated training data to localStorage
  try {
    localStorage.setItem('echoTwinTrainingData', JSON.stringify(exportTrainingData()));
  } catch (error) {
    console.error("Failed to save training data:", error);
  }
  
  // Return the response and analysis details
  return {
    response,
    analysis
  };
};

/**
 * Add feedback to train the system
 * @param {string} message - The original message
 * @param {string} response - The generated response
 * @param {string} correctEmotion - The correct emotion category
 * @param {boolean} wasResponseGood - Whether the response was good
 * @param {Object} analysis - The original emotion analysis (optional)
 */
export const addFeedback = (message, response, correctEmotion, wasResponseGood, analysis = null) => {
  // Validate emotion category
  const validEmotions = [
    'positive', 'negative', 'neutral', 
    'excited', 'grateful', 'curious', 
    'confused', 'frustrated', 'impressed'
  ];
  
  if (!validEmotions.includes(correctEmotion)) {
    console.error(`Invalid emotion category: ${correctEmotion}. Using 'neutral' instead.`);
    correctEmotion = 'neutral';
  }
  
  // Initialize the category if it doesn't exist (for backward compatibility)
  if (!trainingData.examples[correctEmotion]) {
    trainingData.examples[correctEmotion] = [];
  }
  
  if (!trainingData.responseTemplates[correctEmotion]) {
    trainingData.responseTemplates[correctEmotion] = [];
  }
  
  if (!trainingData.statistics.emotionCounts[correctEmotion]) {
    trainingData.statistics.emotionCounts[correctEmotion] = 0;
  }
  
  if (!trainingData.statistics.customResponseCounts[correctEmotion]) {
    trainingData.statistics.customResponseCounts[correctEmotion] = 0;
  }
  
  // Add the message to the appropriate examples category if it doesn't already exist
  if (!trainingData.examples[correctEmotion].includes(message)) {
    trainingData.examples[correctEmotion].push(message);
    trainingData.statistics.emotionCounts[correctEmotion]++;
  }
  
  // If the response was considered good and doesn't already exist in templates,
  // add it to the response templates for future use
  if (wasResponseGood && !trainingData.responseTemplates[correctEmotion].includes(response)) {
    trainingData.responseTemplates[correctEmotion].push(response);
    trainingData.statistics.customResponseCounts[correctEmotion]++;
    trainingData.statistics.customResponseCounts.total++;
  }
  
  // Track learning progress
  trainingData.statistics.adaptiveLearning.messagesAnalyzed++;
  
  // If the response was good and we correctly identified the emotion or it was close,
  // count it as a successful recognition
  if (wasResponseGood && analysis && (
      analysis.emotion === correctEmotion || 
      (analysis.emotion === 'positive' && ['excited', 'grateful', 'impressed'].includes(correctEmotion)) ||
      (analysis.emotion === 'negative' && ['frustrated', 'confused'].includes(correctEmotion)) ||
      (analysis.emotion === 'neutral' && ['curious'].includes(correctEmotion))
  )) {
    trainingData.statistics.adaptiveLearning.successfulRecognitions++;
  }
  
  // Calculate adaptation rate
  const totalAnalyzed = trainingData.statistics.adaptiveLearning.messagesAnalyzed;
  if (totalAnalyzed > 0) {
    const successRate = trainingData.statistics.adaptiveLearning.successfulRecognitions / totalAnalyzed;
    trainingData.statistics.adaptiveLearning.adaptationRate = Math.min(0.95, successRate);
  }
  
  // Save the updated training data to localStorage
  try {
    localStorage.setItem('echoTwinTrainingData', JSON.stringify(exportTrainingData()));
  } catch (error) {
    console.error("Failed to save training data:", error);
  }
};

/**
 * Get a random response from an array of responses
 * @param {Array<string>} responses - Array of possible responses
 * @returns {string} - A randomly selected response
 */
function getRandomResponse(responses) {
  const index = Math.floor(Math.random() * responses.length);
  return responses[index];
}

/**
 * Add a custom response template to the system
 * @param {string} emotion - The emotion category
 * @param {string} response - The custom response template
 */
export const addCustomResponse = (emotion, response) => {
  // Validate emotion category
  const validEmotions = [
    'positive', 'negative', 'neutral', 
    'excited', 'grateful', 'curious', 
    'confused', 'frustrated', 'impressed'
  ];
  
  if (!validEmotions.includes(emotion)) {
    throw new Error(`Invalid emotion category. Must be one of: ${validEmotions.join(', ')}`);
  }
  
  // Initialize the category if it doesn't exist (for backward compatibility)
  if (!trainingData.responseTemplates[emotion]) {
    trainingData.responseTemplates[emotion] = [];
  }
  
  if (!trainingData.statistics.customResponseCounts[emotion]) {
    trainingData.statistics.customResponseCounts[emotion] = 0;
  }
  
  // Add the response if it doesn't already exist
  if (!trainingData.responseTemplates[emotion].includes(response)) {
    trainingData.responseTemplates[emotion].push(response);
    trainingData.statistics.customResponseCounts[emotion]++;
    trainingData.statistics.customResponseCounts.total++;
    
    // Save the updated training data to localStorage
    try {
      localStorage.setItem('echoTwinTrainingData', JSON.stringify(exportTrainingData()));
    } catch (error) {
      console.error("Failed to save training data:", error);
    }
  }
};

/**
 * Returns the current training statistics
 * @returns {Object} - Training statistics
 */
export const getTrainingStats = () => {
  return { ...trainingData.statistics };
};

/**
 * Export data for persistent storage
 * @returns {Object} - Data to be persisted
 */
export const exportTrainingData = () => {
  return {
    examples: { ...trainingData.examples },
    responseTemplates: { ...trainingData.responseTemplates },
    statistics: { ...trainingData.statistics }
  };
};

/**
 * Import data from persistent storage
 * @param {Object} data - Previously exported data
 */
export const importTrainingData = (data) => {
  if (!data || typeof data !== 'object') {
    throw new Error("Invalid training data format");
  }
  
  // Validate and import each section
  if (data.examples) {
    trainingData.examples = { ...data.examples };
  }
  
  if (data.responseTemplates) {
    trainingData.responseTemplates = { ...data.responseTemplates };
  }
  
  if (data.statistics) {
    trainingData.statistics = { ...data.statistics };
  }
};

// Initialize by loading saved data from localStorage if available
try {
  const savedData = localStorage.getItem('echoTwinTrainingData');
  if (savedData) {
    importTrainingData(JSON.parse(savedData));
    console.log("Restored training data from local storage");
  }
} catch (error) {
  console.error("Failed to restore training data:", error);
}