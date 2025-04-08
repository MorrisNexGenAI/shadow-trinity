/**
 * Deep Identity Profiler for Echo Twin
 * Advanced system for capturing the essence of a person's identity
 * Creates a detailed neural map of communication patterns and personality markers
 */

// Core identity matrix components
const identityMatrix = {
  // Personality dimensions (based on psycholinguistic research)
  personalityMarkers: {
    openness: 0,          // Curiosity, creativity, openness to new experiences
    conscientiousness: 0,  // Organization, responsibility, planning
    extraversion: 0,       // Social energy, assertiveness
    agreeableness: 0,      // Cooperation, compassion, politeness
    neuroticism: 0,        // Emotional stability, anxiety, stress sensitivity
  },
  
  // Communication style markers
  communicationPatterns: {
    directness: 0,         // Direct vs. indirect communication
    formality: 0,          // Formal vs. casual language
    expansiveness: 0,      // Brief vs. detailed expression
    assertiveness: 0,      // Tentative vs. confident language
    emotionalTone: 0,      // Emotional vs. neutral language
  },
  
  // Advanced linguistic signatures
  linguisticSignatures: {
    sentenceLength: [],     // Distribution of sentence lengths
    wordComplexity: 0,      // Average word complexity
    punctuationFrequency: {},  // Frequency of different punctuations
    favoriteWords: {},      // Frequently used words (not including common words)
    transitionalPhrases: [], // Phrases used to transition between ideas
    uniqueExpressions: [],  // Highly unique or signature phrases
  },
  
  // Conversational rhythms
  conversationalDynamics: {
    responseSpeed: 0,       // How quickly they tend to respond
    continuationPatterns: [], // How they continue conversations
    topicShiftPatterns: [],  // How they change topics
    engagementStyle: '',     // Question-asking, storytelling, brief replies, etc.
  },
  
  // Contextual adaptations - how style changes based on context
  contextualAdaptations: {
    formalContexts: {},     // Style in formal situations
    casualContexts: {},     // Style in casual situations
    emotionalContexts: {},  // Style when expressing emotions
    professionalContexts: {}, // Style in professional contexts
  },
  
  // Emotional expression patterns
  emotionalPatterns: {
    expressionFrequency: 0,  // How often emotions are expressed
    emotionalVocabulary: [], // Words used to express feelings
    intensityPatterns: 0,    // Tendency toward mild vs. strong expressions
    specificEmotions: {
      joy: 0,
      sadness: 0,
      anger: 0,
      fear: 0,
      surprise: 0,
      contentment: 0,
      excitement: 0,
      gratitude: 0,
    },
  },
  
  // Personal background information
  personalContext: {
    name: '',
    interests: [],
    occupation: '',
    relationships: [],
    significantExperiences: [],
    knowledgeDomains: [],
  },
};

// Text samples for learning from
let learningSamples = [];

// Identity evolution data to track changes in style over time
let identityEvolution = [];

/**
 * Initialize the identity profiler with basic information
 * @param {Object} userData - Basic user data from onboarding
 */
export const initializeIdentityProfiler = (userData) => {
  // Set name and basic information
  identityMatrix.personalContext.name = userData.name;
  
  if (userData.interests) {
    identityMatrix.personalContext.interests = userData.interests;
  }
  
  if (userData.occupation) {
    identityMatrix.personalContext.occupation = userData.occupation;
  }
  
  if (userData.communicationPreferences) {
    // Map communication preferences to our matrix
    if (userData.communicationPreferences.formal) {
      identityMatrix.communicationPatterns.formality += 2;
    } else if (userData.communicationPreferences.casual) {
      identityMatrix.communicationPatterns.formality -= 2;
    }
    
    if (userData.communicationPreferences.direct) {
      identityMatrix.communicationPatterns.directness += 2;
    } 
    
    if (userData.communicationPreferences.elaborate) {
      identityMatrix.communicationPatterns.expansiveness += 2;
    } else if (userData.communicationPreferences.concise) {
      identityMatrix.communicationPatterns.expansiveness -= 2;
    }
  }
  
  // Process writing samples to establish baseline
  if (userData.writingSamples && userData.writingSamples.length > 0) {
    learningSamples = [...userData.writingSamples];
    
    // Process each sample to extract identity markers
    learningSamples.forEach(sample => {
      analyzeSample(sample, 1); // Weight of 1 for initial samples
    });
  }
  
  // Initialize identity evolution tracking
  identityEvolution.push({
    timestamp: Date.now(),
    snapshot: JSON.parse(JSON.stringify(identityMatrix)),
    source: 'initialization'
  });
  
  // Save the profile data
  saveIdentityProfile();
  
  return identityMatrix;
};

/**
 * Analyze a text sample to extract identity markers
 * @param {string} text - Text sample to analyze
 * @param {number} weight - How much weight to give this sample (1 is normal)
 */
