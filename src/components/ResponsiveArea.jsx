import React from 'react';

/**
 * The ResponseArea component displays Echo Twin's responses
 * @param {Object} props - Component props
 * @param {string} props.response - The text response from Echo Twin
 * @param {string|null} props.error - Optional error message
 * @param {string} props.trainingMode - The current mode (Training or Cloud AI)
 */
const ResponseArea = ({ response, error = null, trainingMode = "Cloud AI" }) => {
  return (
    <div className="response-area">
      <div className="mode-indicator">{trainingMode}</div>
      <p className={error ? 'response-with-error' : ''}>{response}</p>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ResponseArea;