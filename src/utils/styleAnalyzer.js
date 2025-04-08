/**
 * Style Analyzer for Echo Twin
 * Analyzes user's writing style, phrases, and emotional patterns
 * Part of the VaultMind/Echo Twin architecture described in ShadowTrinity
 */

// For storing processed style information
let styleProfile = {
  // Kairox Layer (emotional states)
  emotionalSignature: {
    joy: 0,
    curiosity: 0, 
    sorrow: 0,
    intensity: 0,
    calm: 0
  },
  
  // Veltrax Layer (tone and behavioral patterns)
  behavioralPatterns: {
    formality: 0,        // Formal vs casual
    verbosity: 0,        // Concise vs elaborate
    expressiveness: 0,   // Reserved vs expressive
    technicalLevel: 0,   // Plain language vs technical
    metaphoricalLevel: 0 // Literal vs metaphorical
  },
  
  // User's unique characteristics
  uniqueMarkers: {
    commonPhrases: [],     // Phrases used repeatedly
    sentenceStructures: [], // Typical sentence patterns
    wordPreferences: {},   // Preferred word choices
    punctuationStyle: {},  // How they use punctuation
    usedEmojis: []         // Emoji patterns
  },
  
  // History of interactions for learning
  interactionMemory: [],
  
  // Connection to user's identity
  ownerIdentity: {
    name: "",
    personalData: {}
  }
};

/**
 * Initialize the style analyzer with user data
 * @param {Object} userData - Data collected during onboarding
 */
export const initializeStyleAnalyzer = (userData) => {
  styleProfile.ownerIdentity.name = userData.name;
  styleProfile.ownerIdentity.personalData = userData;
  
  // Process writing samples to establish baseline style
  if (userData.writingSamples && userData.writingSamples.length > 0) {
    userData.writingSamples.forEach(sample => {
      analyzeText(sample, true); // true = initial analysis
    });
  }
  
  // Incorporate communication preferences
  if (userData.communicationPreferences) {
    if (userData.communicationPreferences.formal) {
      styleProfile.behavioralPatterns.formality += 2;
    }
    if (userData.communicationPreferences.casual) {
      styleProfile.behavioralPatterns.formality -= 2;
    }
    if (userData.communicationPreferences.technical) {
      styleProfile.behavioralPatterns.technicalLevel += 2;
    }
    if (userData.communicationPreferences.creative) {
      styleProfile.behavioralPatterns.metaphoricalLevel += 2;
    }
    if (userData.communicationPreferences.direct) {
      styleProfile.behavioralPatterns.verbosity -= 2;
    }
    if (userData.communicationPreferences.elaborate) {
      styleProfile.behavioralPatterns.verbosity += 2;
    }
  }
  
  // Incorporate emotional tendencies
  if (userData.emotionalTendencies) {
    // Map user's emotional tendencies to our emotional signature
    styleProfile.emotionalSignature.intensity = 
      (userData.emotionalTendencies.passionate || 0) / 2;
    styleProfile.emotionalSignature.calm = 
      (userData.emotionalTendencies.calm || 0) / 2;
    styleProfile.emotionalSignature.joy = 
      (userData.emotionalTendencies.humorous || 0) / 2;
    styleProfile.emotionalSignature.curiosity = 
      (userData.emotionalTendencies.analytical || 0) / 2;
  }
  
  // Add personal phrases
  if (userData.personalPhrases && userData.personalPhrases.length > 0) {
    styleProfile.uniqueMarkers.commonPhrases = 
      [...userData.personalPhrases];
  }
  
  // Save the initialized profile
  saveStyleProfile();
  
  return styleProfile;
};

/**
 * Analyze text to extract style characteristics
 * @param {string} text - Text to analyze
 * @param {boolean} isInitial - Whether this is initial training or ongoing learning
 */