export const analyzeSample = (text, weight = 1) => {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return;
  }
  
  // Add to learning samples
  learningSamples.push(text);
  
  // Keep samples at a reasonable number
  if (learningSamples.length > 100) {
    learningSamples.shift();
  }
  
  // Break into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  // Analyze sentence length distribution
  sentences.forEach(sentence => {
    const wordCount = sentence.split(/\\s+/).length;
    identityMatrix.linguisticSignatures.sentenceLength.push(wordCount);
    
    // Keep the distribution manageable
    if (identityMatrix.linguisticSignatures.sentenceLength.length > 100) {
      identityMatrix.linguisticSignatures.sentenceLength.shift();
    }
    
    // Analyze complexity and formality indicators
    analyzeComplexity(sentence, weight);
  });
  
  // Analyze word usage
  const words = text.match(/\\b\\w+\\b/g) || [];
  analyzeVocabulary(words, weight);
  
  // Analyze emotional content
  analyzeEmotionalContent(text, weight);
  
  // Extract unique phrases and expressions
  extractUniqueExpressions(text, weight);
  
  // Analyze punctuation patterns
  analyzePunctuation(text, weight);
  
  // If this is significant new data, record the evolution
  if (weight >= 1) {
    identityEvolution.push({
      timestamp: Date.now(),
      snapshot: JSON.parse(JSON.stringify(identityMatrix)),
      source: 'text analysis',
      samplePreview: text.substring(0, 50) + (text.length > 50 ? '...' : '')
    });
    
    // Keep evolution history manageable
    if (identityEvolution.length > 20) {
      identityEvolution.shift();
    }
  }
  
  // Save updated profile
  saveIdentityProfile();
};

/**
 * Analyze the complexity and formality of language
 * @param {string} sentence - The sentence to analyze
 * @param {number} weight - Analysis weight factor
 */
const analyzeComplexity = (sentence, weight) => {
  // Check for complex sentence structures
  const hasSubordinate = /although|because|since|while|if|when|after|before|as|whereas|unless/i.test(sentence);
  const hasConjunction = /and|or|but|so|yet|for|nor/i.test(sentence);
  const hasAdverbialMarker = /however|therefore|consequently|furthermore|additionally|nevertheless|thus|hence/i.test(sentence);
  
  // Count words with more than 3 syllables (approximation)
  const words = sentence.match(/\\b\\w+\\b/g) || [];
  let complexWordCount = 0;
  
  words.forEach(word => {
    // Simple syllable approximation
    const syllables = countSyllables(word);
    if (syllables > 2) {
      complexWordCount++;
    }
  });
  
  // Update word complexity measure
  const complexity = complexWordCount / Math.max(words.length, 1);
  identityMatrix.linguisticSignatures.wordComplexity = 
    weightedAverage(
      identityMatrix.linguisticSignatures.wordComplexity, 
      complexity, 
      weight, 
      10 // Assuming an average of 10 previous samples
    );
  
  // Update formality based on sentence structure
  let formalityDelta = 0;
  if (hasSubordinate) formalityDelta += 0.5;
  if (hasAdverbialMarker) formalityDelta += 1;
  if (complexity > 0.2) formalityDelta += 1;
  
  // Weighted update to formality
  identityMatrix.communicationPatterns.formality = 
    weightedAverage(
      identityMatrix.communicationPatterns.formality, 
      identityMatrix.communicationPatterns.formality + formalityDelta, 
      weight, 
      10
    );
  
  // Clamp values to reasonable ranges
  identityMatrix.communicationPatterns.formality = 
    clamp(identityMatrix.communicationPatterns.formality, -5, 5);
};

/**
 * Analyze vocabulary and word usage patterns
 * @param {string[]} words - Array of words from the text
 * @param {number} weight - Analysis weight factor
 */
const analyzeVocabulary = (words, weight) => {
  // Filter out very common words
  const commonWords = new Set([
    'the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
    'by', 'as', 'I', 'you', 'he', 'she', 'it', 'we', 'they', 'is', 'are', 
    'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 
    'did', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 
    'its', 'our', 'their', 'from', 'but', 'or', 'if', 'then', 'else', 'when',
    'just', 'very', 'so', 'about'
  ]);
  
  // Count word frequencies
  words.forEach(word => {
    const lowerWord = word.toLowerCase();
    if (lowerWord.length < 3 || commonWords.has(lowerWord)) {
      return; // Skip common or very short words
    }
    
    if (!identityMatrix.linguisticSignatures.favoriteWords[lowerWord]) {
      identityMatrix.linguisticSignatures.favoriteWords[lowerWord] = weight;
    } else {
      identityMatrix.linguisticSignatures.favoriteWords[lowerWord] += weight;
    }
  });
  
  // Limit to top words
  const sortedWords = Object.entries(identityMatrix.linguisticSignatures.favoriteWords)
    .sort((a, b) => b[1] - a[1]);
  
  if (sortedWords.length > 100) {
    identityMatrix.linguisticSignatures.favoriteWords = 
      Object.fromEntries(sortedWords.slice(0, 100));
  }
  
  // Analyze expansiveness based on vocabulary diversity
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const diversityRatio = uniqueWords.size / words.length;
  
  // Update expansiveness
  identityMatrix.communicationPatterns.expansiveness = 
    weightedAverage(
      identityMatrix.communicationPatterns.expansiveness,
      diversityRatio * 10, // Scale to a 0-10 range
      weight,
      10
    );
  
  // Clamp values
  identityMatrix.communicationPatterns.expansiveness = 
    clamp(identityMatrix.communicationPatterns.expansiveness, -5, 5);
};

/**
 * Extract unique expressions or phrasings that characterize the individual
 * @param {string} text - Text to analyze
 * @param {number} weight - Analysis weight factor
 */
