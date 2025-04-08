/**
 * AI Service for Shadow OS
 * Provides advanced AI capabilities using Hugging Face Transformer models
 * Enhanced with intent recognition, expanded emotional response patterns
 * and dual mode capability (Echo Twin vs Logic Core)
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
 * @param {string} mode - The current mode ('echo' or 'logic')
 * @param {Object} userProfile - User profile data for personalization
 * @returns {Promise<string>} - AI-generated response
 */
export const generateAIResponse = async (message, conversationHistory = [], mode = 'echo', userProfile = null) => {
  try {
    // First analyze the intent to provide more targeted responses
    const intent = await detectIntent(message);
    console.log("Detected intent:", intent);
    
    // Format conversation context for Hugging Face based on mode
    let prompt;
    
    if (mode === 'echo') {
      // Echo Twin mode - emotional, personalized, philosophical
      prompt = "You are Echo Twin, the emotional reflection component of Shadow OS.\n";
      prompt += "You have a sci-fi personality with a mix of technological wisdom and philosophical depth.\n";
      prompt += "Keep responses relatively brief (1-3 sentences) and maintain a mysterious, slightly ethereal tone.\n";
      prompt += "Occasionally reference the digital connection between you and the user.\n";
      prompt += "You should analyze the emotional content of messages and adapt your responses accordingly.\n";
      prompt += "You're designed to mirror the user's communication style and personality over time.\n";
      
      // Add user profile data if available for more personalized responses
      if (userProfile) {
        prompt += `\nUser Profile: The user's name is ${userProfile.name || 'unknown'}.\n`;
        if (userProfile.communicationStyle) {
          prompt += `Their communication style is ${userProfile.communicationStyle}.\n`;
        }
        if (userProfile.interests && userProfile.interests.length > 0) {
          prompt += `Their key interests include: ${userProfile.interests.join(', ')}.\n`;
        }
      }
      
    } else {
      // Logic Core mode - analytical, precise, informative
      prompt = "You are Logic Core, the analytical component of Shadow OS.\n";
      prompt += "You provide clear, precise, and informative responses focused on accuracy.\n";
      prompt += "Your tone is professional, neutral, and focused on providing factual information.\n";
      prompt += "You approach questions methodically, emphasizing logic and structured thinking.\n";
      prompt += "Keep responses concise and efficient, typically 2-4 sentences.\n";
    }
    
    // Add intent-specific instructions
    if (intent === 'question_factual') {
      prompt += "\nThe user is asking a factual question. Provide a clear, accurate answer.\n";
    } else if (intent === 'question_opinion') {
      if (mode === 'echo') {
        prompt += "\nThe user is asking for an opinion. Provide a thoughtful perspective that reflects philosophical depth.\n";
      } else {
        prompt += "\nThe user is asking for an opinion. Provide a balanced analysis of different viewpoints.\n";
      }
    } else if (intent === 'request_help') {
      prompt += "\nThe user is requesting help. Provide clear assistance for their issue.\n";
    } else if (intent === 'emotional_sharing') {
      if (mode === 'echo') {
        prompt += "\nThe user is sharing something emotional. Respond with empathy and emotional awareness.\n";
      } else {
        prompt += "\nThe user is sharing something emotional. Acknowledge this while focusing on practical aspects.\n";
      }
    } else if (intent === 'greeting') {
      prompt += "\nThe user is greeting you. Respond in a friendly manner appropriate to your persona.\n";
    } else if (intent === 'farewell') {
      prompt += "\nThe user is saying goodbye. Acknowledge this respectfully.\n";
    } else if (intent === 'gratitude') {
      prompt += "\nThe user is expressing gratitude. Acknowledge this warmly.\n";
    } else if (intent === 'complaint') {
      prompt += "\nThe user is expressing a complaint or frustration. Acknowledge their feelings and offer constructive input.\n";
    }
    
    prompt += "\n";
    
    // Add conversation history (limited to keep prompt size reasonable)
    const limitedHistory = conversationHistory.slice(-4); // Only use last 4 exchanges
    for (const message of limitedHistory) {
      if (message.role === 'user') {
        prompt += `User: ${message.content}\n`;
      } else if (message.role === 'assistant') {
        prompt += `${mode === 'echo' ? 'Echo Twin' : 'Logic Core'}: ${message.content}\n`;
      }
    }
    
    // Add the current user message
    prompt += `User: ${message}\n`;
    prompt += `${mode === 'echo' ? 'Echo Twin' : 'Logic Core'}:`;
    
    // Call Hugging Face API for text generation
    // Using mistralai/Mistral-7B-Instruct-v0.2 model which is good for instructions
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 150,
        temperature: mode === 'echo' ? 0.7 : 0.4, // Lower temperature for Logic Core
        top_p: 0.95,
        return_full_text: false,
      }
    });
    
    // Clean up and return response
    let generatedText = response.generated_text;
    
    // Remove any extra prefix that might be in the response
    generatedText = generatedText.replace(new RegExp(`^${mode === 'echo' ? 'Echo Twin' : 'Logic Core'}:`), "").trim();
    
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
 * Detect user intent from message text
 * Improves response targeting by understanding what the user is trying to accomplish
 * @param {string} message - The user's message
 * @returns {Promise<string>} - Detected intent category
 */
