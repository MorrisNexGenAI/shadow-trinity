/**
 * Style Analyzer for Shadow OS Echo Twin
 * Analyzes and learns a person's communication style for identity mirroring
 */

// Core style profile
let styleProfile = {
  // Language structure
  sentenceStructure: {
    averageLength: 0,       // Average sentence length in words
    complexSentences: 0,    // Percentage of complex sentences (0-100)
    fragmentUsage: 0,       // Frequency of sentence fragments (0-10)
    questionFrequency: 0,   // Frequency of questions (0-10)
  },
  
  // Vocabulary and word choice
  vocabularyProfile: {
    complexity: 0,         // Word complexity (0-10)
    diversity: 0,          // Vocabulary diversity (0-10)
    favoriteWords: {},     // Frequently used words with count
    synonymPreferences: {} // Preferred synonyms for common words
  },
  
  // Punctuation and formatting
  punctuationStyle: {
    exclamationFrequency: 0,  // 0-10 scale
    commaFrequency: 0,        // 0-10 scale
    ellipsisUsage: 0,         // 0-10 scale 
    semicolonUsage: 0,        // 0-10 scale
    parenthesesUsage: 0,      // 0-10 scale
    dashUsage: 0,             // 0-10 scale
  },
  
  // Emoji and emoticon usage
  emojiStyle: {
    frequency: 0,           // 0-10 scale
    positive: [],           // Frequently used positive emojis
    negative: [],           // Frequently used negative emojis
    neutral: [],            // Frequently used neutral emojis
    favorites: []           // Most frequently used emojis
  },
  
  // Common phrases and expressions
  phrasesAndExpressions: {
    greetings: [],          // Common greeting phrases
    farewells: [],          // Common farewell phrases
    transitions: [],        // Transitional phrases
    expressions: []         // Unique expressions or catchphrases
  },
  
  // Formality and behavioral patterns
  behavioralPatterns: {
    formality: 0,           // -10 to 10 scale (casual to formal)
    directness: 0,          // -10 to 10 scale (indirect to direct)
    verbosity: 0,           // -10 to 10 scale (concise to verbose)
    emotionalExpression: 0, // 0-10 scale (reserved to expressive)
    politeness: 0,          // 0-10 scale
    humor: 0,               // 0-10 scale
  },
  
  // Emotional signature - how emotions are expressed
  emotionalSignature: {
    joy: { frequency: 0, expressions: [] },
    sadness: { frequency: 0, expressions: [] },
    anger: { frequency: 0, expressions: [] },
    surprise: { frequency: 0, expressions: [] },
    interest: { frequency: 0, expressions: [] },
    confusion: { frequency: 0, expressions: [] }
  }
};

// Training data
let analyzedSamples = [];

/**
 * Initialize the style analyzer with user data
 * @param {Object} userData - Data collected during onboarding
 */