const extractUniqueExpressions = (text, weight) => {
  // Look for phrases that might be unique to the person
  const phrases = [];
  
  // Extract 3-5 word phrases
  const words = text.toLowerCase().split(/\\s+/);
  for (let length = 3; length <= 5; length++) {
    if (words.length >= length) {
      for (let i = 0; i <= words.length - length; i++) {
        const phrase = words.slice(i, i + length).join(' ');
        if (isSignificantPhrase(phrase)) {
          phrases.push(phrase);
        }
      }
    }
  }
  
  // Add to unique expressions if not already present
  phrases.forEach(phrase => {
    if (!identityMatrix.linguisticSignatures.uniqueExpressions.includes(phrase)) {
      identityMatrix.linguisticSignatures.uniqueExpressions.push(phrase);
    }
  });
  
  // Look for transitional phrases
  const transitions = [
    'in other words', 'for example', 'to illustrate', 'in contrast',
    'on the other hand', 'as a result', 'consequently', 'furthermore', 
    'in addition', 'in conclusion', 'to sum up', 'in summary',
    'first', 'second', 'third', 'finally', 'lastly', 'next', 
    'meanwhile', 'subsequently', 'previously', 'then'
  ];
  
  transitions.forEach(transition => {
    if (text.toLowerCase().includes(transition)) {
      if (!identityMatrix.linguisticSignatures.transitionalPhrases.includes(transition)) {
        identityMatrix.linguisticSignatures.transitionalPhrases.push(transition);
      }
    }
  });
  
  // Limit unique expressions to keep relevant ones
  if (identityMatrix.linguisticSignatures.uniqueExpressions.length > 50) {
    identityMatrix.linguisticSignatures.uniqueExpressions = 
      identityMatrix.linguisticSignatures.uniqueExpressions.slice(-50);
  }
  
  // Limit transitional phrases
  if (identityMatrix.linguisticSignatures.transitionalPhrases.length > 20) {
    identityMatrix.linguisticSignatures.transitionalPhrases = 
      identityMatrix.linguisticSignatures.transitionalPhrases.slice(-20);
  }
};

/**
 * Analyze punctuation patterns
 * @param {string} text - Text to analyze
 * @param {number} weight - Analysis weight factor
 */
