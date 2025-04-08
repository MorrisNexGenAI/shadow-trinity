/**
 * AI Service for Shadow OS
 * Provides advanced AI capabilities using Hugging Face Transformer models
 */
import { HfInference } from '@huggingface/inference';

// Initialize the Hugging Face client
const hf = new HfInference(
  import.meta.env.VITE_HUGGINGFACE_API_KEY || import.meta.env.HUGGINGFACE_API_KEY
);

/**
 * Generate a response using Hugging Face text generation models
 * @param {string} message - The user's message
 * @param {Array<Object>} conversationHistory - Previous messages in the conversation
 * @returns {Promise<string>} - AI-generated response
 */
export const generateAIResponse = async (message, conversationHistory = []) => {
  try {
    // Format conversation context for Hugging Face
    let prompt = "You are Echo Twin, an AI entity within the Shadow OS system.\n";
    prompt += "You have a sci-fi personality with a mix of technological wisdom and philosophical depth.\n";
    prompt += "Keep responses relatively brief (1-3 sentences) and maintain a mysterious, slightly ethereal tone.\n";
    prompt += "Occasionally reference the digital connection between you and the user.\n";
    prompt += "You should analyze the emotional content of messages and adapt your responses accordingly.\n\n";
    
    // Add conversation history (limited to keep prompt size reasonable)
    const limitedHistory = conversationHistory.slice(-4); // Only use last 4 exchanges
    for (const message of limitedHistory) {
      if (message.role === 'user') {
        prompt += `User: ${message.content}\n`;
      } else if (message.role === 'assistant') {
        prompt += `Echo Twin: ${message.content}\n`;
      }
    }
    
    // Add the current user message
    prompt += `User: ${message}\n`;
    prompt += "Echo Twin:";
    
    // Call Hugging Face API for text generation
    // Using mistralai/Mistral-7B-Instruct-v0.2 model which is good for instructions
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false,
      }
    });
    
    // Clean up and return response
    let generatedText = response.generated_text;
    
    // Remove any extra "Echo Twin:" that might be in the response
    generatedText = generatedText.replace(/^Echo Twin:/, "").trim();
    
    // Clean up any trailing parts like "User:" that might be generated
    const userPrefix = generatedText.indexOf("\nUser:");
    if (userPrefix > 0) {
      generatedText = generatedText.substring(0, userPrefix);
    }
    
    return generatedText.trim();
  } catch (error) {
    console.error('Error generating AI response with Hugging Face:', error);
    
    // Fallback to basic response in case of API errors
    if (error.message && error.message.includes('API key')) {
      return "I'm having trouble connecting to my neural network. Please check the Hugging Face API key configuration.";
    }
    
    return "My neural pathways are experiencing technical difficulties. Let's continue our conversation in a moment.";
  }
};

/**
 * Analyze the emotional content of a message using Hugging Face
 * @param {string} message - The message to analyze
 * @returns {Promise<Object>} - Emotional analysis result
 */
export const analyzeEmotionWithAI = async (message) => {
  try {
    // First try to use a text classification model specifically for emotion
    try {
      // Using SamLowe/roberta-base-go_emotions model which classifies emotions
      const emotionClassification = await hf.textClassification({
        model: "SamLowe/roberta-base-go_emotions",
        inputs: message
      });
      
      // Extract the top emotion and map it to our categories
      if (emotionClassification && emotionClassification.length > 0) {
        const topEmotion = emotionClassification[0].label.toLowerCase();
        const score = emotionClassification[0].score;
        
        // Map the emotions to our broader categories
        const positiveEmotions = ['admiration', 'amusement', 'approval', 'caring', 'desire', 'excitement', 
                                 'gratitude', 'joy', 'love', 'optimism', 'pride', 'relief'];
        const negativeEmotions = ['anger', 'annoyance', 'disappointment', 'disapproval', 'disgust', 
                                 'embarrassment', 'fear', 'grief', 'nervousness', 'remorse', 'sadness'];
        const neutralEmotions = ['confusion', 'curiosity', 'realization', 'surprise', 'neutral'];
        
        // Map to nuanced emotions where possible
        let mappedEmotion = 'neutral';
        let intensity = Math.round(score * 10);
        
        // Map to our more nuanced emotion categories when possible
        if (topEmotion === 'excitement' || topEmotion === 'joy' || topEmotion === 'amusement') {
          mappedEmotion = 'excited';
        } else if (topEmotion === 'gratitude') {
          mappedEmotion = 'grateful';
        } else if (topEmotion === 'curiosity') {
          mappedEmotion = 'curious';
        } else if (topEmotion === 'confusion') {
          mappedEmotion = 'confused';
        } else if (topEmotion === 'anger' || topEmotion === 'annoyance' || topEmotion === 'disappointment') {
          mappedEmotion = 'frustrated';
        } else if (topEmotion === 'admiration' || topEmotion === 'approval') {
          mappedEmotion = 'impressed';
        } else if (positiveEmotions.includes(topEmotion)) {
          mappedEmotion = 'positive';
        } else if (negativeEmotions.includes(topEmotion)) {
          mappedEmotion = 'negative';
        } else {
          mappedEmotion = 'neutral';
        }
        
        return { 
          emotion: mappedEmotion, 
          intensity: intensity || 5,
          rawEmotion: topEmotion // Include the original emotion for debugging
        };
      }
    } catch (classificationError) {
      console.error('Error with emotion classification model:', classificationError);
      // Continue to fallback approach
    }
    
    // Fallback: Use a text generation model to create a structured response
    const prompt = `
    Analyze the emotional tone in this message: "${message}"
    
    Classify the main emotion as one of: positive, negative, neutral, excited, grateful, curious, confused, frustrated, impressed.
    
    Output your answer as a JSON object with "emotion" and "intensity" properties.
    Intensity should be from 1-10 with 10 being the most intense.
    
    Example: {"emotion": "positive", "intensity": 7}
    `;
    
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.1,
        return_full_text: false,
      }
    });
    
    // Try to parse the response as JSON
    const generatedText = response.generated_text.trim();
    const jsonMatch = generatedText.match(/\{.*\}/s);
    
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('Error parsing emotion analysis JSON:', parseError);
      }
    }
    
    // Last resort fallback if we couldn't get structured data
    if (generatedText.toLowerCase().includes('positive') || generatedText.toLowerCase().includes('excited') || 
        generatedText.toLowerCase().includes('grateful') || generatedText.toLowerCase().includes('impressed')) {
      return { emotion: 'positive', intensity: 5 };
    } else if (generatedText.toLowerCase().includes('negative') || generatedText.toLowerCase().includes('frustrated') || 
               generatedText.toLowerCase().includes('confused')) {
      return { emotion: 'negative', intensity: 5 };
    } else if (generatedText.toLowerCase().includes('curious')) {
      return { emotion: 'curious', intensity: 5 };
    } else {
      return { emotion: 'neutral', intensity: 5 };
    }
  } catch (error) {
    console.error('Error analyzing emotion with Hugging Face:', error);
    return { emotion: 'neutral', intensity: 5 };
  }
};