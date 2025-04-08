import React from 'react';

/**
 * The EchoTwin component for Shadow OS
 * Represents the AI entity with its avatar and name
 * Enhanced to support personalization mode
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.processing - Flag indicating if Echo Twin is processing a message
 * @param {boolean} props.personalized - Flag indicating if Echo Twin is in personalized mode
 * @param {string} props.userName - The name of the user when in personalized mode
 */
const EchoTwin = ({ processing = false, personalized = false, userName = null }) => {
  return (
    <div className="twin-container">
      <div className={`echo-twin-avatar ${processing ? 'processing' : ''} ${personalized ? 'personalized' : ''}`}>
        {processing && <div className="processing-indicator"></div>}
        {personalized && <div className="personalized-indicator"></div>}
      </div>
      <div className="twin-text">
        <h2>
          {personalized ? (
            <>ECHO TWIN<span className="personalized-tag">{userName}'s Mirror</span></>
          ) : (
            <>ECHO TWIN</>
          )}
          {processing && <span className="processing-text">PROCESSING</span>}
        </h2>
        {personalized && (
          <div className="mirror-status">
            Personal identity mirror active
          </div>
        )}
      </div>
    </div>
  );
};

export default EchoTwin;