export const analyzeText = (text, isInitial = false) => {
  if (!text || text.trim().length === 0) return;
  
  // Record this interaction for memory
  if (!isInitial) {
    styleProfile.interactionMemory.push({
      text,
      timestamp: Date.now()
    });
    
    // Limit memory size
    if (styleProfile.interactionMemory.length > 100) {
      styleProfile.interactionMemory.shift();
    }
  }
  
  // Analyze sentence structure
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  sentences.forEach(sentence => {
    analyzeSentenceStructure(sentence);
  });
  
  // Analyze word preferences
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  analyzeWordPreferences(words);
  
  // Analyze punctuation style
  analyzePunctuation(text);
  
  // Analyze emoji usage
  analyzeEmojis(text);
  
  // Extract potential common phrases (3-5 word sequences)
  extractPhrases(text);
  
  // Determine writing formality and other behavioral patterns
  analyzeFormality(text);
  
  // Save updated profile
  if (!isInitial) {
    saveStyleProfile();
  }
};

/**
 * Analyze sentence structure
 * @param {string} sentence - Single sentence to analyze
 */
const analyzeSentenceStructure = (sentence) => {
  // Simple structure classification (can be expanded)
  let structure = "";
  
  if (sentence.includes(",")) {
    structure += "complex,";
  } else {
    structure += "simple,";
  }
  
  if (sentence.length > 100) {
    structure += "long";
  } else if (sentence.length > 50) {
    structure += "medium";
  } else {
    structure += "short";
  }
  
  // Check for questions, exclamations
  if (sentence.trim().endsWith("?")) {
    structure += ",question";
  } else if (sentence.trim().endsWith("!")) {
    structure += ",exclamation";
  }
  
  // Add to structure collection if not already present
  if (!styleProfile.uniqueMarkers.sentenceStructures.includes(structure)) {
    styleProfile.uniqueMarkers.sentenceStructures.push(structure);
    // Keep only the most recent 20 structures
    if (styleProfile.uniqueMarkers.sentenceStructures.length > 20) {
      styleProfile.uniqueMarkers.sentenceStructures.shift();
    }
  }
};

/**
 * Analyze word preferences and vocabulary
 * @param {Array<string>} words - Array of words from the text
 */
const analyzeWordPreferences = (words) => {
  // Track word frequency
  words.forEach(word => {
    if (word.length <= 2) return; // Skip very short words
    
    if (!styleProfile.uniqueMarkers.wordPreferences[word]) {
      styleProfile.uniqueMarkers.wordPreferences[word] = 1;
    } else {
      styleProfile.uniqueMarkers.wordPreferences[word]++;
    }
  });
  
  // Limit size of word preferences object
  const entries = Object.entries(styleProfile.uniqueMarkers.wordPreferences);
  if (entries.length > 200) {
    // Sort by frequency and keep top words
    const sortedEntries = entries.sort((a, b) => b[1] - a[1]);
    styleProfile.uniqueMarkers.wordPreferences = Object.fromEntries(sortedEntries.slice(0, 200));
  }
};

/**
 * Analyze punctuation style
 * @param {string} text - Text to analyze for punctuation
 */
const analyzePunctuation = (text) => {
  // Count different types of punctuation
  const punctuationCounts = {
    "!": (text.match(/!/g) || []).length,
    "?": (text.match(/\?/g) || []).length,
    "...": (text.match(/\.\.\./g) || []).length,
    ",": (text.match(/,/g) || []).length,
    ";": (text.match(/;/g) || []).length,
    ":": (text.match(/:/g) || []).length,
    "-": (text.match(/-/g) || []).length,
    "(": (text.match(/\(/g) || []).length,
    ")": (text.match(/\)/g) || []).length,
  };
  
  // Update profile with these counts
  Object.keys(punctuationCounts).forEach(punctuation => {
    if (punctuationCounts[punctuation] > 0) {
      if (!styleProfile.uniqueMarkers.punctuationStyle[punctuation]) {
        styleProfile.uniqueMarkers.punctuationStyle[punctuation] = punctuationCounts[punctuation];
      } else {
        styleProfile.uniqueMarkers.punctuationStyle[punctuation] += punctuationCounts[punctuation];
      }
    }
  });
};

