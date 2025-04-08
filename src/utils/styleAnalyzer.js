/**
 * Style Analyzer for Echo Twin
 * Learns and models the user's communication style
 */

// Core style profile structure
let styleProfile = {
  sentenceStructure: {
    averageLength: 0,
    complexSentences: 0,
    fragmentUsage: 0,
    questionFrequency: 0,
  },
  vocabularyProfile: {
    complexity: 0,
    diversity: 0,
    favoriteWords: {},
    synonymPreferences: {}
  },
  punctuationStyle: {
    exclamationFrequency: 0,
    commaFrequency: 0,
    ellipsisUsage: 0,
    semicolonUsage: 0,
    parenthesesUsage: 0,
    dashUsage: 0,
  },
  emojiStyle: {
    frequency: 0,
    positive: [],
    negative: [],
    neutral: [],
    favorites: []
  },
  phrasesAndExpressions: {
    greetings: [],
    farewells: [],
    transitions: [],
    expressions: []
  },
  behavioralPatterns: {
    formality: 0,
    directness: 0,
    verbosity: 0,
    emotionalExpression: 0,
    politeness: 0,
    humor: 0,
  },
  emotionalSignature: {
    joy: { frequency: 0, expressions: [] },
    sadness: { frequency: 0, expressions: [] },
    anger: { frequency: 0, expressions: [] },
    surprise: { frequency: 0, expressions: [] },
    interest: { frequency: 0, expressions: [] },
    confusion: { frequency: 0, expressions: [] }
  }
};

// Track analyzed samples
let analyzedSamples = [];

/**
 * Initialize the style analyzer with user data
 * @param {Object} userData - Data collected during onboarding
 */
export const initializeStyleAnalyzer = (userData) => {
  // Reset to defaults
  resetStyleProfile();
  
  // Apply initial user preferences
  if (userData && userData.communicationPreferences) {
    if (userData.communicationPreferences.formal) {
      styleProfile.behavioralPatterns.formality = 5;
    } else if (userData.communicationPreferences.casual) {
      styleProfile.behavioralPatterns.formality = -5;
    }
    
    if (userData.communicationPreferences.direct) {
      styleProfile.behavioralPatterns.directness = 5;
    } else if (userData.communicationPreferences.indirect) {
      styleProfile.behavioralPatterns.directness = -5;
    }
    
    if (userData.communicationPreferences.verbose) {
      styleProfile.behavioralPatterns.verbosity = 5;
    } else if (userData.communicationPreferences.concise) {
      styleProfile.behavioralPatterns.verbosity = -5;
    }
    
    if (userData.communicationPreferences.emotional) {
      styleProfile.behavioralPatterns.emotionalExpression = 5;
    }
  }
  
  // Process writing samples if available
  if (userData && userData.writingSamples && userData.writingSamples.length > 0) {
    userData.writingSamples.forEach(sample => {
      analyzeText(sample, true);
    });
  }
  
  // Save initial profile
  saveStyleProfile();
  
  return styleProfile;
};

/**
 * Analyze text to extract style characteristics
 * @param {string} text - Text to analyze
 * @param {boolean} isInitial - Whether this is initial training or ongoing learning
 */
export const analyzeText = (text, isInitial = false) => {
  if (!text || typeof text !== 'string' || text.trim().length === 0) return;
  
  // Add to analyzed samples
  analyzedSamples.push({
    text: text.substring(0, 100), // Store preview only
    timestamp: Date.now()
  });
  
  // Keep samples collection at reasonable size
  if (analyzedSamples.length > 20) {
    analyzedSamples.shift();
  }
  
  // Break into sentences for analysis
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  
  // Update sentence structure measurements
  if (sentences.length > 0) {
    // Calculate average sentence length
    let totalWords = 0;
    sentences.forEach(sentence => {
      const words = sentence.match(/\b\w+\b/g) || [];
      totalWords += words.length;
      
      analyzeSentenceStructure(sentence);
    });
    
    const averageLength = totalWords / sentences.length;
    styleProfile.sentenceStructure.averageLength = 
      isInitial ? averageLength : (styleProfile.sentenceStructure.averageLength * 0.7) + (averageLength * 0.3);
  }
  
  // Extract all words for vocabulary analysis
  const words = text.match(/\b\w+\b/g) || [];
  analyzeVocabulary(words);
  
  // Analyze punctuation usage
  analyzePunctuation(text);
  
  // Analyze emoji usage 
  analyzeEmoji(text);
  
  // Extract phrases
  extractPhrases(text);
  
  // Analyze formality and other behavioral patterns
  analyzeFormality(text);
  
  // Save updated profile
  saveStyleProfile();
};