const analyzePunctuation = (text, weight) => {
  // Count different types of punctuation
  const punctuation = {
    '!': (text.match(/!/g) || []).length,
    '?': (text.match(/\\?/g) || []).length,
    '...': (text.match(/\\.\\.\\.(?!\\.)|\\.{3}(?!\\.)|\\.\\.\\.(?!\\.)(?=\\s|$)/g) || []).length,
    ',': (text.match(/,/g) || []).length,
    ';': (text.match(/;/g) || []).length,
    ':': (text.match(/:/g) || []).length,
    '-': (text.match(/-/g) || []).length,
    '()': (text.match(/\\(/g) || []).length, // Count opening parentheses
    '"': (text.match(/"|"/g) || []).length,
    "'": (text.match(/'/g) || []).length
  };
  
  // Update punctuation frequency
  Object.keys(punctuation).forEach(mark => {
    if (punctuation[mark] > 0) {
      if (!identityMatrix.linguisticSignatures.punctuationFrequency[mark]) {
        identityMatrix.linguisticSignatures.punctuationFrequency[mark] = punctuation[mark] * weight;
      } else {
        identityMatrix.linguisticSignatures.punctuationFrequency[mark] += punctuation[mark] * weight;
      }
    }
  });
  
  // Analyze what the punctuation tells us about personality
  // High exclamation usage suggests extraversion
  if (punctuation['!'] > 0) {
    const exclamationRate = punctuation['!'] / (text.length / 100); // Per 100 chars
    identityMatrix.personalityMarkers.extraversion = 
      weightedAverage(
        identityMatrix.personalityMarkers.extraversion,
        identityMatrix.personalityMarkers.extraversion + (exclamationRate * 0.5),
        weight,
        10
      );
  }
  
  // High question mark usage could relate to openness/curiosity
  if (punctuation['?'] > 0) {
    const questionRate = punctuation['?'] / (text.length / 100); 
    identityMatrix.personalityMarkers.openness = 
      weightedAverage(
        identityMatrix.personalityMarkers.openness,
        identityMatrix.personalityMarkers.openness + (questionRate * 0.5),
        weight,
        10
      );
  }
  
  // Clamp values
  identityMatrix.personalityMarkers.extraversion = 
    clamp(identityMatrix.personalityMarkers.extraversion, -5, 5);
  identityMatrix.personalityMarkers.openness = 
    clamp(identityMatrix.personalityMarkers.openness, -5, 5);
};

/**
 * Analyze emotional content of text
 * @param {string} text - Text to analyze
 * @param {number} weight - Analysis weight factor
 */
const analyzeEmotionalContent = (text, weight) => {
  const lowerText = text.toLowerCase();
  
  // Simple emotion word mapping
  const emotionWords = {
    joy: ['happy', 'joy', 'delighted', 'glad', 'pleased', 'excited', 'thrilled', 'enjoy', 'wonderful', 'love', 'like'],
    sadness: ['sad', 'unhappy', 'disappointed', 'miserable', 'heartbroken', 'depressed', 'blue', 'down', 'sorry'],
    anger: ['angry', 'mad', 'furious', 'outraged', 'annoyed', 'irritated', 'frustrated', 'hate', 'resent'],
    fear: ['afraid', 'scared', 'frightened', 'terrified', 'anxious', 'worried', 'concerned', 'nervous'],
    surprise: ['surprised', 'amazed', 'astonished', 'shocked', 'startled', 'unexpected', 'wow'],
    contentment: ['content', 'satisfied', 'peaceful', 'calm', 'relaxed', 'serene', 'comfortable'],
    excitement: ['excited', 'thrilled', 'eager', 'enthusiastic', 'pumped', 'stoked', 'energized'],
    gratitude: ['grateful', 'thankful', 'appreciative', 'blessed', 'appreciate', 'thanks', 'thank']
  };
  
  // Count emotion words
  let emotionWordCount = 0;
  const emotionCounts = {};
  
  Object.keys(emotionWords).forEach(emotion => {
    let count = 0;
    emotionWords[emotion].forEach(word => {
      // Match whole words only
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      const matches = lowerText.match(regex);
      if (matches) {
        count += matches.length;
        emotionWordCount += matches.length;
      }
    });
    
    // Only update if emotions were detected
    if (count > 0) {
      emotionCounts[emotion] = count;
      
      // Update the emotional patterns
      identityMatrix.emotionalPatterns.specificEmotions[emotion] = 
        weightedAverage(
          identityMatrix.emotionalPatterns.specificEmotions[emotion],
          identityMatrix.emotionalPatterns.specificEmotions[emotion] + (count * 0.5),
          weight,
          5
        );
      
      // Clamp values
      identityMatrix.emotionalPatterns.specificEmotions[emotion] = 
        clamp(identityMatrix.emotionalPatterns.specificEmotions[emotion], 0, 10);
    }
  });
  
  // Update emotional expression frequency
  const emotionRate = emotionWordCount / (text.length / 100); // per 100 chars
  identityMatrix.emotionalPatterns.expressionFrequency = 
    weightedAverage(
      identityMatrix.emotionalPatterns.expressionFrequency,
      emotionRate * 5, // Scale to 0-10 range
      weight,
      10
    );
  
  // Clamp value
  identityMatrix.emotionalPatterns.expressionFrequency = 
    clamp(identityMatrix.emotionalPatterns.expressionFrequency, 0, 10);
  
  // Add emotion words to vocabulary
  Object.keys(emotionCounts).forEach(emotion => {
    // Find which specific words were used
    emotionWords[emotion].forEach(word => {
      if (lowerText.includes(word) && 
          !identityMatrix.emotionalPatterns.emotionalVocabulary.includes(word)) {
        identityMatrix.emotionalPatterns.emotionalVocabulary.push(word);
      }
    });
  });
  
  // Limit emotional vocabulary size
  if (identityMatrix.emotionalPatterns.emotionalVocabulary.length > 50) {
    identityMatrix.emotionalPatterns.emotionalVocabulary = 
      identityMatrix.emotionalPatterns.emotionalVocabulary.slice(-50);
  }
  
  // Check for emotional intensity markers
  const intensifiers = ['very', 'extremely', 'incredibly', 'absolutely', 'completely', 'deeply'];
  let intensifierCount = 0;
  
  intensifiers.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = lowerText.match(regex);
    if (matches) {
      intensifierCount += matches.length;
    }
  });
  
  if (intensifierCount > 0) {
    // Update intensity patterns
    identityMatrix.emotionalPatterns.intensityPatterns = 
      weightedAverage(
        identityMatrix.emotionalPatterns.intensityPatterns,
        identityMatrix.emotionalPatterns.intensityPatterns + (intensifierCount * 0.5),
        weight,
        10
      );
    
    // Clamp value
    identityMatrix.emotionalPatterns.intensityPatterns = 
      clamp(identityMatrix.emotionalPatterns.intensityPatterns, 0, 10);
  }
};

/**
 * Update the personal context with background information
 * @param {Object} context - New personal context information
 */
export const updatePersonalContext = (context) => {
  if (!context) return;
  
  // Update each provided field
  if (context.interests && Array.isArray(context.interests)) {
    identityMatrix.personalContext.interests = context.interests;
  }
  
  if (context.occupation) {
    identityMatrix.personalContext.occupation = context.occupation;
  }
  
  if (context.relationships && Array.isArray(context.relationships)) {
    identityMatrix.personalContext.relationships = context.relationships;
  }
  
  if (context.significantExperiences && Array.isArray(context.significantExperiences)) {
    identityMatrix.personalContext.significantExperiences = context.significantExperiences;
  }
  
  if (context.knowledgeDomains && Array.isArray(context.knowledgeDomains)) {
    identityMatrix.personalContext.knowledgeDomains = context.knowledgeDomains;
  }
  
  // Save the updated profile
  saveIdentityProfile();
};

/**
 * Generate text that mirrors the identified personality and communication style
 * @param {string} baseText - Starting text or template
 * @param {Object} options - Generation options
 * @returns {string} - Text mirroring the person's style
 */
export const generateMirroredText = (baseText, options = {}) => {
  if (!baseText) return '';

  let result = baseText;
  
  // Apply communication style patterns
  result = applyDirectnessStyle(result);
  result = applyFormalityStyle(result);
  result = applyExpansivenessStyle(result);
  result = applyEmotionalStyle(result);
  
  // Add personal phrases if appropriate
  result = addPersonalTouches(result);
  
  // Add personal context references if requested
  if (options.includePersonalReferences) {
    result = addPersonalContextReferences(result);
  }
  
  return result;
};

/**
 * Apply directness style to text
 * @param {string} text - Text to modify
 * @returns {string} - Modified text
 */
const applyDirectnessStyle = (text) => {
  const directness = identityMatrix.communicationPatterns.directness;
  
  // More direct style
  if (directness > 3) {
    // Remove hedging language
    text = text.replace(/I think|Perhaps|Maybe|Possibly|It seems like|sort of|kind of/gi, '');
    
    // Make statements more direct
    text = text.replace(/I believe that /gi, '');
    text = text.replace(/In my opinion, /gi, '');
    
    // Add direct phrases for strong directness
    if (directness > 4 && Math.random() < 0.3) {
      if (!text.includes('Look,') && !text.includes('listen')) {
        text = 'Look, ' + text.charAt(0).toLowerCase() + text.slice(1);
      }
    }
  }
  // More indirect style
  else if (directness < -3) {
    // Add hedging language where it doesn't exist
    if (!text.match(/I think|Perhaps|Maybe|Possibly|It seems like|sort of|kind of/gi)) {
      const hedges = ['I think ', 'Perhaps ', 'It seems like ', 'Maybe '];
      const hedge = hedges[Math.floor(Math.random() * hedges.length)];
      text = hedge + text.charAt(0).toLowerCase() + text.slice(1);
    }
    
    // Soften direct statements
    text = text.replace(/\b(is|are|will|must)\b/gi, (match) => {
      if (Math.random() < 0.5) {
        const softeners = {
          'is': 'might be',
          'are': 'might be',
          'will': 'might',
          'must': 'probably should'
        };
        return softeners[match.toLowerCase()] || match;
      }
      return match;
    });
  }
  
  return text;
};

/**
 * Apply formality style to text
 * @param {string} text - Text to modify
 * @returns {string} - Modified text
 */
const applyFormalityStyle = (text) => {
  const formality = identityMatrix.communicationPatterns.formality;
  
  // More formal style
  if (formality > 3) {
    // Replace contractions
    text = text.replace(/don't/g, 'do not')
               .replace(/can't/g, 'cannot')
               .replace(/won't/g, 'will not')
               .replace(/it's/g, 'it is')
               .replace(/that's/g, 'that is')
               .replace(/there's/g, 'there is')
               .replace(/I'm/g, 'I am')
               .replace(/you're/g, 'you are')
               .replace(/they're/g, 'they are')
               .replace(/we're/g, 'we are')
               .replace(/isn't/g, 'is not')
               .replace(/aren't/g, 'are not')
               .replace(/wasn't/g, 'was not')
               .replace(/weren't/g, 'were not');
    
    // Replace casual phrases
    text = text.replace(/\bthanks\b/gi, 'thank you')
               .replace(/\byeah\b/gi, 'yes')
               .replace(/\bnah\b/gi, 'no')
               .replace(/\bgonna\b/gi, 'going to')
               .replace(/\bwanna\b/gi, 'want to')
               .replace(/\bgotta\b/gi, 'have to');
  }
  // More casual style
  else if (formality < -3) {
    // Create contractions
    text = text.replace(/do not/g, "don't")
               .replace(/cannot/g, "can't")
               .replace(/will not/g, "won't")
               .replace(/it is/g, "it's")
               .replace(/that is/g, "that's")
               .replace(/there is/g, "there's")
               .replace(/I am/g, "I'm")
               .replace(/you are/g, "you're")
               .replace(/they are/g, "they're")
               .replace(/we are/g, "we're")
               .replace(/is not/g, "isn't")
               .replace(/are not/g, "aren't")
               .replace(/was not/g, "wasn't")
               .replace(/were not/g, "weren't");
    
    // Replace formal phrases
    text = text.replace(/\bthank you\b/gi, 'thanks')
               .replace(/\byes\b/gi, 'yeah')
               .replace(/\bgoing to\b/gi, 'gonna')
               .replace(/\bwant to\b/gi, 'wanna')
               .replace(/\bhave to\b/gi, 'gotta');
    
    // Add casual phrases occasionally
    if (Math.random() < 0.3) {
      const casualPhrases = ['you know', 'like', 'honestly', 'basically', 'actually'];
      const casualPhrase = casualPhrases[Math.floor(Math.random() * casualPhrases.length)];
      
      // Insert at a reasonable position
      const sentences = text.split('.');
      if (sentences.length > 1) {
        const insertPoint = Math.floor(Math.random() * sentences.length);
        const words = sentences[insertPoint].split(' ');
        if (words.length > 3) {
          const wordPosition = Math.floor(Math.random() * (words.length - 2)) + 1;
          words.splice(wordPosition, 0, casualPhrase);
          sentences[insertPoint] = words.join(' ');
          text = sentences.join('.');
        }
      }
    }
  }
  
  return text;
};

/**
 * Apply expansiveness style to text (verbose vs concise)
 * @param {string} text - Text to modify
 * @returns {string} - Modified text
 */
const applyExpansivenessStyle = (text) => {
  const expansiveness = identityMatrix.communicationPatterns.expansiveness;
  
  // More verbose style
  if (expansiveness > 3) {
    // Add descriptive adjectives
    text = text.replace(/\b(good|bad|nice|interesting)\b/gi, (match) => {
      const expansions = {
        'good': ['excellent', 'remarkable', 'outstanding', 'wonderful'],
        'bad': ['terrible', 'unfortunate', 'disappointing', 'unpleasant'],
        'nice': ['delightful', 'pleasant', 'enjoyable', 'charming'],
        'interesting': ['fascinating', 'intriguing', 'compelling', 'thought-provoking']
      };
      
      const options = expansions[match.toLowerCase()] || [match];
      return options[Math.floor(Math.random() * options.length)];
    });
    
    // Add transitional phrases if missing
    if (identityMatrix.linguisticSignatures.transitionalPhrases.length > 0 &&
        text.includes('.') && 
        !text.match(/however|therefore|consequently|furthermore|additionally/i)) {
      
      const transitions = identityMatrix.linguisticSignatures.transitionalPhrases.length > 0 
        ? identityMatrix.linguisticSignatures.transitionalPhrases 
        : ['Furthermore', 'Additionally', 'Moreover', 'In addition'];
      
      const transition = transitions[Math.floor(Math.random() * transitions.length)];
      
      // Insert at a sentence break
      const sentences = text.split('.');
      if (sentences.length > 1) {
        const insertPoint = Math.floor(Math.random() * (sentences.length - 1)) + 1;
        sentences[insertPoint] = ' ' + transition + ',' + sentences[insertPoint];
        text = sentences.join('.');
      }
    }
  }
  // More concise style
  else if (expansiveness < -3) {
    // Remove filler words and phrases
    text = text.replace(/\b(very|really|quite|extremely|absolutely|basically|actually|essentially)\b\s/gi, '');
    
    // Simplify longer phrases
    text = text.replace(/in order to/gi, 'to')
               .replace(/due to the fact that/gi, 'because')
               .replace(/at this point in time/gi, 'now')
               .replace(/in the event that/gi, 'if')
               .replace(/on the grounds that/gi, 'because')
               .replace(/in light of the fact that/gi, 'because');
    
    // Shorten sentences by removing some clauses
    text = text.replace(/,\s*which\s+[^.,]+/gi, '');
  }
  
  return text;
};

/**
 * Apply emotional style to text
 * @param {string} text - Text to modify
 * @returns {string} - Modified text
 */
const applyEmotionalStyle = (text) => {
  const emotionalFrequency = identityMatrix.emotionalPatterns.expressionFrequency;
  const emotionalIntensity = identityMatrix.emotionalPatterns.intensityPatterns;
  
  // Skip if very neutral emotional expression patterns
  if (emotionalFrequency < 1) return text;
  
  // Get dominant emotions
  const emotionEntries = Object.entries(identityMatrix.emotionalPatterns.specificEmotions);
  const dominantEmotions = emotionEntries
    .filter(([_, value]) => value > 3)
    .sort((a, b) => b[1] - a[1])
    .map(([emotion]) => emotion);
  
  // Add emotional markers based on dominant emotions if any
  if (dominantEmotions.length > 0) {
    // Get appropriate emotional words based on dominant emotions
    const topEmotion = dominantEmotions[0];
    
    // Emotional word mapping for expressions
    const emotionalExpressions = {
      joy: ['happy', 'delighted', 'glad', 'pleased', 'excited', 'thrilled', 'love'],
      sadness: ['sad', 'unhappy', 'disappointed', 'unfortunate', 'regrettable'],
      anger: ['frustrated', 'annoyed', 'irritated', 'bothered'],
      fear: ['concerned', 'worried', 'anxious', 'nervous'],
      surprise: ['surprising', 'unexpected', 'astonishing', 'remarkable'],
      contentment: ['satisfying', 'peaceful', 'calming', 'pleasant'],
      excitement: ['exciting', 'thrilling', 'energizing', 'stimulating'],
      gratitude: ['grateful', 'thankful', 'appreciative', 'appreciative']
    };
    
    // If we have vocabulary for the emotion, use it
    const emotionalVocabulary = identityMatrix.emotionalPatterns.emotionalVocabulary;
    const emotionWords = emotionalVocabulary.length > 0 
      ? emotionalVocabulary.filter(word => 
          emotionalExpressions[topEmotion] && 
          emotionalExpressions[topEmotion].includes(word)
        )
      : (emotionalExpressions[topEmotion] || []);
    
    // Only modify if we have appropriate emotional words
    if (emotionWords.length > 0 && Math.random() < 0.4) {
      const emotionWord = emotionWords[Math.floor(Math.random() * emotionWords.length)];
      
      // If high intensity, add intensifiers
      let emotionalPhrase = emotionWord;
      if (emotionalIntensity > 7) {
        const intensifiers = ['very', 'extremely', 'incredibly', 'so', 'absolutely'];
        const intensifier = intensifiers[Math.floor(Math.random() * intensifiers.length)];
        emotionalPhrase = intensifier + ' ' + emotionalPhrase;
      }
      
      // Add the emotional marker to the text
      if (text.includes('.')) {
        // Add to a random sentence
        const sentences = text.split('.');
        if (sentences.length > 1) {
          const insertPoint = Math.floor(Math.random() * (sentences.length - 1));
          
          // Different insertion patterns
          const patterns = [
            `. I'm ${emotionalPhrase} that`,
            `. It's ${emotionalPhrase} to see that`,
            `. I feel ${emotionalPhrase} about this,`
          ];
          
          const pattern = patterns[Math.floor(Math.random() * patterns.length)];
          sentences[insertPoint] += pattern;
          text = sentences.join('.');
        }
      } else {
        // Add to the beginning if no sentences to split
        text = `I'm ${emotionalPhrase} about this. ${text}`;
      }
    }
    
    // For high emotional expression, add appropriate punctuation
    if (emotionalFrequency > 7 && emotionalIntensity > 5) {
      // Add exclamation points for high joy, excitement, surprise, or anger
      if (['joy', 'excitement', 'surprise', 'anger'].includes(topEmotion)) {
        text = text.replace(/\.\s*([A-Z])/g, '! $1');
      }
    }
  }
  
  return text;
};

/**
 * Add personal touches like favorite phrases and expressions
 * @param {string} text - Text to modify
 * @returns {string} - Modified text with personal touches
 */
const addPersonalTouches = (text) => {
  const uniqueExpressions = identityMatrix.linguisticSignatures.uniqueExpressions;
  
  // Skip if we don't have personal expressions
  if (!uniqueExpressions || uniqueExpressions.length === 0) return text;
  
  // Only add personal expressions occasionally (30% chance)
  if (Math.random() < 0.3) {
    const expression = uniqueExpressions[Math.floor(Math.random() * uniqueExpressions.length)];
    
    // Avoid duplicate expressions
    if (!text.toLowerCase().includes(expression)) {
      // Different ways to add expressions
      if (text.includes('.')) {
        // Add to a random sentence
        const sentences = text.split('.');
        if (sentences.length > 1) {
          const insertPoint = Math.floor(Math.random() * sentences.length);
          
          // Add to beginning, middle, or end
          const position = Math.floor(Math.random() * 3);
          
          if (position === 0 && sentences[insertPoint].trim().length > 0) {
            // Beginning of sentence
            sentences[insertPoint] = ` ${expression.charAt(0).toUpperCase() + expression.slice(1)}, ${sentences[insertPoint].trim()}`;
          } else if (position === 1 && sentences[insertPoint].trim().length > 0) {
            // Middle of sentence - find a reasonable spot
            const words = sentences[insertPoint].trim().split(' ');
            if (words.length > 3) {
              const splitPoint = Math.floor(words.length / 2);
              words.splice(splitPoint, 0, `, ${expression},`);
              sentences[insertPoint] = ' ' + words.join(' ');
            }
          } else {
            // End of sentence
            sentences[insertPoint] = sentences[insertPoint].trim() + ` ${expression}`;
          }
          
          text = sentences.join('.');
        }
      } else {
        // Just append if no sentence structure
        text = `${text} ${expression}`;
      }
    }
  }
  
  // Match punctuation style if we have that data
  if (Object.keys(identityMatrix.linguisticSignatures.punctuationFrequency).length > 0) {
    // Find favored punctuation
    const punctuations = Object.entries(identityMatrix.linguisticSignatures.punctuationFrequency)
      .sort((a, b) => b[1] - a[1]);
    
    if (punctuations.length > 0) {
      const favoritePunctuation = punctuations[0][0];
      
      // Apply punctuation style based on preference
      if (favoritePunctuation === '!' && !text.includes('!')) {
        // Add exclamation point to emphasize
        text = text.replace(/\./g, (match, index) => {
          // Random chance to replace periods, more likely near the end
          return Math.random() < 0.3 ? '!' : match;
        });
      } else if (favoritePunctuation === '...' && !text.includes('...')) {
        // Add ellipses for thoughtful pauses
        text = text.replace(/\./g, (match, index) => {
          // Random chance to replace periods, not too often
          return Math.random() < 0.2 ? '...' : match;
        });
      }
    }
  }
  
  return text;
};

/**
 * Add personal context references to text
 * @param {string} text - Text to modify
 * @returns {string} - Modified text with personal context references
 */
const addPersonalContextReferences = (text) => {
  const context = identityMatrix.personalContext;
  
  // Skip if insufficient personal context
  if (!context.interests || context.interests.length === 0) return text;
  
  // Add reference to personal context occasionally
  if (Math.random() < 0.2) {
    // Select something to reference
    let referenceOptions = [];
    
    // Add interests
    if (context.interests && context.interests.length > 0) {
      referenceOptions.push(`As someone interested in ${context.interests[Math.floor(Math.random() * context.interests.length)]}`);
    }
    
    // Add occupation
    if (context.occupation) {
      referenceOptions.push(`From my perspective in ${context.occupation}`);
    }
    
    // Add experience
    if (context.significantExperiences && context.significantExperiences.length > 0) {
      referenceOptions.push(`Having experienced ${context.significantExperiences[Math.floor(Math.random() * context.significantExperiences.length)]}`);
    }
    
    // Add if we have options
    if (referenceOptions.length > 0) {
      const reference = referenceOptions[Math.floor(Math.random() * referenceOptions.length)];
      
      // Add to beginning of text
      text = `${reference}, ${text.charAt(0).toLowerCase() + text.slice(1)}`;
    }
  }
  
  return text;
};

/**
 * Check if a phrase is significant enough to track
 * @param {string} phrase - Phrase to evaluate
 * @returns {boolean} - Whether the phrase is significant
 */
const isSignificantPhrase = (phrase) => {
  // Skip phrases with too many common words
  const commonWords = ['the', 'and', 'for', 'with', 'that', 'have', 'this', 'will', 'your', 'from'];
  const phraseWords = phrase.split(' ');
  
  let commonWordCount = 0;
  phraseWords.forEach(word => {
    if (commonWords.includes(word)) {
      commonWordCount++;
    }
  });
  
  // If more than half the phrase is common words, skip it
  if (commonWordCount >= phraseWords.length / 2) {
    return false;
  }
  
  return true;
};

/**
 * Count syllables in a word (approximation)
 * @param {string} word - Word to count syllables in
 * @returns {number} - Approximate syllable count
 */
const countSyllables = (word) => {
  word = word.toLowerCase();
  
  // Special cases
  if (word.length <= 3) return 1;
  
  // Remove ending e
  word = word.replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, '');
  
  // Remove y preceded by consonant
  word = word.replace(/^y/, '');
  
  // Count vowel groups
  return word.match(/[aeiouy]{1,2}/g)?.length || 1;
};

/**
 * Calculate weighted average for smoother transitions
 * @param {number} oldValue - Previous value
 * @param {number} newValue - New value to incorporate
 * @param {number} weight - Weight of new value
 * @param {number} totalWeight - Total weight (old + new)
 * @returns {number} - Weighted average
 */
const weightedAverage = (oldValue, newValue, weight, totalWeight) => {
  return ((oldValue * (totalWeight - weight)) + (newValue * weight)) / totalWeight;
};

/**
 * Clamp value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} - Clamped value
 */
const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Save the identity profile to localStorage
 */
const saveIdentityProfile = () => {
  try {
    localStorage.setItem('echoTwinIdentityMatrix', JSON.stringify(identityMatrix));
    localStorage.setItem('echoTwinIdentityEvolution', JSON.stringify(identityEvolution));
    localStorage.setItem('echoTwinLearningSamples', JSON.stringify(learningSamples));
  } catch (error) {
    console.error('Error saving identity profile:', error);
  }
};

/**
 * Load the identity profile from localStorage
 * @returns {boolean} - Whether loading was successful
 */
export const loadIdentityProfile = () => {
  try {
    const savedMatrix = localStorage.getItem('echoTwinIdentityMatrix');
    const savedEvolution = localStorage.getItem('echoTwinIdentityEvolution');
    const savedSamples = localStorage.getItem('echoTwinLearningSamples');
    
    if (savedMatrix) {
      Object.assign(identityMatrix, JSON.parse(savedMatrix));
    }
    
    if (savedEvolution) {
      identityEvolution = JSON.parse(savedEvolution);
    }
    
    if (savedSamples) {
      learningSamples = JSON.parse(savedSamples);
    }
    
    return !!savedMatrix;
  } catch (error) {
    console.error('Error loading identity profile:', error);
    return false;
  }
};

/**
 * Get the current identity profile
 * @returns {Object} - Full identity matrix
 */
export const getIdentityProfile = () => {
  return identityMatrix;
};

/**
 * Get the evolution history of the identity
 * @returns {Array} - Identity evolution snapshots
 */
export const getIdentityEvolution = () => {
  return identityEvolution;
};

/**
 * Reset the identity profile
 */
export const resetIdentityProfile = () => {
  // Reset identity matrix (keep structure but zero out values)
  Object.keys(identityMatrix.personalityMarkers).forEach(key => {
    identityMatrix.personalityMarkers[key] = 0;
  });
  
  Object.keys(identityMatrix.communicationPatterns).forEach(key => {
    identityMatrix.communicationPatterns[key] = 0;
  });
  
  identityMatrix.linguisticSignatures.sentenceLength = [];
  identityMatrix.linguisticSignatures.wordComplexity = 0;
  identityMatrix.linguisticSignatures.punctuationFrequency = {};
  identityMatrix.linguisticSignatures.favoriteWords = {};
  identityMatrix.linguisticSignatures.transitionalPhrases = [];
  identityMatrix.linguisticSignatures.uniqueExpressions = [];
  
  identityMatrix.conversationalDynamics.responseSpeed = 0;
  identityMatrix.conversationalDynamics.continuationPatterns = [];
  identityMatrix.conversationalDynamics.topicShiftPatterns = [];
  identityMatrix.conversationalDynamics.engagementStyle = '';
  
  Object.keys(identityMatrix.emotionalPatterns.specificEmotions).forEach(key => {
    identityMatrix.emotionalPatterns.specificEmotions[key] = 0;
  });
  
  identityMatrix.emotionalPatterns.expressionFrequency = 0;
  identityMatrix.emotionalPatterns.emotionalVocabulary = [];
  identityMatrix.emotionalPatterns.intensityPatterns = 0;
  
  // Reset learning samples and evolution history
  learningSamples = [];
  identityEvolution = [{
    timestamp: Date.now(),
    snapshot: JSON.parse(JSON.stringify(identityMatrix)),
    source: 'reset'
  }];
  
  // Clear stored data
  localStorage.removeItem('echoTwinIdentityMatrix');
  localStorage.removeItem('echoTwinIdentityEvolution');
  localStorage.removeItem('echoTwinLearningSamples');
};

// Export default interface
export default {
  initializeIdentityProfiler,
  analyzeSample,
  updatePersonalContext,
  generateMirroredText,
  getIdentityProfile,
  getIdentityEvolution,
  loadIdentityProfile,
  saveIdentityProfile,
  resetIdentityProfile
};