/**
 * Analyze emoji usage
 * @param {string} text - Text to analyze for emoji usage
 */
const analyzeEmojis = (text) => {
  // Regular expression to match emoji characters
  const emojiRegex = /[\p{Emoji}]/gu;
  const emojis = text.match(emojiRegex) || [];
  
  // Add unique emojis to the profile
  emojis.forEach(emoji => {
    if (!styleProfile.uniqueMarkers.usedEmojis.includes(emoji)) {
      styleProfile.uniqueMarkers.usedEmojis.push(emoji);
    }
  });
  
  // Keep list manageable
  if (styleProfile.uniqueMarkers.usedEmojis.length > 50) {
    styleProfile.uniqueMarkers.usedEmojis = styleProfile.uniqueMarkers.usedEmojis.slice(0, 50);
  }
};

/**
 * Extract common phrases the user might use
 * @param {string} text - Text to analyze for common phrases
 */
const extractPhrases = (text) => {
  // Clean the text for processing
  const cleanedText = text.toLowerCase().replace(/[^\w\s]/g, '');
  const words = cleanedText.split(/\s+/);
  
  // Extract 3-word, 4-word, and 5-word phrases
  const phraseLengths = [3, 4, 5];
  
  phraseLengths.forEach(length => {
    if (words.length >= length) {
      for (let i = 0; i <= words.length - length; i++) {
        const phrase = words.slice(i, i + length).join(' ');
        
        // Only consider meaningful phrases (not all common words)
        if (isSignificantPhrase(phrase)) {
          // Check if already in common phrases
          if (!styleProfile.uniqueMarkers.commonPhrases.includes(phrase)) {
            styleProfile.uniqueMarkers.commonPhrases.push(phrase);
          }
        }
      }
    }
  });
  
  // Keep the phrases list manageable
  if (styleProfile.uniqueMarkers.commonPhrases.length > 50) {
    styleProfile.uniqueMarkers.commonPhrases = styleProfile.uniqueMarkers.commonPhrases.slice(-50);
  }
};

/**
 * Determine if a phrase is significant enough to track
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
 * Analyze the formality level and other behavioral patterns in text
 * @param {string} text - Text to analyze
 */