/**
 * Analyze sentence structure
 * @param {string} sentence - Single sentence to analyze
 */
const analyzeSentenceStructure = (sentence) => {
  // Detect question frequency
  if (sentence.trim().endsWith('?')) {
    styleProfile.sentenceStructure.questionFrequency = 
      (styleProfile.sentenceStructure.questionFrequency * 0.9) + 0.1;
  }
  
  // Check for complex sentence structures (with conjunctions, etc.)
  if (/\b(although|because|since|while|if|when|whereas|unless|therefore|however|nevertheless)\b/i.test(sentence)) {
    styleProfile.sentenceStructure.complexSentences = 
      (styleProfile.sentenceStructure.complexSentences * 0.9) + 0.1;
  }
  
  // Look for sentence fragments
  const words = sentence.match(/\b\w+\b/g) || [];
  if (words.length < 4 && !/\b(is|are|was|were|have|has|had|will|shall|should|would|could|can)\b/i.test(sentence)) {
    styleProfile.sentenceStructure.fragmentUsage = 
      (styleProfile.sentenceStructure.fragmentUsage * 0.9) + 0.1;
  }
};

/**
 * Analyze word preferences and vocabulary
 * @param {Array<string>} words - Array of words from the text
 */
const analyzeVocabulary = (words) => {
  if (words.length === 0) return;
  
  // Calculate vocabulary diversity (unique words / total words)
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const diversity = uniqueWords.size / words.length;
  
  styleProfile.vocabularyProfile.diversity = 
    (styleProfile.vocabularyProfile.diversity * 0.7) + (diversity * 0.3);
  
  // Count word frequencies (for favorite words)
  const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'I', 
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
    'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
    'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other'
  ]);
  
  words.forEach(word => {
    const lowerWord = word.toLowerCase();
    
    // Skip common words and very short ones
    if (commonWords.has(lowerWord) || lowerWord.length < 4) return;
    
    if (!styleProfile.vocabularyProfile.favoriteWords[lowerWord]) {
      styleProfile.vocabularyProfile.favoriteWords[lowerWord] = 1;
    } else {
      styleProfile.vocabularyProfile.favoriteWords[lowerWord]++;
    }
  });
  
  // Keep the favorite words collection at a reasonable size
  const sortedWords = Object.entries(styleProfile.vocabularyProfile.favoriteWords)
    .sort((a, b) => b[1] - a[1]);
    
  if (sortedWords.length > 50) {
    styleProfile.vocabularyProfile.favoriteWords = 
      Object.fromEntries(sortedWords.slice(0, 50));
  }
  
  // Analyze word complexity (approximated by word length)
  let totalComplexity = 0;
  words.forEach(word => {
    // Skip very short words
    if (word.length < 3) return;
    
    // Add to complexity score based on length
    if (word.length > 10) totalComplexity += 3;
    else if (word.length > 7) totalComplexity += 2;
    else if (word.length > 5) totalComplexity += 1;
  });
  
  const complexityScore = totalComplexity / words.length;
  styleProfile.vocabularyProfile.complexity = 
    (styleProfile.vocabularyProfile.complexity * 0.7) + (complexityScore * 0.3);
};

/**
 * Analyze punctuation style
 * @param {string} text - Text to analyze for punctuation
 */
const analyzePunctuation = (text) => {
  // Count punctuation frequencies
  const punctuationCounts = {
    exclamation: (text.match(/!/g) || []).length,
    comma: (text.match(/,/g) || []).length,
    ellipsis: (text.match(/\.{3}/g) || []).length,
    semicolon: (text.match(/;/g) || []).length,
    parentheses: (text.match(/\(/g) || []).length,
    dash: (text.match(/-/g) || []).length
  };
  
  // Normalize by text length (per 100 characters)
  const textLength = Math.max(text.length, 1);
  const normalizer = 100 / textLength;
  
  // Update punctuation style metrics
  styleProfile.punctuationStyle.exclamationFrequency = 
    (styleProfile.punctuationStyle.exclamationFrequency * 0.7) + 
    (punctuationCounts.exclamation * normalizer * 0.3);
    
  styleProfile.punctuationStyle.commaFrequency = 
    (styleProfile.punctuationStyle.commaFrequency * 0.7) + 
    (punctuationCounts.comma * normalizer * 0.3);
    
  styleProfile.punctuationStyle.ellipsisUsage = 
    (styleProfile.punctuationStyle.ellipsisUsage * 0.7) + 
    (punctuationCounts.ellipsis * normalizer * 0.3);
    
  styleProfile.punctuationStyle.semicolonUsage = 
    (styleProfile.punctuationStyle.semicolonUsage * 0.7) + 
    (punctuationCounts.semicolon * normalizer * 0.3);
    
  styleProfile.punctuationStyle.parenthesesUsage = 
    (styleProfile.punctuationStyle.parenthesesUsage * 0.7) + 
    (punctuationCounts.parentheses * normalizer * 0.3);
    
  styleProfile.punctuationStyle.dashUsage = 
    (styleProfile.punctuationStyle.dashUsage * 0.7) + 
    (punctuationCounts.dash * normalizer * 0.3);
};

/**
 * Analyze emoji usage
 * @param {string} text - Text to analyze for emoji usage
 */
const analyzeEmoji = (text) => {
  // Simple emoji detection (for common emojis)
  const emojis = text.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || [];
  
  // Also detect text emoticons
  const emoticons = text.match(/(?::|;|=)(?:-)?(?:\)|D|P|\()/g) || [];
  
  const allEmojis = [...emojis, ...emoticons];
  
  // Update emoji frequency
  if (allEmojis.length > 0) {
    const textLength = text.length;
    const emojiFrequency = (allEmojis.length / textLength) * 100; // Per 100 chars
    
    styleProfile.emojiStyle.frequency = 
      (styleProfile.emojiStyle.frequency * 0.7) + (Math.min(emojiFrequency * 2, 10) * 0.3);
      
    // Categorize emojis (simple approximation)
    allEmojis.forEach(emoji => {
      // Positive emojis
      if (/😀|😃|😄|😁|😆|😊|🙂|🙃|😉|😌|😍|🥰|😘|💕|❤️|👍/u.test(emoji) || 
          /(?::|=)(?:-)?\)/g.test(emoji)) {
        if (!styleProfile.emojiStyle.positive.includes(emoji)) {
          styleProfile.emojiStyle.positive.push(emoji);
        }
      } 
      // Negative emojis
      else if (/😞|😔|😟|😕|🙁|☹️|😣|😖|😫|😩|🥺|😢|😭|😠|😡|👎/u.test(emoji) ||
              /(?::|=)(?:-)?\(/g.test(emoji)) {
        if (!styleProfile.emojiStyle.negative.includes(emoji)) {
          styleProfile.emojiStyle.negative.push(emoji);
        }
      } 
      // Neutral emojis
      else {
        if (!styleProfile.emojiStyle.neutral.includes(emoji)) {
          styleProfile.emojiStyle.neutral.push(emoji);
        }
      }
      
      // Add to favorites if not already present
      if (!styleProfile.emojiStyle.favorites.includes(emoji)) {
        styleProfile.emojiStyle.favorites.push(emoji);
        if (styleProfile.emojiStyle.favorites.length > 10) {
          styleProfile.emojiStyle.favorites.shift();
        }
      }
    });
  }
};

/**
 * Extract common phrases the user might use
 * @param {string} text - Text to analyze for common phrases
 */
const extractPhrases = (text) => {
  const lowerText = text.toLowerCase();
  
  // Check for greeting phrases
  const greetingPatterns = [
    /\bhello\b/, /\bhi\b/, /\bhey\b/, /\bgreetings\b/, 
    /\bgood morning\b/, /\bgood afternoon\b/, /\bgood evening\b/,
    /\bhowdy\b/, /\bwhat('s| is) up\b/, /\byo\b/
  ];
  
  greetingPatterns.forEach(pattern => {
    const match = lowerText.match(pattern);
    if (match && isSignificantPhrase(match[0])) {
      const greeting = match[0];
      if (!styleProfile.phrasesAndExpressions.greetings.includes(greeting)) {
        styleProfile.phrasesAndExpressions.greetings.push(greeting);
        
        // Limit the array size
        if (styleProfile.phrasesAndExpressions.greetings.length > 5) {
          styleProfile.phrasesAndExpressions.greetings.shift();
        }
      }
    }
  });
  
  // Check for farewell phrases
  const farewellPatterns = [
    /\bbye\b/, /\bgoodbye\b/, /\bsee you\b/, /\btake care\b/, 
    /\bfarewell\b/, /\buntil next time\b/, /\bsee ya\b/,
    /\bso long\b/, /\btalk to you later\b/, /\btalk soon\b/,
    /\blater\b/, /\bcheers\b/
  ];
  
  farewellPatterns.forEach(pattern => {
    const match = lowerText.match(pattern);
    if (match && isSignificantPhrase(match[0])) {
      const farewell = match[0];
      if (!styleProfile.phrasesAndExpressions.farewells.includes(farewell)) {
        styleProfile.phrasesAndExpressions.farewells.push(farewell);
        
        // Limit the array size
        if (styleProfile.phrasesAndExpressions.farewells.length > 5) {
          styleProfile.phrasesAndExpressions.farewells.shift();
        }
      }
    }
  });
  
  // Check for transitional phrases
  const transitionPatterns = [
    /\bon the other hand\b/, /\bhowever\b/, /\btherefore\b/, 
    /\bconsequently\b/, /\bfurthermore\b/, /\bmoreover\b/,
    /\bin addition\b/, /\bin conclusion\b/, /\bto sum up\b/,
    /\banyway\b/, /\bin any case\b/, /\bbesides\b/
  ];
  
  transitionPatterns.forEach(pattern => {
    const match = lowerText.match(pattern);
    if (match && isSignificantPhrase(match[0])) {
      const transition = match[0];
      if (!styleProfile.phrasesAndExpressions.transitions.includes(transition)) {
        styleProfile.phrasesAndExpressions.transitions.push(transition);
        
        // Limit the array size
        if (styleProfile.phrasesAndExpressions.transitions.length > 8) {
          styleProfile.phrasesAndExpressions.transitions.shift();
        }
      }
    }
  });
  
  // Extract frequent expressions (3-5 word phrases)
  const words = lowerText.split(/\s+/);
  for (let len = 3; len <= 5; len++) {
    if (words.length >= len) {
      for (let i = 0; i <= words.length - len; i++) {
        const phrase = words.slice(i, i + len).join(' ');
        if (isSignificantPhrase(phrase) && 
            !styleProfile.phrasesAndExpressions.expressions.includes(phrase)) {
          styleProfile.phrasesAndExpressions.expressions.push(phrase);
          
          // Limit the array size
          if (styleProfile.phrasesAndExpressions.expressions.length > 15) {
            styleProfile.phrasesAndExpressions.expressions.shift();
          }
          
          break; // Only add one phrase of each length per analysis
        }
      }
    }
  }
};

/**
 * Determine if a phrase is significant enough to track
 * @param {string} phrase - Phrase to evaluate
 * @returns {boolean} - Whether the phrase is significant
 */
const isSignificantPhrase = (phrase) => {
  // Skip very short phrases
  if (phrase.length < 5) return false;
  
  // Skip phrases that are just common words
  const commonWords = ['the', 'and', 'but', 'that', 'this', 'what', 'when', 'where', 'which'];
  const phraseWords = phrase.split(/\s+/);
  
  // If it's all common words, skip it
  if (phraseWords.every(word => commonWords.includes(word))) return false;
  
  // Skip phrases that start with pronouns (more likely to be generic)
  if (['i', 'you', 'he', 'she', 'it', 'we', 'they'].includes(phraseWords[0])) return false;
  
  return true;
};

/**
 * Analyze the formality level and other behavioral patterns in text
 * @param {string} text - Text to analyze
 */
const analyzeFormality = (text) => {
  const lowerText = text.toLowerCase();
  
  // Formality indicators
  const formalityScore = calculateFormality(lowerText);
  styleProfile.behavioralPatterns.formality = 
    (styleProfile.behavioralPatterns.formality * 0.7) + (formalityScore * 0.3);
  
  // Directness indicators
  let directnessScore = 0;
  
  // Direct phrases increase score
  if (/\bi think\b|\bin my opinion\b|\bi believe\b/g.test(lowerText)) {
    directnessScore += 2;
  }
  
  // Hedging phrases decrease score
  if (/\bperhaps\b|\bmaybe\b|\bpossibly\b|\bit seems\b|\bsort of\b|\bkind of\b/g.test(lowerText)) {
    directnessScore -= 2;
  }
  
  // Strong statements increase score
  if (/\bcertainly\b|\bdefinitely\b|\babsolutely\b|\bwithout a doubt\b/g.test(lowerText)) {
    directnessScore += 3;
  }
  
  // Imperative sentences increase score
  if (/\b(do|make|get|find|use|try|keep|let|go)\b [a-z]+/g.test(lowerText)) {
    directnessScore += 1;
  }
  
  styleProfile.behavioralPatterns.directness = 
    (styleProfile.behavioralPatterns.directness * 0.7) + (directnessScore * 0.3);
  
  // Verbosity indicators
  const words = lowerText.match(/\b\w+\b/g) || [];
  const sentences = lowerText.match(/[^.!?]+[.!?]+/g) || [];
  
  if (sentences.length > 0) {
    const wordsPerSentence = words.length / sentences.length;
    let verbosityScore = 0;
    
    // Higher words per sentence suggests more verbose style
    if (wordsPerSentence > 20) verbosityScore += 4;
    else if (wordsPerSentence > 15) verbosityScore += 2;
    else if (wordsPerSentence < 8) verbosityScore -= 2;
    else if (wordsPerSentence < 5) verbosityScore -= 4;
    
    // More commas suggests more complex, verbose sentences
    const commaCount = (lowerText.match(/,/g) || []).length;
    if (commaCount > sentences.length * 2) verbosityScore += 2;
    
    // Adverbs often make text more verbose
    const adverbCount = (lowerText.match(/\b\w+ly\b/g) || []).length;
    if (adverbCount > words.length * 0.05) verbosityScore += 2;
    
    styleProfile.behavioralPatterns.verbosity = 
      (styleProfile.behavioralPatterns.verbosity * 0.7) + (verbosityScore * 0.3);
  }
  
  // Emotional expression
  let emotionalScore = 0;
  
  // Exclamation marks suggest emotional expression
  const exclamationCount = (lowerText.match(/!/g) || []).length;
  emotionalScore += Math.min(exclamationCount, 5);
  
  // Emotional words
  const emotionalWords = [
    'love', 'hate', 'happy', 'sad', 'angry', 'excited', 'amazing', 'terrible',
    'wonderful', 'awful', 'beautiful', 'horrible', 'glad', 'upset', 'worried',
    'thrilled', 'disappointed', 'delighted', 'annoyed', 'pleased'
  ];
  
  let emotionalWordCount = 0;
  emotionalWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = lowerText.match(regex);
    if (matches) {
      emotionalWordCount += matches.length;
    }
  });
  
  emotionalScore += Math.min(emotionalWordCount * 0.5, 5);
  
  // Normalize to 0-10 scale
  emotionalScore = Math.min(emotionalScore, 10);
  
  styleProfile.behavioralPatterns.emotionalExpression = 
    (styleProfile.behavioralPatterns.emotionalExpression * 0.7) + (emotionalScore * 0.3);
  
  // Clamp values
  Object.keys(styleProfile.behavioralPatterns).forEach(key => {
    styleProfile.behavioralPatterns[key] = clamp(styleProfile.behavioralPatterns[key], -10, 10);
  });
};

