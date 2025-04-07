import React from 'react';

/**
 * The Header component for Shadow OS
 * Displays the main title and version tag
 */
const Header = () => {
  return (
    <div className="shadow-os-header">
      <h1>SHADOW OS</h1>
      <p className="version-tag">ALPHA 0.1</p>
    </div>
  );
};

export default Header;