export const initializeStyleAnalyzer = (userData) => {
  // Reset to default values
  resetStyleProfile();
  
  // Process name and basic data
  if (userData.name) {
    // Use name to potentially detect formal/informal style
    if (userData.name.includes(' ')) {
      styleProfile.behavioralPatterns.formality += 1; // Slight formality increase for full names
    }
  }
  
  // Process communication preferences if available
  if (userData.communicationPreferences) {
    if (userData.communicationPreferences.formal) {
      styleProfile.behavioralPatterns.formality += 5;
    }
    
    if (userData.communicationPreferences.casual) {
      styleProfile.behavioralPatterns.formality -= 5;
    }
    
    if (userData.communicationPreferences.direct) {
      styleProfile.behavioralPatterns.directness += 5;
    }
    
    if (userData.communicationPreferences.elaborate) {
      styleProfile.behavioralPatterns.verbosity += 5;
    }
    
    if (userData.communicationPreferences.concise) {
      styleProfile.behavioralPatterns.verbosity -= 5;
    }
  }
  
  // Process personal identity data
  if (userData.personalIdentity) {
    // Add unique expressions
    if (userData.personalIdentity.uniqueTraits && Array.isArray(userData.personalIdentity.uniqueTraits)) {
      styleProfile.phrasesAndExpressions.expressions = [...userData.personalIdentity.uniqueTraits];
    }
    
    // Extract emotional expression style
    if (userData.personalIdentity.emotionalSignature) {
      const emotionalText = userData.personalIdentity.emotionalSignature.toLowerCase();
      
      // Check for keywords indicating emotional expressiveness
      if (emotionalText.includes('expressive') || 
          emotionalText.includes('emotional') || 
          emotionalText.includes('passionate')) {
        styleProfile.behavioralPatterns.emotionalExpression += 3;
      }
      
      // Check for keywords indicating reserved style
      if (emotionalText.includes('reserved') || 
          emotionalText.includes('private') || 
          emotionalText.includes('controlled')) {
        styleProfile.behavioralPatterns.emotionalExpression -= 3;
      }
      
      // Check for emoji usage
      if (emotionalText.includes('emoji') || 
          emotionalText.includes('emoticon')) {
        styleProfile.emojiStyle.frequency += 3;
      }
    }
  }
  
  // Process writing samples
  if (userData.writingSamples && userData.writingSamples.length > 0) {
    userData.writingSamples.forEach(sample => {
      analyzeText(sample, true);
    });
  }
  
  // Save the initial style profile
  saveStyleProfile();
  
  return styleProfile;
};

/**
 * Analyze text to extract style characteristics
 * @param {string} text - Text to analyze
 * @param {boolean} isInitial - Whether this is initial training or ongoing learning
 */
export const analyzeText = (text, isInitial = false) => {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return;
  }
  
  // Add to analyzed samples
  analyzedSamples.push(text);
  
  // Keep samples at a reasonable number
  if (analyzedSamples.length > 50) {
    analyzedSamples.shift();
  }
  
  // Parse into sentences for structure analysis
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  sentences.forEach(sentence => {
    analyzeSentence(sentence.trim());
  });
  
  // Parse into words for vocabulary analysis
  const words = text.match(/\\b\\w+\\b/g) || [];
  analyzeWords(words);
  
  // Analyze punctuation style
  analyzePunctuation(text);
  
  // Analyze emoji usage
  analyzeEmoji(text);
  
  // Extract common phrases
  extractPhrases(text);
  
  // Analyze formality and behavioral patterns
  analyzeFormality(text);
  
  // Save updates to the style profile
  saveStyleProfile();
};

/**
 * Analyze sentence structure
 * @param {string} sentence - Single sentence to analyze
 */
const analyzeSentence = (sentence) => {
  // Count words
  const words = sentence.match(/\\b\\w+\\b/g) || [];
  const wordCount = words.length;
  
  // Update average sentence length
  const currentAvg = styleProfile.sentenceStructure.averageLength;
  const sampleCount = analyzedSamples.length;
  
  styleProfile.sentenceStructure.averageLength = 
    ((currentAvg * (sampleCount - 1)) + wordCount) / sampleCount;
  
  // Check for complex sentence structures
  const hasSubordinate = /although|because|since|while|if|when|after|before|as|whereas/i.test(sentence);
  const hasConjunction = /and|or|but|so|yet|for|nor/i.test(sentence);
  const hasTransitional = /however|therefore|consequently|furthermore|additionally/i.test(sentence);
  
  if (hasSubordinate || hasTransitional) {
    styleProfile.sentenceStructure.complexSentences += 0.5;
  }
  
  // Check for fragments (simple approximation)
  if (wordCount < 4 && !(/\\b(is|are|was|were|have|has|had)\\b/i.test(sentence))) {
    styleProfile.sentenceStructure.fragmentUsage += 0.5;
  }
  
  // Check for questions
  if (sentence.endsWith('?')) {
    styleProfile.sentenceStructure.questionFrequency += 1;
  }
  
  // Normalize values to stay within scale
  styleProfile.sentenceStructure.complexSentences = 
    clamp(styleProfile.sentenceStructure.complexSentences, 0, 10);
    
  styleProfile.sentenceStructure.fragmentUsage = 
    clamp(styleProfile.sentenceStructure.fragmentUsage, 0, 10);
    
  styleProfile.sentenceStructure.questionFrequency = 
    clamp(styleProfile.sentenceStructure.questionFrequency, 0, 10);
};