const analyzeFormality = (text) => {
  // Formal language markers
  const formalMarkers = [
    'therefore', 'consequently', 'furthermore', 'additionally', 'however',
    'nevertheless', 'regarding', 'concerning', 'moreover', 'thus',
    'hereby', 'aforementioned', 'shall', 'ought to', 'whom'
  ];
  
  // Casual language markers
  const casualMarkers = [
    'yeah', 'nah', 'cool', 'awesome', 'gonna', 'wanna', 'gotta',
    'kinda', 'sorta', 'totally', 'literally', 'stuff', 'thing',
    'like', 'so', 'just', 'actually', 'basically'
  ];
  
  // Technical language indicators (simplified)
  const technicalMarkers = [
    'accordingly', 'analysis', 'component', 'data', 'effect', 'function',
    'implementation', 'infrastructure', 'methodology', 'paradigm',
    'parameter', 'procedure', 'process', 'protocol', 'scope',
    'significant', 'subsequent', 'technique', 'variable'
  ];
  
  // Metaphorical language indicators
  const metaphoricalMarkers = [
    'like a', 'as if', 'similar to', 'imagine', 'picture', 'envision',
    'world of', 'realm of', 'journey', 'path', 'bridge', 'window to',
    'ocean of', 'mountain of', 'storm of'
  ];
  
  // Convert to lowercase for matching
  const lowerText = text.toLowerCase();
  
  // Count markers
  let formalCount = 0;
  let casualCount = 0;
  let technicalCount = 0;
  let metaphoricalCount = 0;
  
  formalMarkers.forEach(marker => {
    if (lowerText.includes(marker)) formalCount++;
  });
  
  casualMarkers.forEach(marker => {
    if (lowerText.includes(marker)) casualCount++;
  });
  
  technicalMarkers.forEach(marker => {
    if (lowerText.includes(marker)) technicalCount++;
  });
  
  metaphoricalMarkers.forEach(marker => {
    if (lowerText.includes(marker)) metaphoricalCount++;
  });
  
  // Update the style profile (with small increments for gradual learning)
  // Formality (range: -10 to 10, negative = casual, positive = formal)
  if (formalCount > casualCount) {
    styleProfile.behavioralPatterns.formality += 0.2;
  } else if (casualCount > formalCount) {
    styleProfile.behavioralPatterns.formality -= 0.2;
  }
  
  // Technical level (range: 0 to 10)
  if (technicalCount > 0) {
    styleProfile.behavioralPatterns.technicalLevel += 0.2;
  }
  
  // Metaphorical level (range: 0 to 10)
  if (metaphoricalCount > 0) {
    styleProfile.behavioralPatterns.metaphoricalLevel += 0.2;
  }
  
  // Verbosity (based partly on sentence length)
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const avgLength = text.length / sentences.length;
  
  if (avgLength > 100) {
    styleProfile.behavioralPatterns.verbosity += 0.2;
  } else if (avgLength < 40) {
    styleProfile.behavioralPatterns.verbosity -= 0.2;
  }
  
  // Keep values in appropriate ranges
  styleProfile.behavioralPatterns.formality = clamp(styleProfile.behavioralPatterns.formality, -10, 10);
  styleProfile.behavioralPatterns.technicalLevel = clamp(styleProfile.behavioralPatterns.technicalLevel, 0, 10);
  styleProfile.behavioralPatterns.metaphoricalLevel = clamp(styleProfile.behavioralPatterns.metaphoricalLevel, 0, 10);
  styleProfile.behavioralPatterns.verbosity = clamp(styleProfile.behavioralPatterns.verbosity, -10, 10);
};

/**
 * Helper to keep values within a range
 */
const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Save the style profile to localStorage
 */
export const saveStyleProfile = () => {
  try {
    localStorage.setItem('echoTwinStyleProfile', JSON.stringify(styleProfile));
  } catch (error) {
    console.error('Error saving style profile:', error);
  }
};

/**
 * Load the style profile from localStorage
 * @returns {Object} The loaded style profile, or null if not found
 */
