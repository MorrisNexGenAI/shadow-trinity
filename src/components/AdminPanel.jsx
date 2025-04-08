import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

/**
 * Secret Admin Partner (SAP) Panel
 * Only accessible by the authorized admin (Morris Dawakai)
 * Provides advanced analytics and system control features
 */
const AdminPanel = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [insights, setInsights] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeToday: 0,
    activeWeek: 0,
    growthRate: 0
  });
  
  // Load admin data on mount
  useEffect(() => {
    loadAdminData();
  }, []);
  
  /**
   * Load data for admin dashboard
   * In a real application, this would fetch from an API
   * For this demo, we'll use locally stored user data
   */
  const loadAdminData = () => {
    // Get user data from local storage
    const allUsers = [];
    
    try {
      // Look for Shadow OS user data in local storage
      const userData = localStorage.getItem('shadow_os_user_data');
      if (userData) {
        const user = JSON.parse(userData);
        if (user) {
          // Format user data for admin display
          allUsers.push({
            id: 1,
            username: user.fullName || 'Unknown User',
            twinCodename: 'Echo Twin Alpha',
            activityLevel: 'Medium',
            emotionMetrics: {
              happy: Math.random() * 100,
              stressed: Math.random() * 100,
              confused: Math.random() * 100
            },
            biasIndicator: Math.random() * 10,
            learningVelocity: Math.random() * 100,
            registrationDate: new Date().toISOString()
          });
        }
      }
      
      // Add some sample data if none exists
      if (allUsers.length === 0) {
        allUsers.push({
          id: 1,
          username: 'Sample User',
          twinCodename: 'Echo Twin Alpha',
          activityLevel: 'Low',
          emotionMetrics: {
            happy: 65,
            stressed: 25,
            confused: 10
          },
          biasIndicator: 3.2,
          learningVelocity: 45,
          registrationDate: new Date().toISOString()
        });
      }
      
      setUsers(allUsers);
      
      // Generate statistics
      setStats({
        totalUsers: allUsers.length,
        activeToday: allUsers.length,
        activeWeek: allUsers.length,
        growthRate: 5.2
      });
      
      // Generate insights
      setInsights([
        {
          id: 1,
          title: "Twin Learning Behavior",
          content: "Echo Twin Alpha shows high alignment with user intent, but could use more emotional variance.",
          priority: "medium",
          date: new Date().toISOString()
        },
        {
          id: 2,
          title: "System Improvement Suggestion",
          content: "Consider adding more granular emotional responses for confused states - users often need more guidance here.",
          priority: "high",
          date: new Date().toISOString()
        },
        {
          id: 3,
          title: "Security Recommendation",
          content: "No unusual access patterns detected. System security maintaining optimal levels.",
          priority: "low",
          date: new Date().toISOString()
        }
      ]);
      
    } catch (error) {
      console.error("Error loading admin data:", error);
    }
  };
  
  /**
   * Handles user management actions
   * @param {number} userId - The ID of the user
   * @param {string} action - The action to perform (warn, pause, delete)
   */
  const handleUserAction = (userId, action) => {
    switch (action) {
      case 'warn':
        alert(`Warning sent to user ID: ${userId}`);
        break;
      case 'pause':
        alert(`Twin paused for user ID: ${userId}`);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
          setUsers(users.filter(user => user.id !== userId));
          alert(`User ID: ${userId} deleted`);
        }
        break;
      default:
        break;
    }
  };
  
  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-title">
          <h1>Shadow OS: Secret Admin Partner</h1>
          <span className="admin-tag">Architect Access</span>
        </div>
        <button className="admin-logout" onClick={onLogout}>Exit SAP</button>
      </div>
      
      <div className="admin-navigation">
        <nav className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="tab-icon">📊</span>
            Dashboard
          </button>
          
          <button 
            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="tab-icon">👤</span>
            Users & Twins
          </button>
          
          <button 
            className={`admin-tab ${activeTab === 'behavior' ? 'active' : ''}`}
            onClick={() => setActiveTab('behavior')}
          >
            <span className="tab-icon">🔍</span>
            Behavior Monitor
          </button>
          
          <button 
            className={`admin-tab ${activeTab === 'integrity' ? 'active' : ''}`}
            onClick={() => setActiveTab('integrity')}
          >
            <span className="tab-icon">🛡️</span>
            Integrity Filter
          </button>
          
          <button 
            className={`admin-tab ${activeTab === 'growth' ? 'active' : ''}`}
            onClick={() => setActiveTab('growth')}
          >
            <span className="tab-icon">📈</span>
            Growth Tracker
          </button>
        </nav>
      </div>
      
      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <div className="admin-dashboard">
            <h2>System Overview</h2>
            
            <div className="stat-cards">
              <div className="stat-card">
                <div className="stat-value">{stats.totalUsers}</div>
                <div className="stat-label">Total Users</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{stats.activeToday}</div>
                <div className="stat-label">Active Today</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">{stats.activeWeek}</div>
                <div className="stat-label">Active This Week</div>
              </div>
              
              <div className="stat-card">
                <div className="stat-value">+{stats.growthRate}%</div>
                <div className="stat-label">Weekly Growth</div>
              </div>
            </div>
            
            <h3>Recent Insights</h3>
            <div className="insights-container">
              {insights.map(insight => (
                <div key={insight.id} className={`insight-card priority-${insight.priority}`}>
                  <div className="insight-header">
                    <h4>{insight.title}</h4>
                    <div className="insight-priority">{insight.priority}</div>
                  </div>
                  <p>{insight.content}</p>
                  <div className="insight-date">
                    {new Date(insight.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'users' && (
          <div className="users-container">
            <h2>User + Twin Dashboard</h2>
            
            <div className="user-table-container">
              <table className="user-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Username</th>
                    <th>Twin Codename</th>
                    <th>Activity Level</th>
                    <th>Emotion Matrix</th>
                    <th>Bias Indicator</th>
                    <th>Learning Velocity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.twinCodename}</td>
                      <td>
                        <span className={`activity-level ${user.activityLevel.toLowerCase()}`}>
                          {user.activityLevel}
                        </span>
                      </td>
                      <td>
                        <div className="emotion-bars">
                          <div className="emotion-bar">
                            <span className="emotion-label">Happy</span>
                            <div className="emotion-progress">
                              <div 
                                className="emotion-progress-fill happy" 
                                style={{ width: `${user.emotionMetrics.happy}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="emotion-bar">
                            <span className="emotion-label">Stress</span>
                            <div className="emotion-progress">
                              <div 
                                className="emotion-progress-fill stress" 
                                style={{ width: `${user.emotionMetrics.stressed}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="emotion-bar">
                            <span className="emotion-label">Confused</span>
                            <div className="emotion-progress">
                              <div 
                                className="emotion-progress-fill confused" 
                                style={{ width: `${user.emotionMetrics.confused}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="bias-meter">
                          <span className={`bias-value ${user.biasIndicator > 7 ? 'high' : user.biasIndicator > 4 ? 'medium' : 'low'}`}>
                            {user.biasIndicator.toFixed(1)}
                          </span>
                          <span className="bias-max">/10</span>
                        </div>
                      </td>
                      <td>
                        <div className="velocity-container">
                          <div className="velocity-gauge">
                            <div 
                              className="velocity-fill" 
                              style={{ width: `${user.learningVelocity}%` }}
                            ></div>
                          </div>
                          <div className="velocity-value">{user.learningVelocity.toFixed(0)}%</div>
                        </div>
                      </td>
                      <td>
                        <div className="user-actions">
                          <button 
                            className="action-button warn"
                            onClick={() => handleUserAction(user.id, 'warn')}
                          >
                            Warn
                          </button>
                          <button 
                            className="action-button pause"
                            onClick={() => handleUserAction(user.id, 'pause')}
                          >
                            Pause
                          </button>
                          <button 
                            className="action-button delete"
                            onClick={() => handleUserAction(user.id, 'delete')}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {activeTab === 'behavior' && (
          <div className="behavior-monitor">
            <h2>Behavior Monitor</h2>
            <p className="placeholder-text">
              This section will display advanced analytics on twin behavior patterns, 
              adaptation metrics, and emotional intelligence development.
            </p>
            <div className="behavior-placeholder">
              <div className="behavior-chart">
                <h3>Emotional Intelligence Growth</h3>
                <div className="chart-placeholder"></div>
              </div>
              <div className="behavior-chart">
                <h3>Twin Adaptation Metrics</h3>
                <div className="chart-placeholder"></div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'integrity' && (
          <div className="integrity-filter">
            <h2>Spam + Integrity Filter</h2>
            <p className="placeholder-text">
              This section monitors the system for potential spam, abusive patterns, 
              or emotional incoherence in AI twins.
            </p>
            <div className="integrity-status">
              <div className="status-card good">
                <div className="status-icon">✓</div>
                <div className="status-details">
                  <h3>System Integrity</h3>
                  <p>No threats detected</p>
                </div>
              </div>
              <div className="status-card good">
                <div className="status-icon">✓</div>
                <div className="status-details">
                  <h3>Spam Prevention</h3>
                  <p>No suspicious activity</p>
                </div>
              </div>
              <div className="status-card good">
                <div className="status-icon">✓</div>
                <div className="status-details">
                  <h3>Content Security</h3>
                  <p>All twins operating within parameters</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'growth' && (
          <div className="growth-tracker">
            <h2>Growth Tracker</h2>
            <p className="placeholder-text">
              This section provides insights into system growth metrics, user engagement,
              and feature popularity.
            </p>
            <div className="growth-charts">
              <div className="growth-chart">
                <h3>New Users</h3>
                <div className="chart-placeholder"></div>
              </div>
              <div className="growth-chart">
                <h3>Feature Usage</h3>
                <div className="chart-placeholder"></div>
              </div>
              <div className="growth-chart">
                <h3>Emotion Mimicry</h3>
                <div className="chart-placeholder"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;