/**
 * Analyze word preferences and vocabulary
 * @param {Array<string>} words - Array of words from the text
 */
const analyzeWords = (words) => {
  if (words.length === 0) return;
  
  // Filter out common words
  const commonWords = new Set([
    'the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 
    'by', 'as', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'is', 'are', 
    'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 
    'did', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 
    'its', 'our', 'their', 'from'
  ]);
  
  // Count word frequencies
  words.forEach(word => {
    const lowerWord = word.toLowerCase();
    if (lowerWord.length < 3 || commonWords.has(lowerWord)) {
      return;
    }
    
    if (!styleProfile.vocabularyProfile.favoriteWords[lowerWord]) {
      styleProfile.vocabularyProfile.favoriteWords[lowerWord] = 1;
    } else {
      styleProfile.vocabularyProfile.favoriteWords[lowerWord]++;
    }
  });
  
  // Calculate vocabulary complexity (simple approximation)
  let complexWordCount = 0;
  let longWordCount = 0;
  
  words.forEach(word => {
    if (word.length > 8) {
      longWordCount++;
    }
    
    // Simple syllable count approximation
    const syllables = word.match(/[aeiouy]{1,2}/g)?.length || 1;
    if (syllables > 2) {
      complexWordCount++;
    }
  });
  
  const complexityScore = (complexWordCount / words.length) * 10;
  const diversityScore = (new Set(words.map(w => w.toLowerCase())).size / words.length) * 10;
  
  // Update vocabulary profile using weighted average
  styleProfile.vocabularyProfile.complexity = 
    (styleProfile.vocabularyProfile.complexity * 0.8) + (complexityScore * 0.2);
    
  styleProfile.vocabularyProfile.diversity = 
    (styleProfile.vocabularyProfile.diversity * 0.8) + (diversityScore * 0.2);
    
  // Clean up favorite words to keep only most frequent
  if (Object.keys(styleProfile.vocabularyProfile.favoriteWords).length > 30) {
    const sortedWords = Object.entries(styleProfile.vocabularyProfile.favoriteWords)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30);
      
    styleProfile.vocabularyProfile.favoriteWords = Object.fromEntries(sortedWords);
  }
};

/**
 * Analyze punctuation style
 * @param {string} text - Text to analyze for punctuation
 */
const analyzePunctuation = (text) => {
  // Count punctuation marks
  const exclamationCount = (text.match(/!/g) || []).length;
  const commaCount = (text.match(/,/g) || []).length;
  const ellipsisCount = (text.match(/\\.\\.\\.|\\.{3}/g) || []).length;
  const semicolonCount = (text.match(/;/g) || []).length;
  const parenthesesCount = (text.match(/[\\(\\)]/g) || []).length;
  const dashCount = (text.match(/[-–—]/g) || []).length;
  
  // Normalize by text length (per 100 characters)
  const textLength = text.length / 100;
  
  // Update punctuation frequency with a weighted average
  const weight = 0.3; // New data weight
  const oldWeight = 1 - weight;
  
  styleProfile.punctuationStyle.exclamationFrequency = 
    styleProfile.punctuationStyle.exclamationFrequency * oldWeight + 
    Math.min(exclamationCount / textLength * 5, 10) * weight;
    
  styleProfile.punctuationStyle.commaFrequency = 
    styleProfile.punctuationStyle.commaFrequency * oldWeight + 
    Math.min(commaCount / textLength * 2, 10) * weight;
    
  styleProfile.punctuationStyle.ellipsisUsage = 
    styleProfile.punctuationStyle.ellipsisUsage * oldWeight + 
    Math.min(ellipsisCount / textLength * 10, 10) * weight;
    
  styleProfile.punctuationStyle.semicolonUsage = 
    styleProfile.punctuationStyle.semicolonUsage * oldWeight + 
    Math.min(semicolonCount / textLength * 10, 10) * weight;
    
  styleProfile.punctuationStyle.parenthesesUsage = 
    styleProfile.punctuationStyle.parenthesesUsage * oldWeight + 
    Math.min(parenthesesCount / textLength * 5, 10) * weight;
    
  styleProfile.punctuationStyle.dashUsage = 
    styleProfile.punctuationStyle.dashUsage * oldWeight + 
    Math.min(dashCount / textLength * 5, 10) * weight;
  
  // Clamp values to 0-10 range
  Object.keys(styleProfile.punctuationStyle).forEach(key => {
    styleProfile.punctuationStyle[key] = clamp(styleProfile.punctuationStyle[key], 0, 10);
  });
};

/**
 * Analyze emoji usage
 * @param {string} text - Text to analyze for emoji usage
 */
const analyzeEmoji = (text) => {
  // Simple emoji detection regex (covers common emoji patterns)
  const emojiRegex = /[\\u{1F300}-\\u{1F6FF}\\u{1F700}-\\u{1F77F}\\u{1F780}-\\u{1F7FF}\\u{1F800}-\\u{1F8FF}\\u{1F900}-\\u{1F9FF}\\u{1FA00}-\\u{1FA6F}\\u{1FA70}-\\u{1FAFF}\\u{2600}-\\u{26FF}\\u{2700}-\\u{27BF}]/gu;
  const emojis = text.match(emojiRegex) || [];
  
  // Also detect emoticons
  const emoticonRegex = /(?::|;|=)(?:-)?(?:\\)|\\(|D|P)/g;
  const emoticons = text.match(emoticonRegex) || [];
  
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
      if (/[😀😃😄😁😆😊🙂🙃😉😌😍🥰😘💕❤️👍]/u.test(emoji) || 
          /(?::|=)(?:-)?\\)/g.test(emoji)) {
        if (!styleProfile.emojiStyle.positive.includes(emoji)) {
          styleProfile.emojiStyle.positive.push(emoji);
        }
      } 
      // Negative emojis
      else if (/[😞😔😟😕🙁☹️😣😖😫😩🥺😢😭😠😡👎]/u.test(emoji) ||
              /(?::|=)(?:-)?\\(/g.test(emoji)) {
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
    /\\bhello\\b/, /\\bhi\\b/, /\\bhey\\b/, /\\bgreetings\\b/, 
    /\\bgood morning\\b/, /\\bgood afternoon\\b/, /\\bgood evening\\b/,
    /\\bhowdy\\b/, /\\bwhat('s| is) up\\b/, /\\byo\\b/
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
    /\\bbye\\b/, /\\bgoodbye\\b/, /\\bsee you\\b/, /\\btake care\\b/, 
    /\\bfarewell\\b/, /\\buntil next time\\b/, /\\bsee ya\\b/,
    /\\bso long\\b/, /\\btalk to you later\\b/, /\\btalk soon\\b/,
    /\\blater\\b/, /\\bcheers\\b/
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
    /\\bon the other hand\\b/, /\\bhowever\\b/, /\\btherefore\\b/, 
    /\\bconsequently\\b/, /\\bfurthermore\\b/, /\\bmoreover\\b/,
    /\\bin addition\\b/, /\\bin conclusion\\b/, /\\bto sum up\\b/,
    /\\banyway\\b/, /\\bin any case\\b/, /\\bbesides\\b/
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
  const words = lowerText.split(/\\s+/);
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
  const phraseWords = phrase.split(/\\s+/);
  
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
  if (/\\bi think\\b|\\bin my opinion\\b|\\bi believe\\b/g.test(lowerText)) {
    directnessScore += 2;
  }
  
  // Hedging phrases decrease score
  if (/\\bperhaps\\b|\\bmaybe\\b|\\bpossibly\\b|\\bit seems\\b|\\bsort of\\b|\\bkind of\\b/g.test(lowerText)) {
    directnessScore -= 2;
  }
  
  // Strong statements increase score
  if (/\\bcertainly\\b|\\bdefinitely\\b|\\babsolutely\\b|\\bwithout a doubt\\b/g.test(lowerText)) {
    directnessScore += 3;
  }
  
  // Imperative sentences increase score
  if (/\\b(do|make|get|find|use|try|keep|let|go)\\b [a-z]+/g.test(lowerText)) {
    directnessScore += 1;
  }
  
  styleProfile.behavioralPatterns.directness = 
    (styleProfile.behavioralPatterns.directness * 0.7) + (directnessScore * 0.3);
  
  // Verbosity indicators
  const words = lowerText.match(/\\b\\w+\\b/g) || [];
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
    const adverbCount = (lowerText.match(/\\b\\w+ly\\b/g) || []).length;
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
  if (/\\bdear\\b|\\bsincerely\\b|\\bregards\\b|\\brespectfully\\b/g.test(text)) score += 3;
  if (/\\bshall\\b|\\bwould\\b|\\boutlined\\b|\\bproceed\\b/g.test(text)) score += 2;
  if (/(\\bI am\\b|\\bthey are\\b|\\bhe is\\b|\\bshe is\\b)/g.test(text)) score += 1;
  if (/(\\bcannot\\b|\\bdo not\\b|\\bwill not\\b)/g.test(text)) score += 1;
  
  // Informal indicators
  if (/\\bhey\\b|\\byeah\\b|\\bnah\\b|\\bcool\\b|\\bawesome\\b/g.test(text)) score -= 3;
  if (/(\\bI'm\\b|\\bthey're\\b|\\bhe's\\b|\\bshe's\\b)/g.test(text)) score -= 1;
  if (/(\\bcan't\\b|\\bdon't\\b|\\bwon't\\b|\\bgonna\\b|\\bwanna\\b)/g.test(text)) score -= 1;
  if (/\\bomg\\b|\\blol\\b|\\bbtw\\b|\\bidk\\b|\\bimo\\b/g.test(text)) score -= 3;
  
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
    result = result.replace(/I think |Perhaps |Maybe |Possibly |It seems like /gi, '');
    result = result.replace(/in my opinion, /gi, '');
    
    // Add direct phrases occasionally
    if (Math.random() < 0.3 && !result.includes('Look,')) {
      result = 'Look, ' + result.charAt(0).toLowerCase() + result.slice(1);
    }
  }
  else if (directness < -5) {
    // More indirect/hedging
    if (!result.match(/I think|Perhaps|Maybe|Possibly|It seems like/gi)) {
      const hedges = ['I think ', 'Perhaps ', 'It seems that ', 'Maybe '];
      const hedge = hedges[Math.floor(Math.random() * hedges.length)];
      result = hedge + result.charAt(0).toLowerCase() + result.slice(1);
    }
  }
  
  // Apply verbosity adjustments
  const verbosity = styleProfile.behavioralPatterns.verbosity;
  if (verbosity > 5) {
    // More verbose
    // Expand certain words with more descriptive alternatives
    result = result.replace(/\\b(good)\\b/gi, 'excellent')
                   .replace(/\\b(bad)\\b/gi, 'unfortunate')
                   .replace(/\\b(nice)\\b/gi, 'delightful');
                   
    // Add transition phrases
    if (result.includes('.') && styleProfile.phrasesAndExpressions.transitions.length > 0) {
      const transitions = styleProfile.phrasesAndExpressions.transitions;
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
    result = result.replace(/\\b(very|really|quite|extremely|absolutely)\\b\\s/gi, '');
    result = result.replace(/in order to/gi, 'to')
                   .replace(/due to the fact that/gi, 'because')
                   .replace(/at this point in time/gi, 'now')
                   .replace(/in the event that/gi, 'if');
  }
  
  // Apply punctuation style
  const exclamationFreq = styleProfile.punctuationStyle.exclamationFrequency;
  if (exclamationFreq > 7 && !result.includes('!')) {
    // Add exclamation points for users who use them frequently
    result = result.replace(/\\.$/g, '!');
  }
  
  const ellipsisUsage = styleProfile.punctuationStyle.ellipsisUsage;
  if (ellipsisUsage > 7 && !result.includes('...')) {
    // Add ellipses for users who use them frequently
    const sentences = result.split('.');
    if (sentences.length > 1) {
      const insertPoint = Math.floor(Math.random() * (sentences.length - 1));
      sentences[insertPoint] = sentences[insertPoint] + '...';
      result = sentences.join('.');
    }
  }
  
  // Add favorite phrases occasionally
  if (styleProfile.phrasesAndExpressions.expressions.length > 0 && Math.random() < 0.3) {
    const expressions = styleProfile.phrasesAndExpressions.expressions;
    const expression = expressions[Math.floor(Math.random() * expressions.length)];
    
    // Avoid duplication
    if (!result.toLowerCase().includes(expression)) {
      // Add the expression in a natural way
      const sentences = result.split('.');
      if (sentences.length > 0) {
        const randomSentence = Math.floor(Math.random() * sentences.length);
        
        // Different ways to incorporate the expression
        const insertionMethods = [
          // At the beginning
          () => { sentences[randomSentence] = expression + ', ' + sentences[randomSentence].trim(); },
          // At the end
          () => { sentences[randomSentence] = sentences[randomSentence].trim() + ' ' + expression; },
          // As a standalone
          () => { sentences.splice(randomSentence, 0, ' ' + expression); }
        ];
        
        // Choose a random insertion method
        const insertMethod = insertionMethods[Math.floor(Math.random() * insertionMethods.length)];
        insertMethod();
        
        result = sentences.join('.');
      }
    }
  }
  
  // Add emojis if the user uses them
  const emojiFreq = styleProfile.emojiStyle.frequency;
  if (emojiFreq > 5 && styleProfile.emojiStyle.favorites.length > 0) {
    // Get appropriate emojis based on emotional tone
    let relevantEmojis = [];
    
    // Apply mood overrides or use base emotional signature
    if (moodOverrides) {
      if (moodOverrides.joy > 7) {
        relevantEmojis = [...styleProfile.emojiStyle.positive];
      } else if (moodOverrides.sadness > 7) {
        relevantEmojis = [...styleProfile.emojiStyle.negative];
      } else {
        relevantEmojis = [...styleProfile.emojiStyle.favorites];
      }
    } else {
      // Default to using favorites
      relevantEmojis = [...styleProfile.emojiStyle.favorites];
    }
    
    if (relevantEmojis.length > 0) {
      const emoji = relevantEmojis[Math.floor(Math.random() * relevantEmojis.length)];
      
      // Add emoji at end of message or sentence
      if (Math.random() < 0.7) {
        // End of message
        result = result + ' ' + emoji;
      } else {
        // End of random sentence
        const sentences = result.split('.');
        if (sentences.length > 1) {
          const randomSentence = Math.floor(Math.random() * (sentences.length - 1));
          sentences[randomSentence] = sentences[randomSentence] + ' ' + emoji;
          result = sentences.join('.');
        }
      }
    }
  }
  
  return result;
};

// Export default interface
export default {
  initializeStyleAnalyzer,
  analyzeText,
  getStyleProfile,
  saveStyleProfile,
  loadStyleProfile,
  adjustEmotionalSignature,
  generateMirroredText
};