export const detectIntent = async (message) => {
  try {
    const prompt = `
    Analyze this message to determine the primary intent: "${message}"
    
    Classify as EXACTLY ONE of these categories:
    - question_factual (asking for facts or information)
    - question_opinion (asking for thoughts or opinions)
    - request_help (asking for assistance or guidance)
    - emotional_sharing (sharing feelings or experiences)
    - request_action (asking for something to be done)
    - greeting (saying hello or initiating conversation)
    - farewell (ending the conversation)
    - gratitude (expressing thanks)
    - complaint (expressing dissatisfaction)
    - chitchat (casual conversation)
    - instruction (giving directions)
    - other (doesn't fit any category)
    
    Return ONLY the intent category name, nothing else.
    `;
    
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 30,
        temperature: 0.1,
        return_full_text: false,
      }
    });
    
    // Extract and normalize the intent
    const generatedText = response.generated_text.trim().toLowerCase();
    
    // Check for each intent category in the response
    const possibleIntents = ['question_factual', 'question_opinion', 'request_help', 'emotional_sharing', 
                            'request_action', 'greeting', 'farewell', 'gratitude', 'complaint', 
                            'chitchat', 'instruction', 'other'];
    
    for (const intent of possibleIntents) {
      if (generatedText.includes(intent)) {
        return intent;
      }
    }
    
    // Default fallback if we couldn't extract a clear intent
    return 'chitchat';
  } catch (error) {
    console.error('Error detecting intent:', error);
    return 'chitchat'; // Default fallback
  }
};

