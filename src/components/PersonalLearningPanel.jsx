import React, { useState, useEffect } from 'react';
import { 
  getLearningStats, 
  setLearningMode, 
  getLearningMode,
  clearLearningData
} from '../utils/personalLearningSystem';
import { 
  getIdentityProfile, 
  getIdentityEvolution,
  resetIdentityProfile
} from '../utils/deepIdentityProfiler';
import {
  getStyleProfile,
  adjustEmotionalSignature
} from '../utils/styleAnalyzer';

/**
 * Panel for managing and viewing the personal learning system
 * Allows users to control how their Echo Twin learns and evolves
 */
const PersonalLearningPanel = ({ onClose, userData }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [learningMode, setLearningModeState] = useState('active');
  const [identityProfile, setIdentityProfile] = useState(null);
  const [styleProfile, setStyleProfile] = useState(null);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  // Load data on mount
  useEffect(() => {
    refreshData();
  }, []);
  
  // Refresh all data
  const refreshData = () => {
    // Get learning stats
    const learningStats = getLearningStats();
    setStats(learningStats);
    
    // Get current learning mode
    const mode = getLearningMode();
    setLearningModeState(mode);
    
    // Get identity profile
    const identity = getIdentityProfile();
    setIdentityProfile(identity);
    
    // Get style profile
    const style = getStyleProfile();
    setStyleProfile(style);
  };
  
  // Handle learning mode change
  const handleModeChange = (mode) => {
    setLearningMode(mode);
    setLearningModeState(mode);
    
    setFeedbackMessage(`Learning mode changed to ${mode}.`);
    setTimeout(() => setFeedbackMessage(''), 3000);
  };
  
  // Handle emotional signature adjustment
  const handleEmotionAdjust = (emotion, value) => {
    adjustEmotionalSignature({ [emotion]: value });
    
    setFeedbackMessage(`Emotional signature adjusted for ${emotion}.`);
    setTimeout(() => {
      setFeedbackMessage('');
      refreshData();
    }, 2000);
  };
  
  // Handle system reset
  const handleReset = () => {
    if (!confirmingReset) {
      setConfirmingReset(true);
      return;
    }
    
    // Reset all learning data
    clearLearningData();
    resetIdentityProfile();
    
    setFeedbackMessage('All learning data has been reset.');
    setConfirmingReset(false);
    
    setTimeout(() => {
      refreshData();
      setFeedbackMessage('');
    }, 2000);
  };
  
  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };
  
  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'identity':
        return renderIdentityTab();
      case 'style':
        return renderStyleTab();
      case 'settings':
        return renderSettingsTab();
      default:
        return renderOverviewTab();
    }
  };
  
  // Render overview tab
  const renderOverviewTab = () => {
    if (!stats) return <div>Loading stats...</div>;
    
    return (
      <div className="tab-content overview-tab">
        <h4>Learning Progress</h4>
        <div className="stats-container">
          <h5>Identity Mirror Statistics</h5>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Total Samples</div>
              <div className="stat-value">{stats.totalSamples}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Adaptations</div>
              <div className="stat-value">{stats.adaptations}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Confidence</div>
              <div className="stat-value">{Math.round(stats.confidenceScore * 100)}%</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Last Updated</div>
              <div className="stat-value">{formatDate(stats.lastLearningTimestamp)}</div>
            </div>
          </div>
          
          <h5>Feedback Summary</h5>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Positive</div>
              <div className="stat-value">{stats.feedbackStats.positive}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Negative</div>
              <div className="stat-value">{stats.feedbackStats.negative}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Neutral</div>
              <div className="stat-value">{stats.feedbackStats.neutral}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Corrections</div>
              <div className="stat-value">{stats.feedbackStats.corrections}</div>
            </div>
          </div>
          
          <h5>Memory System</h5>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Topics</div>
              <div className="stat-value">{stats.memoryStats.topicCount}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Timeline Entries</div>
              <div className="stat-value">{stats.memoryStats.timelineEntries}</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Emotional Traces</div>
              <div className="stat-value">{stats.memoryStats.emotionalTraceCount}</div>
            </div>
          </div>
        </div>
        
        <div className="current-mode">
          <h4>Current Learning Mode</h4>
          <div className={`mode-indicator ${learningMode}`}>
            {learningMode === 'active' ? 'Active Learning' : 
             learningMode === 'passive' ? 'Passive Learning' : 'Learning Disabled'}
          </div>
          <p className="mode-description">
            {learningMode === 'active' ? 
              'Echo Twin is actively learning from all interactions to improve its mirroring of your identity.' : 
             learningMode === 'passive' ? 
              'Echo Twin is recording interactions but not actively adapting its behavior.' : 
              'Echo Twin is not learning or adapting to new interactions.'}
          </p>
        </div>
      </div>
    );
  };
  
  // Render identity tab
  const renderIdentityTab = () => {
    if (!identityProfile) return <div>Loading identity profile...</div>;
    
    return (
      <div className="tab-content identity-tab">
        <h4>Identity Mirror</h4>
        <p className="identity-description">
          Your identity profile is a detailed neural map of your communication patterns, preferences, 
          and personal characteristics. Echo Twin uses this to mimic your unique expression style.
        </p>
        
        <div className="identity-sections">
          <div className="identity-section">
            <h5>Communication Patterns</h5>
            <div className="pattern-grid">
              <div className="pattern-item">
                <div className="pattern-label">Directness</div>
                <div className="pattern-bar">
                  <div 
                    className="pattern-fill" 
                    style={{ 
                      width: `${Math.min(Math.max((identityProfile.communicationPatterns.directness + 5) * 10, 0), 100)}%`,
                      backgroundColor: identityProfile.communicationPatterns.directness > 0 ? '#00bfff' : '#ff5e3a'
                    }}
                  ></div>
                </div>
                <div className="pattern-value">{identityProfile.communicationPatterns.directness.toFixed(1)}</div>
              </div>
              
              <div className="pattern-item">
                <div className="pattern-label">Formality</div>
                <div className="pattern-bar">
                  <div 
                    className="pattern-fill" 
                    style={{ 
                      width: `${Math.min(Math.max((identityProfile.communicationPatterns.formality + 5) * 10, 0), 100)}%`,
                      backgroundColor: identityProfile.communicationPatterns.formality > 0 ? '#00bfff' : '#ff5e3a'
                    }}
                  ></div>
                </div>
                <div className="pattern-value">{identityProfile.communicationPatterns.formality.toFixed(1)}</div>
              </div>
              
              <div className="pattern-item">
                <div className="pattern-label">Expressiveness</div>
                <div className="pattern-bar">
                  <div 
                    className="pattern-fill" 
                    style={{ 
                      width: `${Math.min(Math.max((identityProfile.communicationPatterns.expansiveness + 5) * 10, 0), 100)}%`,
                      backgroundColor: identityProfile.communicationPatterns.expansiveness > 0 ? '#00bfff' : '#ff5e3a'
                    }}
                  ></div>
                </div>
                <div className="pattern-value">{identityProfile.communicationPatterns.expansiveness.toFixed(1)}</div>
              </div>
            </div>
          </div>
          
          <div className="identity-section">
            <h5>Personality Markers</h5>
            <div className="pattern-grid">
              <div className="pattern-item">
                <div className="pattern-label">Openness</div>
                <div className="pattern-bar">
                  <div 
                    className="pattern-fill" 
                    style={{ 
                      width: `${Math.min(Math.max((identityProfile.personalityMarkers.openness + 5) * 10, 0), 100)}%`,
                      backgroundColor: '#00bfff'
                    }}
                  ></div>
                </div>
                <div className="pattern-value">{identityProfile.personalityMarkers.openness.toFixed(1)}</div>
              </div>
              
              <div className="pattern-item">
                <div className="pattern-label">Extraversion</div>
                <div className="pattern-bar">
                  <div 
                    className="pattern-fill" 
                    style={{ 
                      width: `${Math.min(Math.max((identityProfile.personalityMarkers.extraversion + 5) * 10, 0), 100)}%`,
                      backgroundColor: '#00bfff'
                    }}
                  ></div>
                </div>
                <div className="pattern-value">{identityProfile.personalityMarkers.extraversion.toFixed(1)}</div>
              </div>
            </div>
          </div>
          
          <div className="identity-section">
            <h5>Personal Context</h5>
            <div className="personal-context">
              <div className="context-item">
                <strong>Name:</strong> {identityProfile.personalContext.name || 'Not set'}
              </div>
              
              {identityProfile.personalContext.interests && 
               identityProfile.personalContext.interests.length > 0 && (
                <div className="context-item">
                  <strong>Interests:</strong> 
                  <div className="tag-list">
                    {identityProfile.personalContext.interests.map((interest, idx) => (
                      <span key={idx} className="interest-tag small">{interest}</span>
                    ))}
                  </div>
                </div>
              )}
              
              {identityProfile.personalContext.occupation && (
                <div className="context-item">
                  <strong>Occupation:</strong> {identityProfile.personalContext.occupation}
                </div>
              )}
            </div>
          </div>
          
          <div className="identity-section">
            <h5>Linguistic Signatures</h5>
            <div className="linguistic-signatures">
              <div className="signature-item">
                <strong>Vocabulary Complexity:</strong> {identityProfile.linguisticSignatures.wordComplexity.toFixed(2)}
              </div>
              
              <div className="signature-item">
                <strong>Sentence Structure:</strong>
                <div>Average length: {Math.round(identityProfile.linguisticSignatures.sentenceLength.reduce((a, b) => a + b, 0) / 
                  Math.max(identityProfile.linguisticSignatures.sentenceLength.length, 1))} words</div>
              </div>
              
              <div className="signature-item">
                <strong>Favorite Words:</strong>
                <div className="favorite-words">
                  {Object.entries(identityProfile.linguisticSignatures.favoriteWords)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([word, count], idx) => (
                      <span key={idx} className="favorite-word">{word}</span>
                    ))}
                </div>
              </div>
              
              <div className="signature-item">
                <strong>Unique Expressions:</strong>
                <div className="expressions-list">
                  {identityProfile.linguisticSignatures.uniqueExpressions.slice(0, 3).map((exp, idx) => (
                    <div key={idx} className="expression-item">"{exp}"</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render style tab
  const renderStyleTab = () => {
    if (!styleProfile) return <div>Loading style profile...</div>;
    
    return (
      <div className="tab-content style-tab">
        <h4>Expression Style</h4>
        <p className="style-description">
          Your expression style profile captures how you communicate and helps Echo Twin
          mirror your unique way of expressing yourself in text.
        </p>
        
        <div className="style-sections">
          <div className="style-section">
            <h5>Behavioral Patterns</h5>
            <div className="pattern-grid">
              <div className="pattern-item">
                <div className="pattern-label">Formality</div>
                <div className="pattern-bar">
                  <div 
                    className="pattern-fill" 
                    style={{ 
                      width: `${Math.min(Math.max((styleProfile.behavioralPatterns.formality + 10) * 5, 0), 100)}%`,
                      backgroundColor: styleProfile.behavioralPatterns.formality > 0 ? '#00bfff' : '#ff9500'
                    }}
                  ></div>
                </div>
                <div className="pattern-endpoints">
                  <span>Casual</span>
                  <span>Formal</span>
                </div>
              </div>
              
              <div className="pattern-item">
                <div className="pattern-label">Directness</div>
                <div className="pattern-bar">
                  <div 
                    className="pattern-fill" 
                    style={{ 
                      width: `${Math.min(Math.max((styleProfile.behavioralPatterns.directness + 10) * 5, 0), 100)}%`,
                      backgroundColor: styleProfile.behavioralPatterns.directness > 0 ? '#00bfff' : '#ff9500'
                    }}
                  ></div>
                </div>
                <div className="pattern-endpoints">
                  <span>Indirect</span>
                  <span>Direct</span>
                </div>
              </div>
              
              <div className="pattern-item">
                <div className="pattern-label">Verbosity</div>
                <div className="pattern-bar">
                  <div 
                    className="pattern-fill" 
                    style={{ 
                      width: `${Math.min(Math.max((styleProfile.behavioralPatterns.verbosity + 10) * 5, 0), 100)}%`,
                      backgroundColor: styleProfile.behavioralPatterns.verbosity > 0 ? '#00bfff' : '#ff9500'
                    }}
                  ></div>
                </div>
                <div className="pattern-endpoints">
                  <span>Concise</span>
                  <span>Verbose</span>
                </div>
              </div>
              
              <div className="pattern-item">
                <div className="pattern-label">Emotional Expression</div>
                <div className="pattern-bar">
                  <div 
                    className="pattern-fill" 
                    style={{ 
                      width: `${Math.min(Math.max(styleProfile.behavioralPatterns.emotionalExpression * 10, 0), 100)}%`,
                      backgroundColor: '#00bfff'
                    }}
                  ></div>
                </div>
                <div className="pattern-endpoints">
                  <span>Reserved</span>
                  <span>Expressive</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="style-section">
            <h5>Punctuation Style</h5>
            <div className="pattern-grid">
              <div className="pattern-item">
                <div className="pattern-label">Exclamations</div>
                <div className="pattern-bar">
                  <div 
                    className="pattern-fill" 
                    style={{ 
                      width: `${Math.min(Math.max(styleProfile.punctuationStyle.exclamationFrequency * 10, 0), 100)}%`,
                      backgroundColor: '#ff9500'
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="pattern-item">
                <div className="pattern-label">Ellipses (...)</div>
                <div className="pattern-bar">
                  <div 
                    className="pattern-fill" 
                    style={{ 
                      width: `${Math.min(Math.max(styleProfile.punctuationStyle.ellipsisUsage * 10, 0), 100)}%`,
                      backgroundColor: '#ff9500'
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="pattern-item">
                <div className="pattern-label">Commas</div>
                <div className="pattern-bar">
                  <div 
                    className="pattern-fill" 
                    style={{ 
                      width: `${Math.min(Math.max(styleProfile.punctuationStyle.commaFrequency * 10, 0), 100)}%`,
                      backgroundColor: '#ff9500'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="style-section">
            <h5>Vocabulary Profile</h5>
            <div className="pattern-grid">
              <div className="pattern-item">
                <div className="pattern-label">Complexity</div>
                <div className="pattern-bar">
                  <div 
                    className="pattern-fill" 
                    style={{ 
                      width: `${Math.min(Math.max(styleProfile.vocabularyProfile.complexity * 10, 0), 100)}%`,
                      backgroundColor: '#00bfff'
                    }}
                  ></div>
                </div>
              </div>
              
              <div className="pattern-item">
                <div className="pattern-label">Diversity</div>
                <div className="pattern-bar">
                  <div 
                    className="pattern-fill" 
                    style={{ 
                      width: `${Math.min(Math.max(styleProfile.vocabularyProfile.diversity * 10, 0), 100)}%`,
                      backgroundColor: '#00bfff'
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            <div className="favorite-words-section">
              <strong>Favorite Words:</strong>
              <div className="favorite-words">
                {Object.entries(styleProfile.vocabularyProfile.favoriteWords)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 7)
                  .map(([word, count], idx) => (
                    <span key={idx} className="favorite-word">{word} ({count})</span>
                  ))}
              </div>
            </div>
          </div>
          
          <div className="style-section">
            <h5>Common Phrases</h5>
            <div className="phrases-list">
              {styleProfile.phrasesAndExpressions.expressions.length > 0 ? (
                <div className="phrases-group">
                  <strong>Expressions:</strong>
                  <div className="phrases-items">
                    {styleProfile.phrasesAndExpressions.expressions.slice(0, 5).map((exp, idx) => (
                      <div key={idx} className="phrase-item">"{exp}"</div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="no-data">No common expressions detected yet</div>
              )}
              
              {styleProfile.phrasesAndExpressions.greetings.length > 0 && (
                <div className="phrases-group">
                  <strong>Greetings:</strong>
                  <div className="phrases-items">
                    {styleProfile.phrasesAndExpressions.greetings.slice(0, 3).map((greeting, idx) => (
                      <div key={idx} className="phrase-item">"{greeting}"</div>
                    ))}
                  </div>
                </div>
              )}
              
              {styleProfile.phrasesAndExpressions.transitions.length > 0 && (
                <div className="phrases-group">
                  <strong>Transitions:</strong>
                  <div className="phrases-items">
                    {styleProfile.phrasesAndExpressions.transitions.slice(0, 3).map((transition, idx) => (
                      <div key={idx} className="phrase-item">"{transition}"</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="style-section">
            <h5>Emoji Usage</h5>
            {styleProfile.emojiStyle.frequency > 0 ? (
              <div className="emoji-section">
                <div className="pattern-item">
                  <div className="pattern-label">Frequency</div>
                  <div className="pattern-bar">
                    <div 
                      className="pattern-fill" 
                      style={{ 
                        width: `${Math.min(Math.max(styleProfile.emojiStyle.frequency * 10, 0), 100)}%`,
                        backgroundColor: '#ff9500'
                      }}
                    ></div>
                  </div>
                </div>
                
                {styleProfile.emojiStyle.favorites.length > 0 && (
                  <div className="emoji-favorites">
                    <strong>Favorites:</strong>
                    <div className="emoji-list">
                      {styleProfile.emojiStyle.favorites.map((emoji, idx) => (
                        <span key={idx} className="emoji-item">{emoji}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-data">No emoji usage detected yet</div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Render settings tab
  const renderSettingsTab = () => {
    return (
      <div className="tab-content settings-tab">
        <h4>Learning Settings</h4>
        <div className="settings-section">
          <h5>Learning Mode</h5>
          <div className="mode-selection">
            <div 
              className={`mode-option ${learningMode === 'active' ? 'selected' : ''}`}
              onClick={() => handleModeChange('active')}
            >
              <div className="mode-name">Active</div>
              <div className="mode-description">
                Echo Twin continuously learns from all interactions to improve its mimicry.
              </div>
            </div>
            
            <div 
              className={`mode-option ${learningMode === 'passive' ? 'selected' : ''}`}
              onClick={() => handleModeChange('passive')}
            >
              <div className="mode-name">Passive</div>
              <div className="mode-description">
                Echo Twin records interactions but doesn't actively adapt behavior.
              </div>
            </div>
            
            <div 
              className={`mode-option ${learningMode === 'disabled' ? 'selected' : ''}`}
              onClick={() => handleModeChange('disabled')}
            >
              <div className="mode-name">Disabled</div>
              <div className="mode-description">
                Learning and adaptation are completely disabled.
              </div>
            </div>
          </div>
        </div>
        
        <div className="settings-section">
          <h5>Emotional Adjustment</h5>
          <p className="settings-description">
            Adjust the emotional expression levels of your Echo Twin.
          </p>
          
          <div className="emotion-adjustments">
            <div className="emotion-adjustment">
              <div className="emotion-name">Joy</div>
              <div className="emotion-controls">
                <button 
                  className="emotion-button decrease"
                  onClick={() => handleEmotionAdjust('joy', -2)}
                  title="Decrease joy expression"
                >-</button>
                <div className="emotion-bar">
                  <div 
                    className="emotion-fill"
                    style={{ 
                      width: `${Math.min(Math.max((styleProfile?.emotionalSignature?.joy?.frequency || 0) * 10, 0), 100)}%`,
                      backgroundColor: '#ffcc00'
                    }}
                  ></div>
                </div>
                <button 
                  className="emotion-button increase"
                  onClick={() => handleEmotionAdjust('joy', 2)}
                  title="Increase joy expression"
                >+</button>
              </div>
            </div>
            
            <div className="emotion-adjustment">
              <div className="emotion-name">Surprise</div>
              <div className="emotion-controls">
                <button 
                  className="emotion-button decrease"
                  onClick={() => handleEmotionAdjust('surprise', -2)}
                  title="Decrease surprise expression"
                >-</button>
                <div className="emotion-bar">
                  <div 
                    className="emotion-fill"
                    style={{ 
                      width: `${Math.min(Math.max((styleProfile?.emotionalSignature?.surprise?.frequency || 0) * 10, 0), 100)}%`,
                      backgroundColor: '#00bfff'
                    }}
                  ></div>
                </div>
                <button 
                  className="emotion-button increase"
                  onClick={() => handleEmotionAdjust('surprise', 2)}
                  title="Increase surprise expression"
                >+</button>
              </div>
            </div>
            
            <div className="emotion-adjustment">
              <div className="emotion-name">Interest</div>
              <div className="emotion-controls">
                <button 
                  className="emotion-button decrease"
                  onClick={() => handleEmotionAdjust('interest', -2)}
                  title="Decrease interest expression"
                >-</button>
                <div className="emotion-bar">
                  <div 
                    className="emotion-fill"
                    style={{ 
                      width: `${Math.min(Math.max((styleProfile?.emotionalSignature?.interest?.frequency || 0) * 10, 0), 100)}%`,
                      backgroundColor: '#9966ff'
                    }}
                  ></div>
                </div>
                <button 
                  className="emotion-button increase"
                  onClick={() => handleEmotionAdjust('interest', 2)}
                  title="Increase interest expression"
                >+</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="settings-section">
          <h5>Reset Learning Data</h5>
          <p className="settings-description warning">
            This will erase all learned patterns and personal data, returning Echo Twin
            to its default state. This action cannot be undone.
          </p>
          
          <button 
            className={`reset-button ${confirmingReset ? 'confirming' : ''}`}
            onClick={handleReset}
          >
            {confirmingReset ? 'Click again to confirm reset' : 'Reset Echo Twin Data'}
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="training-panel">
      <div className="training-panel-header">
        <h3>Echo Twin Identity Mirror</h3>
        <button className="close-button" onClick={onClose}>&times;</button>
      </div>
      
      <div className="training-panel-tabs">
        <div 
          className={`panel-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </div>
        <div 
          className={`panel-tab ${activeTab === 'identity' ? 'active' : ''}`}
          onClick={() => setActiveTab('identity')}
        >
          Identity
        </div>
        <div 
          className={`panel-tab ${activeTab === 'style' ? 'active' : ''}`}
          onClick={() => setActiveTab('style')}
        >
          Expression
        </div>
        <div 
          className={`panel-tab ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </div>
      </div>
      
      <div className="training-panel-content">
        {feedbackMessage && (
          <div className="feedback-message">{feedbackMessage}</div>
        )}
        
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PersonalLearningPanel;