export const loadStyleProfile = () => {
  try {
    const savedProfile = localStorage.getItem('echoTwinStyleProfile');
    if (savedProfile) {
      styleProfile = JSON.parse(savedProfile);
      return styleProfile;
    }
  } catch (error) {
    console.error('Error loading style profile:', error);
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
  Object.keys(emotionAdjustments).forEach(emotion => {
    if (styleProfile.emotionalSignature.hasOwnProperty(emotion)) {
      styleProfile.emotionalSignature[emotion] = 
        clamp(styleProfile.emotionalSignature[emotion] + emotionAdjustments[emotion], 0, 10);
    }
  });
  
  saveStyleProfile();
};

/**
 * Generate text mimicking the user's style
 * Core function for Echo Twin's mirroring capability
 * @param {string} baseText - Starting text or template to modify
 * @param {Object} moodOverrides - Optional overrides for emotional state
 * @returns {string} - Text modified to match user's style
 */
export const generateMirroredText = (baseText, moodOverrides = null) => {
  // Start with the base text
  let result = baseText;
  
  // Use mood overrides or current emotional signature
  const currentMood = moodOverrides || styleProfile.emotionalSignature;
  
  // Apply style transformations based on the profile
  
  // 1. Add common phrases if appropriate
  if (Math.random() < 0.3 && styleProfile.uniqueMarkers.commonPhrases.length > 0) {
    const randomPhrase = styleProfile.uniqueMarkers.commonPhrases[
      Math.floor(Math.random() * styleProfile.uniqueMarkers.commonPhrases.length)
    ];
    
    // Only add if it makes sense and isn't already present
    if (!result.toLowerCase().includes(randomPhrase) && result.length > 50) {
      // Choose position - beginning, middle or end
      const position = Math.floor(Math.random() * 3);
      
      if (position === 0) {
        // Add to beginning
        result = randomPhrase.charAt(0).toUpperCase() + randomPhrase.slice(1) + 
                (result.startsWith(randomPhrase) ? "" : ". " + result);
      } else if (position === 1 && result.includes(". ")) {
        // Add to middle at a sentence break
        const sentences = result.split(". ");
        const insertPoint = Math.floor(sentences.length / 2);
        sentences.splice(insertPoint, 0, randomPhrase.charAt(0).toUpperCase() + randomPhrase.slice(1));
        result = sentences.join(". ");
      } else {
        // Add to end
        result = result + (result.endsWith(".") ? " " : ". ") + 
                randomPhrase.charAt(0).toUpperCase() + randomPhrase.slice(1);
      }
    }
  }
  
  // 2. Adjust formality
  if (styleProfile.behavioralPatterns.formality > 5) {
    // Make more formal
    result = result.replace(/gonna/g, "going to")
                  .replace(/wanna/g, "want to")
                  .replace(/gotta/g, "have to")
                  .replace(/kinda/g, "kind of")
                  .replace(/sorta/g, "sort of");
  } else if (styleProfile.behavioralPatterns.formality < -5) {
    // Make more casual
    result = result.replace(/going to/g, "gonna")
                  .replace(/want to/g, "wanna")
                  .replace(/have to/g, "gotta");
  }
  
  // 3. Add emotional markers based on current mood
  if (currentMood.joy > 7) {
    // Add enthusiasm for high joy
    if (!result.endsWith("!") && Math.random() < 0.5) {
      result = result.replace(/\.$/g, "!");
    }
    
    // Add appropriate emoji if user uses them
    if (styleProfile.uniqueMarkers.usedEmojis.length > 0 && Math.random() < 0.3) {
      const happyEmojis = styleProfile.uniqueMarkers.usedEmojis.filter(emoji => 
        ["😊", "😄", "😁", "🙂", "😃", "😀", "👍", "❤️", "✨"].includes(emoji)
      );
      
      if (happyEmojis.length > 0) {
        const emoji = happyEmojis[Math.floor(Math.random() * happyEmojis.length)];
        result += " " + emoji;
      }
    }
  } else if (currentMood.intensity > 7) {
    // Add intensity markers
    if (Math.random() < 0.3 && !result.includes("!")) {
      result = result.replace(/\.$/g, "!");
    }
    
    if (Math.random() < 0.2) {
      result = result.replace(/important/g, "critical")
                    .replace(/good/g, "excellent")
                    .replace(/bad/g, "terrible");
    }
  }
  
  // 4. Adjust punctuation patterns to match user style
  if (Object.keys(styleProfile.uniqueMarkers.punctuationStyle).length > 0) {
    // Get their most used punctuation
    const favoritePunctuation = Object.entries(styleProfile.uniqueMarkers.punctuationStyle)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    if (favoritePunctuation === "..." && !result.includes("...") && Math.random() < 0.3) {
      // Replace some periods with ...
      const sentences = result.split(". ");
      if (sentences.length > 1) {
        const randomSentence = Math.floor(Math.random() * (sentences.length - 1));
        sentences[randomSentence] = sentences[randomSentence] + "...";
        result = sentences.join(" ");
      }
    } else if (favoritePunctuation === "!" && !result.includes("!") && Math.random() < 0.3) {
      // Add an exclamation point
      const sentences = result.split(". ");
      if (sentences.length > 1) {
        const randomSentence = Math.floor(Math.random() * sentences.length);
        sentences[randomSentence] = sentences[randomSentence].replace(/\.$/g, "!");
        result = sentences.join(". ");
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
  loadStyleProfile,
  saveStyleProfile,
  adjustEmotionalSignature,
  generateMirroredText
};