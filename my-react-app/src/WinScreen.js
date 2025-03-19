import React from 'react';

const VictoryModal = ({
  isVisible = true,
  onClose = () => {},
  message = "Victory!",
  subMessage = "You've won the game!"
}) => {
  // If not visible, don't render anything
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999
      }}
      onClick={onClose}
    >
      {/* White rectangle in the center */}
      <div
        style={{
          width: '400px',
          height: '300px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          textAlign: 'center'
        }}
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking the rectangle
      >
        <h2 style={{ 
          fontSize: '28px',
          color: '#333',
          marginBottom: '16px'
        }}>
          {message}
        </h2>
        <p style={{
          fontSize: '18px',
          color: '#666',
          marginBottom: '24px'
        }}>
          {subMessage}
        </p>
        <button
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
          onClick={onClose}
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default VictoryModal;