/**
 * Helper to keep values within a range
 */
const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Calculate formality score from text
 */
const calculateFormality = (text) => {
  let score = 0;
  
  // Formal indicators
  if (/\bdear\b|\bsincerely\b|\bregards\b|\brespectfully\b/g.test(text)) score += 3;
  if (/\bshall\b|\bwould\b|\boutlined\b|\bproceed\b/g.test(text)) score += 2;
  if (/(\bI am\b|\bthey are\b|\bhe is\b|\bshe is\b)/g.test(text)) score += 1;
  if (/(\bcannot\b|\bdo not\b|\bwill not\b)/g.test(text)) score += 1;
  
  // Informal indicators
  if (/\bhey\b|\byeah\b|\bnah\b|\bcool\b|\bawesome\b/g.test(text)) score -= 3;
  if (/(\bI'm\b|\bthey're\b|\bhe's\b|\bshe's\b)/g.test(text)) score -= 1;
  if (/(\bcan't\b|\bdon't\b|\bwon't\b|\bgonna\b|\bwanna\b)/g.test(text)) score -= 1;
  if (/\bomg\b|\blol\b|\bbtw\b|\bidk\b|\bimo\b/g.test(text)) score -= 3;
  
  return score;
};

/**
 * Save the style profile to localStorage
 */
export const saveStyleProfile = () => {
  try {
    localStorage.setItem('echoTwinStyleProfile', JSON.stringify({
      styleProfile,
      analyzedSamples
    }));
  } catch (err) {
    console.error('Error saving style profile:', err);
  }
};

/**
 * Load the style profile from localStorage
 * @returns {Object} The loaded style profile, or null if not found
 */
export const loadStyleProfile = () => {
  try {
    const saved = localStorage.getItem('echoTwinStyleProfile');
    if (saved) {
      const parsed = JSON.parse(saved);
      styleProfile = parsed.styleProfile;
      analyzedSamples = parsed.analyzedSamples;
      return styleProfile;
    }
  } catch (err) {
    console.error('Error loading style profile:', err);
  }
  return null;
};

/**
 * Get the current style profile
 * @returns {Object} The current style profile
 */
export const getStyleProfile = () => {
  return styleProfile;
};

/**
 * Modify the emotional signature of the style profile
 * Used for mood adjustments
 * @param {Object} emotionAdjustments - Changes to emotional values
 */
export const adjustEmotionalSignature = (emotionAdjustments) => {
  if (!emotionAdjustments) return;
  
  Object.keys(emotionAdjustments).forEach(emotion => {
    if (styleProfile.emotionalSignature[emotion]) {
      const adjustment = clamp(emotionAdjustments[emotion], -5, 5);
      styleProfile.emotionalSignature[emotion].frequency = 
        clamp(styleProfile.emotionalSignature[emotion].frequency + adjustment, 0, 10);
    }
  });
  
  saveStyleProfile();
};

/**
 * Reset the style profile to default values
 */
const resetStyleProfile = () => {
  styleProfile = {
    sentenceStructure: {
      averageLength: 0,
      complexSentences: 0,
      fragmentUsage: 0,
      questionFrequency: 0,
    },
    vocabularyProfile: {
      complexity: 0,
      diversity: 0,
      favoriteWords: {},
      synonymPreferences: {}
    },
    punctuationStyle: {
      exclamationFrequency: 0,
      commaFrequency: 0,
      ellipsisUsage: 0,
      semicolonUsage: 0,
      parenthesesUsage: 0,
      dashUsage: 0,
    },
    emojiStyle: {
      frequency: 0,
      positive: [],
      negative: [],
      neutral: [],
      favorites: []
    },
    phrasesAndExpressions: {
      greetings: [],
      farewells: [],
      transitions: [],
      expressions: []
    },
    behavioralPatterns: {
      formality: 0,
      directness: 0,
      verbosity: 0,
      emotionalExpression: 0,
      politeness: 0,
      humor: 0,
    },
    emotionalSignature: {
      joy: { frequency: 0, expressions: [] },
      sadness: { frequency: 0, expressions: [] },
      anger: { frequency: 0, expressions: [] },
      surprise: { frequency: 0, expressions: [] },
      interest: { frequency: 0, expressions: [] },
      confusion: { frequency: 0, expressions: [] }
    }
  };
  
  analyzedSamples = [];
};

/**
 * Generate text mimicking the user's style
 * Core function for Echo Twin's mirroring capability
 * @param {string} baseText - Starting text or template to modify
 * @param {Object} moodOverrides - Optional overrides for emotional state
 * @returns {string} - Text modified to match user's style
 */
export const generateMirroredText = (baseText, moodOverrides = null) => {
  if (!baseText) return '';
  
  let result = baseText;
  
  // Apply formality adjustments
  const formality = styleProfile.behavioralPatterns.formality;
  if (formality > 5) {
    // More formal
    result = result.replace(/don't/g, 'do not')
                   .replace(/can't/g, 'cannot')
                   .replace(/won't/g, 'will not')
                   .replace(/I'm/g, 'I am')
                   .replace(/you're/g, 'you are')
                   .replace(/they're/g, 'they are')
                   .replace(/it's/g, 'it is')
                   .replace(/that's/g, 'that is')
                   .replace(/there's/g, 'there is');
                   
    // Replace casual phrases
    result = result.replace(/yeah/gi, 'yes')
                   .replace(/nah/gi, 'no')
                   .replace(/gonna/gi, 'going to')
                   .replace(/wanna/gi, 'want to');
  } 
  else if (formality < -5) {
    // More casual
    result = result.replace(/do not/g, "don't")
                   .replace(/cannot/g, "can't")
                   .replace(/will not/g, "won't")
                   .replace(/I am/g, "I'm")
                   .replace(/you are/g, "you're")
                   .replace(/they are/g, "they're")
                   .replace(/it is/g, "it's")
                   .replace(/that is/g, "that's")
                   .replace(/there is/g, "there's");
                   
    // Add casual phrases occasionally
    if (Math.random() < 0.3) {
      const casualPhrases = ['you know', 'like', 'honestly', 'basically', 'actually'];
      const casualPhrase = casualPhrases[Math.floor(Math.random() * casualPhrases.length)];
      
      // Insert at a reasonable position
      const sentences = result.split('.');
      if (sentences.length > 1) {
        const insertPoint = Math.floor(Math.random() * sentences.length);
        const words = sentences[insertPoint].split(' ');
        if (words.length > 3) {
          const wordPosition = Math.floor(Math.random() * (words.length - 2)) + 1;
          words.splice(wordPosition, 0, casualPhrase);
          sentences[insertPoint] = words.join(' ');
          result = sentences.join('.');
        }
      }
    }
  }
  
  // Apply directness adjustments
  const directness = styleProfile.behavioralPatterns.directness;
  if (directness > 5) {
    // More direct
    result = result.replace(/I think |Perhaps |Maybe |Possibly |It seems like |sort of |kind of /gi, '');
    result = result.replace(/I believe that /gi, '');
    result = result.replace(/In my opinion, /gi, '');
    
    // Add direct phrases for strong directness
    if (directness > 7 && Math.random() < 0.3) {
      if (!result.includes('Look,') && !result.includes('listen')) {
        result = 'Look, ' + result.charAt(0).toLowerCase() + result.slice(1);
      }
    }
  } 
  else if (directness < -5) {
    // More indirect
    if (!result.match(/I think|Perhaps|Maybe|Possibly|It seems like|sort of|kind of/gi)) {
      const hedges = ['I think ', 'Perhaps ', 'It seems like ', 'Maybe '];
      const hedge = hedges[Math.floor(Math.random() * hedges.length)];
      result = hedge + result.charAt(0).toLowerCase() + result.slice(1);
    }
  }
  
  // Apply verbosity adjustments
  const verbosity = styleProfile.behavioralPatterns.verbosity;
  if (verbosity > 5) {
    // More verbose
    result = result.replace(/\b(good|bad|nice|interesting)\b/gi, (match) => {
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
    if (styleProfile.phrasesAndExpressions.transitions.length > 0 &&
        result.includes('.') && 
        !result.match(/however|therefore|consequently|furthermore|additionally/i)) {
      
      const transitions = styleProfile.phrasesAndExpressions.transitions.length > 0 
        ? styleProfile.phrasesAndExpressions.transitions 
        : ['Furthermore', 'Additionally', 'Moreover', 'In addition'];
      
      const transition = transitions[Math.floor(Math.random() * transitions.length)];
      
      // Insert at a sentence break
      const sentences = result.split('.');
      if (sentences.length > 1) {
        const insertPoint = Math.floor(Math.random() * (sentences.length - 1)) + 1;
        sentences[insertPoint] = ' ' + transition + ',' + sentences[insertPoint];
        result = sentences.join('.');
      }
    }
  } 
  else if (verbosity < -5) {
    // More concise
    result = result.replace(/\b(very|really|quite|extremely|absolutely|basically|actually|essentially)\b\s/gi, '');
    
    // Simplify longer phrases
    result = result.replace(/in order to/gi, 'to')
               .replace(/due to the fact that/gi, 'because')
               .replace(/at this point in time/gi, 'now')
               .replace(/in the event that/gi, 'if')
               .replace(/on the grounds that/gi, 'because')
               .replace(/in light of the fact that/gi, 'because');
    
    // Shorten sentences by removing some clauses
    result = result.replace(/,\s*which\s+[^.,]+/gi, '');
  }
  
  // Apply emotional expression adjustments
  const emotionalExpression = styleProfile.behavioralPatterns.emotionalExpression;
  
  // Use mood overrides if provided, otherwise use style profile's emotional signature
  let dominantEmotion = 'neutral';
  if (moodOverrides) {
    // Find the strongest emotion in the overrides
    let maxIntensity = 0;
    Object.entries(moodOverrides).forEach(([emotion, intensity]) => {
      if (intensity > maxIntensity) {
        maxIntensity = intensity;
        dominantEmotion = emotion;
      }
    });
  } else {
    // Find the dominant emotion in the style profile
    let maxFrequency = 0;
    Object.entries(styleProfile.emotionalSignature).forEach(([emotion, data]) => {
      if (data.frequency > maxFrequency) {
        maxFrequency = data.frequency;
        dominantEmotion = emotion;
      }
    });
  }
  
  // Only apply emotional styling if the expression level is high enough
  if (emotionalExpression > 5) {
    // Add emotional markers
    if (dominantEmotion !== 'neutral' && Math.random() < 0.4) {
      // Emotion-specific expressions
      const emotionalExpressions = {
        joy: ['I\'m happy that', 'I\'m delighted that', 'I\'m glad that', 'It\'s wonderful that'],
        sadness: ['I\'m sad that', 'Unfortunately,', 'It\'s unfortunate that', 'I regret that'],
        anger: ['I\'m frustrated that', 'It\'s irritating that', 'It bothers me that'],
        surprise: ['Surprisingly,', 'Amazingly,', 'I\'m surprised that', 'It\'s remarkable that'],
        interest: ['Interestingly,', 'Notably,', 'I find it interesting that'],
        confusion: ['I\'m confused about', 'It\'s puzzling that', 'I wonder why']
      };
      
      const expressions = emotionalExpressions[dominantEmotion] || 
                         ['I feel that', 'I think that', 'In my view,'];
      
      const expression = expressions[Math.floor(Math.random() * expressions.length)];
      
      // Add at beginning of a sentence
      if (result.includes('.')) {
        const sentences = result.split('.');
        if (sentences.length > 1) {
          const insertPoint = Math.floor(Math.random() * sentences.length);
          sentences[insertPoint] = ' ' + expression + sentences[insertPoint].trim();
          result = sentences.join('.');
        }
      } else {
        // Add at beginning if no sentences
        result = expression + ' ' + result;
      }
    }
    
    // Adjust ending punctuation based on emotion
    if (dominantEmotion === 'joy' || dominantEmotion === 'surprise') {
      // More exclamation points for happy/excited emotions
      result = result.replace(/\.\s*([A-Z])/g, (match, p1, offset) => {
        return Math.random() < 0.3 ? `! ${p1}` : match;
      });
    } else if (dominantEmotion === 'confusion') {
      // More question marks for confusion
      result = result.replace(/\.\s*([A-Z])/g, (match, p1, offset) => {
        return Math.random() < 0.2 ? `? ${p1}` : match;
      });
    }
  }
  
  // Add favorite emoji if appropriate
  if (styleProfile.emojiStyle.frequency > 3 && Math.random() < 0.3) {
    let emojiPool;
    
    // Select appropriate emoji category based on emotion
    if (['joy', 'interest'].includes(dominantEmotion) && styleProfile.emojiStyle.positive.length > 0) {
      emojiPool = styleProfile.emojiStyle.positive;
    } else if (['sadness', 'anger'].includes(dominantEmotion) && styleProfile.emojiStyle.negative.length > 0) {
      emojiPool = styleProfile.emojiStyle.negative;
    } else if (styleProfile.emojiStyle.favorites.length > 0) {
      emojiPool = styleProfile.emojiStyle.favorites;
    } else {
      emojiPool = [];
    }
    
    // Add emoji if we have any
    if (emojiPool.length > 0) {
      const emoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
      result = result.trim() + ' ' + emoji;
    }
  }
  
  // Add personal greeting/farewell if appropriate
  if (result.trim().endsWith('?') && 
      styleProfile.phrasesAndExpressions.greetings.length > 0 && 
      Math.random() < 0.2) {
    const greeting = styleProfile.phrasesAndExpressions.greetings[
      Math.floor(Math.random() * styleProfile.phrasesAndExpressions.greetings.length)
    ];
    result = greeting.charAt(0).toUpperCase() + greeting.slice(1) + '. ' + result;
  }
  
  return result;
};

// Export default interface
export default {
  initializeStyleAnalyzer,
  analyzeText,
  generateMirroredText,
  getStyleProfile,
  saveStyleProfile,
  loadStyleProfile,
  adjustEmotionalSignature
};
