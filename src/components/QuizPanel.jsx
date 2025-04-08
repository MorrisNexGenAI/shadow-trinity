import React, { useState, useEffect } from 'react';
import './QuizPanel.css';

/**
 * QuizPanel component for user quiz interaction
 * Helps Echo Twin learn more about the user through various categories of questions
 */
const QuizPanel = ({ onClose, onQuizComplete }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Available quiz categories
  const categories = [
    {
      id: 'personality',
      name: 'Personality',
      icon: '👤',
      description: 'Questions about your preferences and tendencies',
      color: 'linear-gradient(135deg, #ff9a9e, #fad0c4)'
    },
    {
      id: 'communication',
      name: 'Communication Style',
      icon: '💬',
      description: 'How you express yourself and interact with others',
      color: 'linear-gradient(135deg, #a18cd1, #fbc2eb)'
    },
    {
      id: 'values',
      name: 'Values & Beliefs',
      icon: '⚖️',
      description: 'What matters most to you',
      color: 'linear-gradient(135deg, #84fab0, #8fd3f4)'
    },
    {
      id: 'thinking',
      name: 'Thinking Style',
      icon: '🧠',
      description: 'How you approach problems and make decisions',
      color: 'linear-gradient(135deg, #f6d365, #fda085)'
    },
    {
      id: 'preferences',
      name: 'Daily Preferences',
      icon: '🌟',
      description: 'Your likes and dislikes in everyday situations',
      color: 'linear-gradient(135deg, #5ee7df, #b490ca)'
    }
  ];
  
  // Questions organized by category
  const quizQuestions = {
    personality: [
      {
        id: 'p1',
        question: 'In social situations, do you prefer:',
        options: [
          'Being the center of attention',
          'Participating in small group conversations',
          'One-on-one interactions',
          'Observing and listening'
        ]
      },
      {
        id: 'p2',
        question: 'When facing a challenge, your first instinct is to:',
        options: [
          'Jump right in and tackle it head-on',
          'Take time to carefully plan your approach',
          'Talk to others about potential solutions',
          'Research similar challenges and their solutions'
        ]
      },
      {
        id: 'p3',
        question: 'When you are stressed, you usually:',
        options: [
          'Talk to friends or family about it',
          'Process it internally before sharing',
          'Engage in physical activity',
          'Distract yourself with entertainment or hobbies'
        ]
      }
    ],
    communication: [
      {
        id: 'c1',
        question: 'When explaining something complex, you tend to:',
        options: [
          'Use analogies and metaphors',
          'Break it down into logical steps',
          'Draw diagrams or visual aids',
          'Share personal experiences related to it'
        ]
      },
      {
        id: 'c2',
        question: 'In disagreements, you typically:',
        options: [
          'Express your position firmly and clearly',
          'Try to understand the other person\'s perspective first',
          'Look for a compromise or middle ground',
          'Avoid the conflict if possible'
        ]
      },
      {
        id: 'c3',
        question: 'When receiving feedback, you prefer it to be:',
        options: [
          'Direct and straightforward',
          'Gentle and supportive',
          'Focused on solutions rather than problems',
          'Accompanied by specific examples'
        ]
      }
    ],
    values: [
      {
        id: 'v1',
        question: 'Which of these do you value most in relationships?',
        options: [
          'Trust and honesty',
          'Emotional connection',
          'Shared interests and activities',
          'Growth and learning together'
        ]
      },
      {
        id: 'v2',
        question: 'In your work or projects, what gives you the most satisfaction?',
        options: [
          'Creating something innovative',
          'Mastering a skill or subject',
          'Helping or teaching others',
          'Achieving recognition for your efforts'
        ]
      },
      {
        id: 'v3',
        question: 'When making important decisions, which factor typically weighs most heavily?',
        options: [
          'What feels right instinctively',
          'What is most logical and practical',
          'How it will affect others',
          'How it aligns with your long-term goals'
        ]
      }
    ],
    thinking: [
      {
        id: 't1',
        question: 'When learning something new, you prefer:',
        options: [
          'Hands-on practice and experimentation',
          'Studying theories and principles first',
          'Seeing demonstrations or examples',
          'Discussing it with others'
        ]
      },
      {
        id: 't2',
        question: 'When you have a creative idea, you typically:',
        options: [
          'Start implementing it immediately',
          'Think through all the details first',
          'Share it with others to get feedback',
          'Research to see if it has been done before'
        ]
      },
      {
        id: 't3',
        question: 'When solving problems, you tend to:',
        options: [
          'Trust your intuition',
          'Follow a systematic approach',
          'Consider multiple perspectives',
          'Look for patterns from past situations'
        ]
      }
    ],
    preferences: [
      {
        id: 'pr1',
        question: 'Your ideal weekend would include:',
        options: [
          'Socializing with friends or family',
          'Quiet time alone with books or media',
          'Outdoor activities or adventures',
          'Working on a hobby or personal project'
        ]
      },
      {
        id: 'pr2',
        question: 'When consuming content, you generally prefer:',
        options: [
          'Fiction that takes you to different worlds',
          'Non-fiction that teaches you something new',
          'Content that makes you laugh or feel good',
          'Thought-provoking material that challenges you'
        ]
      },
      {
        id: 'pr3',
        question: 'In your living or working space, you prefer:',
        options: [
          'Neat, organized, and minimalist',
          'Comfortable and cozy with personal touches',
          'Vibrant, colorful, and stimulating',
          'Functional and practical above all else'
        ]
      }
    ]
  };
  
  // Handle selecting a category
  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
    setCurrentQuestion(0);
    setIsCompleted(false);
  };
  
  // Handle answering a question
  const handleAnswer = (questionId, answerIndex) => {
    setAnswers({
      ...answers,
      [questionId]: answerIndex
    });
    
    // Move to next question or mark as completed if last question
    const questions = quizQuestions[activeCategory];
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setIsCompleted(true);
      
      // Process quiz results
      const categoryResults = questions.map(q => ({
        question: q.question,
        answer: q.options[answers[q.id] || 0]
      }));
      
      // Call the callback with results
      if (onQuizComplete) {
        onQuizComplete(activeCategory, categoryResults);
      }
    }
  };
  
  // Reset quiz state when returning to categories
  const handleBackToCategories = () => {
    setActiveCategory(null);
    setCurrentQuestion(0);
    setIsCompleted(false);
  };
  
  return (
    <div className="quiz-panel-overlay">
      <div className="quiz-panel">
        <div className="quiz-header">
          <h2>Learning Quizzes</h2>
          <button className="quiz-close-button" onClick={onClose}>×</button>
        </div>
        
        {!activeCategory ? (
          // Category selection view
          <div className="category-selection">
            <p className="quiz-description">
              Help your Echo Twin understand you better by completing these optional quizzes.
              Each category reveals different aspects of your personality and preferences.
            </p>
            
            <div className="category-grid">
              {categories.map(category => (
                <div 
                  key={category.id}
                  className="category-card"
                  style={{ background: category.color }}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <div className="category-icon">{category.icon}</div>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Quiz questions view
          <div className="quiz-content">
            {!isCompleted ? (
              // Current question
              <>
                <div className="quiz-progress">
                  <div className="quiz-category">
                    {categories.find(c => c.id === activeCategory).icon}{' '}
                    {categories.find(c => c.id === activeCategory).name}
                  </div>
                  <div className="quiz-step">
                    Question {currentQuestion + 1} of {quizQuestions[activeCategory].length}
                  </div>
                </div>
                
                <div className="quiz-question">
                  <h3>{quizQuestions[activeCategory][currentQuestion].question}</h3>
                  
                  <div className="quiz-options">
                    {quizQuestions[activeCategory][currentQuestion].options.map((option, index) => (
                      <button
                        key={index}
                        className="quiz-option"
                        onClick={() => handleAnswer(quizQuestions[activeCategory][currentQuestion].id, index)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              // Completion screen
              <div className="quiz-completion">
                <div className="completion-icon">✅</div>
                <h3>Quiz Completed!</h3>
                <p>
                  Thank you for completing the {categories.find(c => c.id === activeCategory).name} quiz.
                  Your Echo Twin has learned more about you and will use this information to
                  better reflect your personality and preferences.
                </p>
                <div className="quiz-buttons">
                  <button
                    className="quiz-button primary"
                    onClick={handleBackToCategories}
                  >
                    Try Another Category
                  </button>
                  <button
                    className="quiz-button secondary"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
            
            {!isCompleted && (
              <div className="quiz-navigation">
                <button
                  className="quiz-back-button"
                  onClick={handleBackToCategories}
                >
                  Back to Categories
                </button>
                {currentQuestion > 0 && (
                  <button
                    className="quiz-prev-button"
                    onClick={() => setCurrentQuestion(currentQuestion - 1)}
                  >
                    Previous
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPanel;
