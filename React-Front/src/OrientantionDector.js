import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
const OrientationDetector = () => {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.innerHeight > window.innerWidth);
    };
    checkOrientation();

  
    window.addEventListener('resize', checkOrientation);

  
    return () => {
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);

  if (!isPortrait) {
    return null;
  }

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    color: 'white',
    textAlign: 'center',
    padding: '20px'
  };

  return ReactDOM.createPortal(
    <div style={overlayStyle}>
      <div style={{ fontSize: '24px', marginBottom: '20px' }}>
        <span role="img" aria-label="rotate phone" style={{ fontSize: '50px', display: 'block', marginBottom: '20px' }}>
          📱↻
        </span>
        Please rotate your device
      </div>
      <p style={{ fontSize: '16px', maxWidth: '300px' }}>
        This application works best in landscape mode. Please rotate your device for the optimal experience.
      </p>
    </div>,
    document.getElementById('super-portal-root')
  );
};

export default OrientationDetector;