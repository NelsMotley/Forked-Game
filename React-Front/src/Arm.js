import React, { useState, useEffect, useRef } from "react";
import "./Arm.css";
import ProgressLightsDemo from './ProgressLightsDemo.js';

const Arm = ({ value, data, lives, onSelect, fin, rounds }) => {
  const armShineRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  //Ignore this. Old code for a feature that didn't work.
  const handleButtonHover = (buttonIndex) => {
    
    if (isAnimating) return;
    
    
    setIsAnimating(true);
    
    const armShine = armShineRef.current;
    if (armShine) {
      
      armShine.classList.remove('shine-btn1', 'shine-btn2', 'shine-btn3');
      
      
      void armShine.offsetWidth;
      
      armShine.classList.add(`shine-btn${buttonIndex}`);
      
      setTimeout(() => {
        setIsAnimating(false);
      }, 700);
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