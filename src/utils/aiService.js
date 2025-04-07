/**
 * AI Service for Shadow OS
 * Provides advanced AI capabilities using OpenAI's GPT models
 */
import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side use
});

/**
 * Generate a response using OpenAI's GPT model
 * @param {string} message - The user's message
 * @param {Array<Object>} conversationHistory - Previous messages in the conversation
 * @returns {Promise<string>} - AI-generated response
 */
export const generateAIResponse = async (message, conversationHistory = []) => {
  try {
    // Build the conversation context
    const messages = [
      {
        role: 'system',
        content: `You are Echo Twin, an AI entity within the Shadow OS system. 
                  You have a sci-fi personality with a mix of technological wisdom and philosophical depth.
                  Keep responses relatively brief (1-3 sentences) and maintain a mysterious, slightly ethereal tone.
                  Occasionally reference the digital connection between you and the user.
                  You should analyze the emotional content of messages and adapt your responses accordingly.`
      },
      // Include previous conversation history if available
      ...conversationHistory,
      // Add the current user message
      { role: 'user', content: message }
    ];

    // Call the OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages,
      max_tokens: 150,
      temperature: 0.7,
    });

    // Return the AI-generated response
    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    
    // Fallback to basic response in case of API errors
    if (error.message.includes('API key')) {
      return "I'm having trouble connecting to my neural network. Please check the API key configuration.";
    }
    
    return "My neural pathways are experiencing technical difficulties. Let's continue our conversation in a moment.";
  }
};

/**
 * Analyze the emotional content of a message
 * @param {string} message - The message to analyze
 * @returns {Promise<Object>} - Emotional analysis result
 */
export const analyzeEmotionWithAI = async (message) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Analyze the emotional tone of the following message and classify it as positive, negative, or neutral. Respond with a JSON object with a "emotion" property containing the classification and an "intensity" property (1-10 scale).'
        },
        { role: 'user', content: message }
      ],
      max_tokens: 50,
      temperature: 0.3,
    });
    
    // Parse the response as JSON
    const content = response.choices[0].message.content;
    try {
      return JSON.parse(content);
    } catch (parseError) {
      // Handle case where response isn't proper JSON
      console.error('Error parsing emotion analysis:', parseError);
      const emotion = content.toLowerCase().includes('positive') ? 'positive' 
                    : content.toLowerCase().includes('negative') ? 'negative'
                    : 'neutral';
      return { emotion, intensity: 5 };
    }
  } catch (error) {
    console.error('Error analyzing emotion with AI:', error);
    return { emotion: 'neutral', intensity: 5 };
  }
};