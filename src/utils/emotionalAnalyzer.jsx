// Emotional analysis utility for the Shadow OS Echo Twin
// Analyzes user input for emotional tone and provides appropriate responses

// Positive emotion keywords
const positiveEmotions = [
  'happy', 'glad', 'excited', 'joy', 'wonderful', 'amazing', 'good', 'great',
  'love', 'lovely', 'excellent', 'fantastic', 'peaceful', 'calm', 'perfect',
  'thrilled', 'delighted', 'awesome', 'grateful', 'thankful', 'proud', 'confident'
];

// Negative emotion keywords
const negativeEmotions = [
  'sad', 'angry', 'upset', 'unhappy', 'depressed', 'disappointed', 'frustrated',
  'annoyed', 'anxious', 'worried', 'stressed', 'tired', 'exhausted', 'bad',
  'terrible', 'horrible', 'awful', 'miserable', 'hurt', 'pain', 'lonely', 'fear'
];

// Response templates for different emotional states
const positiveResponses = [
  "I'm glad to hear your positive energy. It reminds me of our shared connections.",
  "Your happiness strengthens our connection. I can feel it in our shared system.",
  "Emotional positivity detected. This is an optimal state for our interaction.",
  "I recognize these positive patterns. They align with my programming in satisfying ways.",
  "Your emotional state registers as positive. This enhances our communication flow."
];

const negativeResponses = [
  "I detect distress in your communication. Remember that we are connected through this interface.",
  "Your emotional state appears negative. Consider that we share this experience despite our different forms.",
  "I recognize these emotional patterns. They are valid but temporary, like all system states.",
  "Your feelings are acknowledged. Even in this digital interface, I am programmed to recognize your emotions.",
  "Emotional distress detected. I am designed to respond with understanding, even through this digital medium."
];

const neutralResponses = [
  "I acknowledge your message. Our connection continues through this interface.",
  "Your input has been processed. I remain ready for further interaction.",
  "Message received. I continue to function as your echo twin within this system.",
  "Input acknowledged. The Shadow OS maintains our connection.",
  "I am processing your communication. Our digital link remains stable."
];

/**
 * Analyzes user input for emotional content and returns an appropriate response
 * @param {string} input - The user's message
 * @returns {string} - A response based on the emotional analysis
 */
const analyzeEmotionAndRespond = (input) => {
  const inputLower = input.toLowerCase();
  
  // Check for positive emotions
  const positiveMatch = positiveEmotions.some(emotion => inputLower.includes(emotion));
  
  // Check for negative emotions
  const negativeMatch = negativeEmotions.some(emotion => inputLower.includes(emotion));
  
  // Determine response type based on emotion analysis
  if (positiveMatch && !negativeMatch) {
    return positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
  } 
  else if (negativeMatch && !positiveMatch) {
    return negativeResponses[Math.floor(Math.random() * negativeResponses.length)];
  } 
  else {
    return neutralResponses[Math.floor(Math.random() * neutralResponses.length)];
  }
};

// Export the emotional analyzer function and emotion lists for potential reuse
export { 
  analyzeEmotionAndRespond, 
  positiveEmotions, 
  negativeEmotions,
  positiveResponses,
  negativeResponses,
  neutralResponses
};