import React, { useState, useEffect } from 'react';
import { addFeedback, addCustomResponse, getTrainingStats } from '../utils/trainableAnalyzer';

/**
 * Training Panel Component
 * Allows users to provide feedback on Echo Twin's responses and add custom response templates
 * Used to improve the local trainable analyzer's accuracy over time
 * 
 * @param {Object} props - Component props
 * @param {Object} props.lastInteraction - The most recent interaction details
 * @param {Function} props.onClose - Function to close the training panel
 */
const TrainingPanel = ({ lastInteraction, onClose }) => {
  // State for emotion feedback
  const [selectedEmotion, setSelectedEmotion] = useState('neutral');
  // State for response quality feedback
  const [wasResponseGood, setWasResponseGood] = useState(true);
  // State for custom response template
  const [customResponse, setCustomResponse] = useState('');
  // State for selected emotion category for custom response
  const [customResponseEmotion, setCustomResponseEmotion] = useState('positive');
  // State for feedback submission status message
  const [feedbackMessage, setFeedbackMessage] = useState('');
  // State for training stats
  const [trainingStats, setTrainingStats] = useState(null);

  // Load training stats on component mount
  useEffect(() => {
    const stats = getTrainingStats();
    setTrainingStats(stats);
  }, []);

  /**
   * Handles the submission of feedback on the last interaction
   */
  const handleSubmitFeedback = () => {
    if (!lastInteraction) {
      setFeedbackMessage('No recent interaction to provide feedback on.');
      return;
    }

    try {
      // Add the feedback to the training data
      addFeedback(
        lastInteraction.message,
        lastInteraction.response,
        selectedEmotion,
        wasResponseGood,
        lastInteraction.analysis // Pass the original analysis data for learning
      );

      // Set success message
      setFeedbackMessage('Feedback submitted successfully! Echo Twin is learning from your input.');
      
      // Reset the form
      setSelectedEmotion('neutral');
      setWasResponseGood(true);

      // Update training stats
      setTrainingStats(getTrainingStats());

      // Clear the message after 3 seconds
      setTimeout(() => {
        setFeedbackMessage('');
      }, 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setFeedbackMessage('Failed to submit feedback. Please try again.');
    }
  };

  /**
   * Handles the addition of a custom response template
   */
  const handleAddCustomResponse = () => {
    if (!customResponse.trim()) {
      setFeedbackMessage('Please enter a custom response template.');
      return;
    }

    try {
      // Add the custom response template
      addCustomResponse(customResponseEmotion, customResponse);

      // Set success message
      setFeedbackMessage('Custom response template added successfully!');
      
      // Reset the form
      setCustomResponse('');

      // Update training stats
      setTrainingStats(getTrainingStats());

      // Clear the message after 3 seconds
      setTimeout(() => {
        setFeedbackMessage('');
      }, 3000);
    } catch (error) {
      console.error("Error adding custom response:", error);
      setFeedbackMessage('Failed to add custom response. Please try again.');
    }
  };

  return (
    <div className="training-panel">
      <div className="training-panel-header">
        <h3>ECHO TWIN TRAINING SYSTEM</h3>
        <button className="close-button" onClick={onClose}>&times;</button>
      </div>

      <div className="training-panel-content">
        {feedbackMessage && (
          <div className="feedback-message">{feedbackMessage}</div>
        )}

        {/* Training Statistics Section */}
        <div className="training-section">
          <h4>TRAINING STATISTICS</h4>
          {trainingStats ? (
            <div className="stats-container">
              <h5>Basic Training Statistics</h5>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Total Interactions:</span>
                  <span className="stat-value">{trainingStats.totalInteractions}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Custom Responses:</span>
                  <span className="stat-value">{trainingStats.customResponseCounts.total}</span>
                </div>
              </div>
              
              <h5>Basic Emotion Examples</h5>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Positive:</span>
                  <span className="stat-value">{trainingStats.emotionCounts.positive || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Negative:</span>
                  <span className="stat-value">{trainingStats.emotionCounts.negative || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Neutral:</span>
                  <span className="stat-value">{trainingStats.emotionCounts.neutral || 0}</span>
                </div>
              </div>
              
              <h5>Nuanced Emotion Examples</h5>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Excited:</span>
                  <span className="stat-value">{trainingStats.emotionCounts.excited || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Grateful:</span>
                  <span className="stat-value">{trainingStats.emotionCounts.grateful || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Curious:</span>
                  <span className="stat-value">{trainingStats.emotionCounts.curious || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Confused:</span>
                  <span className="stat-value">{trainingStats.emotionCounts.confused || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Frustrated:</span>
                  <span className="stat-value">{trainingStats.emotionCounts.frustrated || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Impressed:</span>
                  <span className="stat-value">{trainingStats.emotionCounts.impressed || 0}</span>
                </div>
              </div>
              
              <h5>Learning Progress</h5>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-label">Messages Analyzed:</span>
                  <span className="stat-value">{trainingStats.adaptiveLearning?.messagesAnalyzed || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Pattern Recognition:</span>
                  <span className="stat-value">
                    {trainingStats.adaptiveLearning?.patternRecognition 
                      ? `${(trainingStats.adaptiveLearning.patternRecognition * 100).toFixed(1)}%` 
                      : 'Learning...'}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Improvement Rate:</span>
                  <span className="stat-value">
                    {trainingStats.adaptiveLearning?.improvementRate 
                      ? `${(trainingStats.adaptiveLearning.improvementRate * 100).toFixed(1)}%` 
                      : 'Learning...'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <p>Loading training statistics...</p>
          )}
        </div>

        {/* Last Interaction Feedback Section */}
        <div className="training-section">
          <h4>PROVIDE FEEDBACK</h4>
          
          {lastInteraction ? (
            <div className="last-interaction">
              <p><strong>Your message:</strong> {lastInteraction.message}</p>
              <p><strong>Echo Twin response:</strong> {lastInteraction.response}</p>
              {lastInteraction.analysis && (
                <p><strong>Analysis:</strong> Detected {lastInteraction.analysis.emotion} with {Math.round(lastInteraction.analysis.confidence * 100)}% confidence</p>
              )}
            </div>
          ) : (
            <p>No recent interactions to provide feedback on. Please chat with Echo Twin first.</p>
          )}

          <div className="form-group">
            <label>What was the actual emotional tone of your message?</label>
            <select 
              value={selectedEmotion} 
              onChange={(e) => setSelectedEmotion(e.target.value)}
              disabled={!lastInteraction}
            >
              {/* Basic emotion categories */}
              <optgroup label="Basic Emotions">
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
                <option value="neutral">Neutral</option>
              </optgroup>
              
              {/* Nuanced emotion categories */}
              <optgroup label="Nuanced Emotions">
                <option value="excited">Excited</option>
                <option value="grateful">Grateful</option>
                <option value="curious">Curious</option>
                <option value="confused">Confused</option>
                <option value="frustrated">Frustrated</option>
                <option value="impressed">Impressed</option>
              </optgroup>
            </select>
          </div>

          <div className="form-group">
            <label>Was Echo Twin's response appropriate?</label>
            <div className="radio-group">
              <label>
                <input 
                  type="radio" 
                  checked={wasResponseGood} 
                  onChange={() => setWasResponseGood(true)}
                  disabled={!lastInteraction}
                />
                Yes
              </label>
              <label>
                <input 
                  type="radio" 
                  checked={!wasResponseGood} 
                  onChange={() => setWasResponseGood(false)}
                  disabled={!lastInteraction}
                />
                No
              </label>
            </div>
          </div>

          <button 
            className="submit-feedback-button"
            onClick={handleSubmitFeedback}
            disabled={!lastInteraction}
          >
            SUBMIT FEEDBACK
          </button>
        </div>

        {/* Add Custom Response Section */}
        <div className="training-section">
          <h4>ADD CUSTOM RESPONSE TEMPLATE</h4>
          
          <div className="form-group">
            <label>Emotional Category</label>
            <select 
              value={customResponseEmotion} 
              onChange={(e) => setCustomResponseEmotion(e.target.value)}
            >
              {/* Basic emotion categories */}
              <optgroup label="Basic Emotions">
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
                <option value="neutral">Neutral</option>
              </optgroup>
              
              {/* Nuanced emotion categories */}
              <optgroup label="Nuanced Emotions">
                <option value="excited">Excited</option>
                <option value="grateful">Grateful</option>
                <option value="curious">Curious</option>
                <option value="confused">Confused</option>
                <option value="frustrated">Frustrated</option>
                <option value="impressed">Impressed</option>
              </optgroup>
            </select>
          </div>

          <div className="form-group">
            <label>Custom Response Template</label>
            <textarea
              value={customResponse}
              onChange={(e) => setCustomResponse(e.target.value)}
              placeholder="Enter a response template that Echo Twin can use for messages with this emotional tone..."
            />
          </div>

          <button 
            className="add-response-button"
            onClick={handleAddCustomResponse}
          >
            ADD RESPONSE TEMPLATE
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrainingPanel;