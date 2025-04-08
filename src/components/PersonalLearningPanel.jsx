import { useState, useEffect } from 'react';
import '../styles/PersonalLearningPanel.css';

// Import the learning system
import { 
  getLearningStats, 
  setLearningMode, 
  getLearningMode,
  clearLearningData
} from '../utils/personalLearningSystem.js';

/**
 * PersonalLearningPanel Component
 * Displays learning metrics and allows the user to configure Echo Twin's learning
 */
const PersonalLearningPanel = ({ onClose }) => {
  const [stats, setStats] = useState(null);
  const [learningMode, setLearningModeState] = useState('active');
  const [confirmClear, setConfirmClear] = useState(false);
  
  // Load initial stats
  useEffect(() => {
    const currentStats = getLearningStats();
    setStats(currentStats);
    setLearningModeState(getLearningMode());
  }, []);
  
  // Handle learning mode change
  const handleModeChange = (mode) => {
    setLearningMode(mode);
    setLearningModeState(mode);
    setStats(getLearningStats());
  };
  
  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Handle clearing all learning data
  const handleClearData = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    
    clearLearningData();
    setStats(getLearningStats());
    setConfirmClear(false);
  };
  
  return (
    <div className="learning-panel">
      <div className="learning-panel-header">
        <h3>Echo Twin Learning System</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="learning-panel-content">
        {stats ? (
          <>
            <div className="learning-section">
              <h4>Learning Status</h4>
              <div className="status-grid">
                <div className="status-item">
                  <span className="status-label">Mode</span>
                  <span className={`status-value mode-${learningMode}`}>
                    {learningMode === 'active' ? 'Active Learning' : 
                     learningMode === 'passive' ? 'Passive Learning' : 'Disabled'}
                  </span>
                </div>
                
                <div className="status-item">
                  <span className="status-label">Total Interactions</span>
                  <span className="status-value">{stats.totalInteractions}</span>
                </div>
                
                <div className="status-item">
                  <span className="status-label">Feedback Given</span>
                  <span className="status-value">
                    {stats.positiveFeedback + stats.negativeFeedback}
                  </span>
                </div>
                
                <div className="status-item">
                  <span className="status-label">Learning Trend</span>
                  <span className={`status-value trend-${stats.trend}`}>
                    {stats.trend === 'improving' ? 'Improving' : 
                     stats.trend === 'needs_improvement' ? 'Needs Work' : 'Stable'}
                  </span>
                </div>
              </div>
              
              {stats.totalInteractions > 0 && (
                <div className="interaction-details">
                  <p>Last interaction: {formatTimestamp(stats.lastInteractionTime)}</p>
                  <div className="learning-metric">
                    <span>Feedback Effectiveness</span>
                    <div className="progress-bar">
                      <div 
                        className="progress-value" 
                        style={{ width: `${stats.feedbackRatio}%` }}
                      ></div>
                    </div>
                    <span>{stats.feedbackRatio}%</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="learning-section">
              <h4>Configure Learning</h4>
              <p className="section-description">
                Control how Echo Twin learns from your interactions.
              </p>
              
              <div className="mode-selection">
                <div 
                  className={`mode-option ${learningMode === 'active' ? 'selected' : ''}`}
                  onClick={() => handleModeChange('active')}
                >
                  <div className="mode-icon active-icon"></div>
                  <div className="mode-details">
                    <h5>Active Learning</h5>
                    <p>Echo Twin learns from every interaction and continuously updates its style to match yours.</p>
                  </div>
                </div>
                
                <div 
                  className={`mode-option ${learningMode === 'passive' ? 'selected' : ''}`}
                  onClick={() => handleModeChange('passive')}
                >
                  <div className="mode-icon passive-icon"></div>
                  <div className="mode-details">
                    <h5>Passive Learning</h5>
                    <p>Only learns from interactions where you provide direct feedback.</p>
                  </div>
                </div>
                
                <div 
                  className={`mode-option ${learningMode === 'disabled' ? 'selected' : ''}`}
                  onClick={() => handleModeChange('disabled')}
                >
                  <div className="mode-icon disabled-icon"></div>
                  <div className="mode-details">
                    <h5>Disable Learning</h5>
                    <p>No additional learning occurs. Echo Twin uses its current understanding of your style.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="learning-section">
              <h4>Learning Data Management</h4>
              <p className="section-description">
                Manage the data Echo Twin has learned from your interactions.
              </p>
              
              <div className="data-management">
                <p>
                  Echo Twin has recorded {stats.totalInteractions} interactions 
                  and received feedback {stats.positiveFeedback + stats.negativeFeedback} times.
                </p>
                
                <button 
                  className={`clear-data-button ${confirmClear ? 'confirm' : ''}`}
                  onClick={handleClearData}
                >
                  {confirmClear ? 'Confirm Reset (This Cannot Be Undone)' : 'Reset Learning Data'}
                </button>
                
                {confirmClear && (
                  <button 
                    className="cancel-button"
                    onClick={() => setConfirmClear(false)}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="loading-state">
            <p>Loading learning metrics...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalLearningPanel;