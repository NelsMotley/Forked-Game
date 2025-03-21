import React from 'react';
import ReactDOM from 'react-dom';

const VictoryModal = ({
  isVisible = true,
  onClose = () => {},
  onPlayAgain = () => {},
  numToShow = 3, // New prop to control how many difficulty sections to show
  scores = {
    easy: { title: "Title", author: "Author", date: "Date", score: 9.0 },
    medium: { title: "Title", author: "Author", date: "Date", score: 4.2 },
    hard: { title: "Title", author: "Author", date: "Date", score: 7.3 }
  },
  links = {
    easy: "https://media.pitchfork.com/photos/5929e56ceb335119a49ef2c8/master/w_1600,c_limit/file",
    medium: "https://media.pitchfork.com/photos/5929e56ceb335119a49ef2c8/master/w_1600,c_limit/file",
    hard: "https://media.pitchfork.com/photos/5929e56ceb335119a49ef2c8/master/w_1600,c_limit/file"
  }
}) => {
  // If not visible, don't render anything
  if (!isVisible) return null;

  let message = "";
  if(numToShow === 3){
    message = "I had never seen a shooting star before.";
  }
  else if(numToShow === 2){
    message = "Homogeneous shitheap of stream-of-consciousness turgidity."
  }
  else if(numToShow === 1){
    message = "Like witnessing the stillborn birth of a child."
  }
  else{
    message = "I hope the basement collapses."
  }

  // Create portal to render at root level
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
        justifyContent: 'center',
        zIndex: 99999
      }}
      onClick={onClose}
    >
      {/* Main container */}
      <div
        style={{
          width: '500px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          padding: '20px',
          border: '2px solid black'
        }}
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking the rectangle
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
            fontSize: '32px',
            fontWeight: 'bold',
            fontFamily: "Times New Roman",
            margin: 0
          }}>
            {message}
          </h1>
        </div>
        
        {/* First section - Easy (or question marks) */}
        
        {numToShow > 0 ? (
          <DifficultySection 
            label="Easy"
            title={scores.easy.title}
            author={scores.easy.author}
            date={scores.easy.date}
            score={scores.easy.score}
            link={links.easy}
          />
        ) : (
          <QuestionMarkSection />
        )}
       
        
        {/* Second section - Medium (or question marks) */}
        
        {numToShow > 1 ? (
          <DifficultySection 
            label="Medium"
            title={scores.medium.title}
            author={scores.medium.author}
            date={scores.medium.date}
            score={scores.medium.score}
            link={links.medium}
          />
        ) : (
          <QuestionMarkSection />
        )}
       
        
        {/* Third section - Hard (or question marks) */}
        {numToShow > 2 ? (
          <DifficultySection 
            label="Hard"
            title={scores.hard.title}
            author={scores.hard.author}
            date={scores.hard.date}
            score={scores.hard.score}
            link={links.hard}
          />
        ) : (
          <QuestionMarkSection />
        )}
        
        {/* Footer with Play Again button */}
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
              padding: '8px 20px',
              backgroundColor: 'white',
              color: 'black',
              border: '2px solid black',
              fontSize: '28px',
              fontStyle: "italic",
              cursor: 'pointer',
              width: '60%',
              fontFamily: "Times New Roman",
              fontWeight: 'bold'
            }}
            onClick={() => {onPlayAgain();
                          onClose();
                      }}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal-portal-root') // Render to the portal root
  );
};

// Component for each difficulty section
const DifficultySection = ({ label, title, author, date, score, link }) => {
  const formattedScore = parseFloat(score).toFixed(1);
  
  const handleClick = () => {
    // Open the link in a new tab/window
    window.open(link, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div 
      style={{
        border: '2px solid black',
        padding: '10px',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer', // Change cursor to pointer to indicate clickable
        transition: 'background-color 0.2s ease', // Smooth transition for hover effect
        backgroundColor: 'white', // Default background color
        position: 'relative' // Position relative for pseudo-element
      }}
      onClick={handleClick}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'} // Lighter background on hover
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'} // Back to white when not hovering
    >
      <div style={{ flex: 1 }}>
        <h3 style={{ 
          fontSize: '26px',
          fontFamily: "Times New Roman",
          fontStyle: "italic",
          margin: '0 0 5px 0',
          fontWeight: 'bold'
        }}>
          {title}
        </h3>
        <div style={{ 
          fontFamily: "arial",
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '16px'
        }}>
          <span style={{ color: '#8B4513' }}>{author}</span>
          <span style={{ color: '#8B4513' }}>{date}</span>
        </div>
      </div>
      
      {/* Score Circle */}
      <div style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        border: '4px solid black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: '20px',
      }}>
        <span style={{ 
          fontFamily: 'Montserrat',
          fontSize: '26px', 
          fontWeight: 'bold'
        }}>
          {formattedScore}
        </span>
      </div>
    </div>
  );
};

// Component for question mark section (placeholder for hidden difficulty sections)
const QuestionMarkSection = () => {
  return (
    <div 
      style={{
        border: '2px solid black',
        padding: '10px',
        marginBottom: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80px' // Set a fixed height similar to DifficultySection
      }}
    >
      <span style={{ 
        fontSize: '60px',
        fontWeight: 'bold',
        fontFamily: 'Times New Roman'
      }}>
        ???
      </span>
    </div>
  );
};

export default VictoryModal;