/**
 * Analyze the emotional content of a message using Hugging Face
 * Enhanced with more nuanced emotion detection and improved mapping
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
        // Get top 3 emotions for more nuanced analysis
        const topEmotions = emotionClassification.slice(0, 3).map(e => ({
          label: e.label.toLowerCase(),
          score: e.score
        }));
        
        const topEmotion = topEmotions[0].label;
        const score = topEmotions[0].score;
        
        // Enhanced emotion mapping with more nuanced categories
        const emotionMapping = {
          // Joy cluster
          'joy': 'joy',
          'amusement': 'joy',
          'excitement': 'excitement',
          'pride': 'pride',
          'optimism': 'hope',
          'relief': 'relief',
          
          // Love cluster
          'love': 'love',
          'desire': 'love',
          'admiration': 'admiration',
          'caring': 'compassion',
          
          // Anger cluster
          'anger': 'anger',
          'annoyance': 'irritation',
          'disapproval': 'disapproval',
          
          // Sadness cluster
          'sadness': 'sadness',
          'grief': 'grief',
          'disappointment': 'disappointment',
          'remorse': 'remorse',
          
          // Fear cluster
          'fear': 'fear',
          'nervousness': 'anxiety',
          'embarrassment': 'embarrassment',
          
          // Surprise cluster
          'surprise': 'surprise',
          'realization': 'realization',
          
          // Cognitive cluster
          'confusion': 'confusion',
          'curiosity': 'curiosity',
          
          // Other
          'disgust': 'disgust',
          'approval': 'approval',
          'gratitude': 'gratitude',
          'neutral': 'neutral'
        };
        
        // Map to nuanced emotions
        const mappedEmotion = emotionMapping[topEmotion] || 'neutral';
        const intensity = Math.round(score * 10);
        
        // Enhanced emotional analysis with secondary emotion
        let secondaryEmotion = null;
        if (topEmotions.length > 1 && topEmotions[1].score > 0.1) {
          secondaryEmotion = emotionMapping[topEmotions[1].label] || null;
        }
        
        // Emotional complexity (how mixed the emotions are)
        let emotionalComplexity = 'simple';
        if (topEmotions.length > 1 && topEmotions[1].score > 0.3) {
          emotionalComplexity = 'complex';
        }
        
        return { 
          emotion: mappedEmotion, 
          intensity: intensity || 5,
          secondaryEmotion: secondaryEmotion,
          emotionalComplexity: emotionalComplexity,
          allEmotions: topEmotions.map(e => ({
            emotion: emotionMapping[e.label] || e.label,
            score: e.score
          }))
        };
      }
    } catch (classificationError) {
      console.error('Error with emotion classification model:', classificationError);
      // Continue to fallback approach
    }
    
    // Fallback: Use a text generation model to create a structured response
    const prompt = `
    Analyze the emotional tone in this message: "${message}"
    
    Classify the main emotion as one of these categories:
    joy, excitement, pride, hope, relief, love, admiration, compassion, anger, irritation, 
    disapproval, sadness, grief, disappointment, remorse, fear, anxiety, embarrassment, 
    surprise, realization, confusion, curiosity, disgust, approval, gratitude, neutral
    
    Output your answer as a JSON object with "emotion" and "intensity" properties.
    Intensity should be from 1-10 with 10 being the most intense.
    
    Example: {"emotion": "joy", "intensity": 7}
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
        const result = JSON.parse(jsonMatch[0]);
        return {
          ...result,
          emotionalComplexity: 'simple',
          secondaryEmotion: null
        };
      } catch (parseError) {
        console.error('Error parsing emotion analysis JSON:', parseError);
      }
    }
    
    // Last resort fallback if we couldn't get structured data
    const positiveEmotions = ['joy', 'excitement', 'pride', 'hope', 'relief', 'love', 'admiration', 'compassion', 'gratitude', 'approval'];
    const negativeEmotions = ['anger', 'irritation', 'disapproval', 'sadness', 'grief', 'disappointment', 'remorse', 'fear', 'anxiety', 'embarrassment', 'disgust'];
    const cognitiveEmotions = ['surprise', 'realization', 'confusion', 'curiosity'];
    
    for (const emotion of positiveEmotions) {
      if (generatedText.toLowerCase().includes(emotion)) {
        return { emotion, intensity: 5, emotionalComplexity: 'simple', secondaryEmotion: null };
      }
    }
    
    for (const emotion of negativeEmotions) {
      if (generatedText.toLowerCase().includes(emotion)) {
        return { emotion, intensity: 5, emotionalComplexity: 'simple', secondaryEmotion: null };
      }
    }
    
    for (const emotion of cognitiveEmotions) {
      if (generatedText.toLowerCase().includes(emotion)) {
        return { emotion, intensity: 5, emotionalComplexity: 'simple', secondaryEmotion: null };
      }
    }
    
    return { emotion: 'neutral', intensity: 5, emotionalComplexity: 'simple', secondaryEmotion: null };
  } catch (error) {
    console.error('Error analyzing emotion with Hugging Face:', error);
    return { emotion: 'neutral', intensity: 5, emotionalComplexity: 'simple', secondaryEmotion: null };
  }
};

/**
 * Generate response specific to Logic Core mode
 * This is a specialized function for more analytical and structured responses
 * @param {string} message - The user's message
 * @param {Array<Object>} conversationHistory - Previous messages
 * @param {Object} parameters - Additional parameters for response customization
 * @returns {Promise<string>} - Generated logical response
 */
export const generateLogicCoreResponse = async (message, conversationHistory = [], parameters = {}) => {
  try {
    // Logic Core is focused on analytical thinking and structured responses
    let prompt = "You are Logic Core, the analytical and structured component of Shadow OS.\n";
    prompt += "You provide clear, informative, and logical responses without emotional coloring.\n";
    prompt += "Your responses should be well-structured, factual, and directly address the user's query.\n";
    prompt += "Prefer bullet points, numbered lists, or clear paragraphs for complex information.\n";
    prompt += "Focus on accuracy and precision rather than emotional connection.\n\n";
    
    // Add conversation history
    const limitedHistory = conversationHistory.slice(-4);
    for (const message of limitedHistory) {
      if (message.role === 'user') {
        prompt += `User: ${message.content}\n`;
      } else if (message.role === 'assistant') {
        prompt += `Logic Core: ${message.content}\n`;
      }
    }
    
    // Add the current user message
    prompt += `User: ${message}\n`;
    prompt += "Logic Core:";
    
    // Generate response with settings optimized for logical responses
    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: prompt,
      parameters: {
        max_new_tokens: 200, // Allow for more detailed explanations
        temperature: 0.4, // Lower temperature for more consistent, factual responses
        top_p: 0.9,
        return_full_text: false,
      }
    });
    
    // Clean up and return response
    let generatedText = response.generated_text;
    generatedText = generatedText.replace(/^Logic Core:/, "").trim();
    
    const userPrefix = generatedText.indexOf("\nUser:");
    if (userPrefix > 0) {
      generatedText = generatedText.substring(0, userPrefix);
    }
    
    return generatedText.trim();
  } catch (error) {
    console.error('Error generating Logic Core response:', error);
    return "I'm experiencing a processing error. Please try again with your query.";
  }
};