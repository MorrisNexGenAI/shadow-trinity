import React from 'react';

/**
 * The EchoTwin component for Shadow OS
 * Represents the AI entity with its avatar and name
 * @param {Object} props - Component props
 * @param {boolean} props.processing - Flag indicating if Echo Twin is processing a message
 */
const EchoTwin = ({ processing = false }) => {
  return (
    <div className="twin-container">
      <div className={`echo-twin-avatar ${processing ? 'processing' : ''}`}>
        {processing && <div className="processing-indicator"></div>}
      </div>
      <h2>ECHO TWIN {processing && <span className="processing-text">PROCESSING</span>}</h2>
    </div>
  );
};

export default EchoTwin;