import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './InfoScreen.css'


const GuideModal = ({
  isVisible = false,
  buttonId = "",
  onClose = () => {}
}) => {
  if (!isVisible) return null;

  function GitHub() {
    return (
        <a href={"https://github.com/NelsMotley/Forked-Game"} title="View on GitHub" className="github-link">
            <svg height="32" width="32" viewBox="0 0 16 16" version="1.1" aria-hidden="true">
                <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
        </a>
    );
  }

  const ContentServices = () => (
    <div style={{
      padding: '1vmin',
      fontFamily: 'Arial',
      fontSize: '2vmin',
      lineHeight: '1.5',
      margin: '0.1vmin 0'
    }}>
      <h3 style={{
        fontSize: '3vmin',
        fontFamily: "Times New Roman",
        fontWeight: 'bold',
        marginBottom: '10px'
      }}>
        Game Objectives
      </h3>
      <p>Match the correct quotations, genres, and review scores from Pitchfork to the albums. The game has three difficulty levels which increase each round. Complete 3 rounds to win:</p>
     
      <div style={{ margin: '15px 0' }}>
        <strong>Round 1:</strong> Easiest, Albums with high streaming popularity<br/>
        <strong>Round 2:</strong> Less known albums, niche, cult classics<br/>
        <strong>Round 3:</strong> Obscure albums mostly lost to time
      </div>
     
      <h3 style={{
        fontSize: '3vmin',
        fontFamily: "Times New Roman",
        fontWeight: 'bold',
        marginBottom: '10px'
      }}>
        Controls
      </h3>
      <p>Click on an option to select it. Submit your guesses to see how you did! </p>

    </div>
  );


  const ContentAbout = () => (
    <div style={{
        padding: '10px',
        fontFamily: 'Arial',
        fontSize: '2vmin',
        lineHeight: '1.5',
        margin: '10px 0'
      }}>
        <h3 style={{
          fontSize: '3vmin',
          fontFamily: "Times New Roman",
          fontWeight: 'bold',
          marginBottom: '10px'
        }}>
          Why did I make this?
        </h3>
        <p>If you're playing this game you've probably wasted more of your life than you'd like to admit reading Pitchfork reviews. You've probably bragged to a friend that 
            you remember every review score after 2008. I have experienced this bragging and I thought this would be a fun way to put those skills to the test.
        </p>
       
        
       
        <h3 style={{
          fontSize: '3vmin',
          fontFamily: "Times New Roman",
          fontWeight: 'bold',
          marginBottom: '10px'
        }}>
          Links
        </h3>
        <GitHub/>
      </div>
  );
  
  
  const contentMap = {
    "services": <ContentServices />,
    "about": <ContentAbout/>
  };

 
  return ReactDOM.createPortal(
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
        marginLeft: '9.2vw',
        justifyContent: 'center', 
        zIndex: 99999
      }}
      onClick={onClose}
    >
      {/* Main container */}
      <div
        style={{
          width: '30vw',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          marginRight:'9.2vw',
          padding: '20px',
          border: '2px solid black'
        }}
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking the container
      >
        {/* Header */}
        <div
          style={{
            textAlign: 'center',
            padding: '10px 0',
            borderBottom: '2px solid black',
            marginBottom: '10px'
          }}
        >
          <h1 style={{ 
            fontSize: '4.5vmin',
            fontWeight: 'bold',
            fontFamily: "Times New Roman",
            margin: 0
          }}>
            {(buttonId === "services") ? "How to Play" : 
            (buttonId === "about") ? "About" : ":/"}
            
          </h1>
        </div>
        
        {/* Guide Content */}
        {contentMap[buttonId]}
        
        {/* Close button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '15px',
            borderTop: '2px solid black',
            marginTop: '10px'
          }}
        >
          <button
            style={{
              padding: '1vmin 2vmin',
              backgroundColor: 'white',
              color: 'black',
              border: '2px solid black',
              fontSize: '5vmin',
              fontStyle: "italic",
              cursor: 'pointer',
              width: '60%',
              fontFamily: "Times New Roman",
              fontWeight: 'bold'
            }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-portal-root')
  );
};

export default GuideModal;