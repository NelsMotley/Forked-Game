import React, { useState, useEffect, useRef } from "react";
import "./Arm.css";
import ProgressLightsDemo from './ProgressLightsDemo.js';

const Arm = ({ value, data, lives, onSelect, fin, rounds }) => {
  // Create refs for elements we need to manipulate
  const armShineRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Handle shine animation for a specific button
  const handleButtonHover = (buttonIndex) => {
    // Don't start a new animation if one is already running
    if (isAnimating) return;
    
    // Set flag to prevent multiple animations
    setIsAnimating(true);
    
    const armShine = armShineRef.current;
    if (armShine) {
      // Remove any existing animation classes
      armShine.classList.remove('shine-btn1', 'shine-btn2', 'shine-btn3');
      
      // Force browser to recognize the DOM change before adding new class
      void armShine.offsetWidth;
      
      // Add the appropriate class for this button
      armShine.classList.add(`shine-btn${buttonIndex}`);
      
      // Reset the flag when animation completes
      setTimeout(() => {
        setIsAnimating(false);
      }, 700); // Match to your animation duration
    }
  };
  
  return (
    <div className="arm-group">
      <div className="arm" style={{ transform: `rotate(${value}deg)` }}>
        <div className="circle-part"></div>
        <div className="rect-part">
          <ProgressLightsDemo correct = {rounds}/>
          {fin && (<div className="rect-text"></div>)}
        </div>
        <div className="big-shadow"></div>
        <div className="rect-shadow"></div>
        <div className="arm-part">
          {fin && (
            <div className="WHy">
          <button 
            className="questions-button" 
            onClick={() => onSelect(1)}
            onMouseEnter={() => handleButtonHover(1)}
          >
            {data.option1}
          </button>
          <button 
            className="questions-button" 
            onClick={() => onSelect(2)}
            onMouseEnter={() => handleButtonHover(2)}
          >
            {data.option2}
          </button>
          <button 
            className="questions-button" 
            onClick={() => onSelect(3)}
            onMouseEnter={() => handleButtonHover(3)}
          >
            {data.option3}
          </button>
          <div className="arm-shine" ref={armShineRef}></div>
          </div>
          )}
        </div>
        <div className="bend-part"></div>
        <div className="bend-shadow"></div>
        <div className="head-part"></div>
        <div className="head-shadow"></div>
      </div>
    </div>
  );
};

export default Arm;