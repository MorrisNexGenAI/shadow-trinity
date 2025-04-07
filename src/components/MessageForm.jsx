import React, { useState } from 'react';

/**
 * The MessageForm component allows users to input messages
 * @param {Object} props - Component props
 * @param {Function} props.onMessageSubmit - Callback function when a message is submitted
 * @param {boolean} props.isProcessing - Flag indicating if a message is being processed
 */
const MessageForm = ({ onMessageSubmit, isProcessing = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() === '' || isProcessing) return;
    
    onMessageSubmit(message);
    setMessage('');
  };

  return (
    <form className="message-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="message-input"
        placeholder={isProcessing ? "Processing your message..." : "Enter your message..."}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isProcessing}
      />
      <button 
        type="submit" 
        className={`submit-button ${isProcessing ? 'processing' : ''}`}
        disabled={isProcessing}
      >
        {isProcessing ? 'WAIT...' : 'SEND'}
      </button>
    </form>
  );
};

export default MessageForm;