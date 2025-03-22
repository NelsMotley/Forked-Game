import React, { useState, useEffect } from 'react';


const ProgressLights = ({ progress = 0, percentage = 0 }) => {
  // Determine which lights should be active based on progress (0-3)
  const activeCount = Math.max(0, Math.min(3, progress));
  
  // Ensure percentage is between 0-100
  const displayPercentage = Math.max(0, Math.min(100, percentage));
  
  return (
    <div className="flex flex-col w-full h-full" style={{
      maxWidth: '100%',
      height: "100%",
      display: 'flex',
    flexDirection: 'column',
      background: '#222',
      border: '0.3vmin solid #333',
      borderRadius: '3px',
      padding: '3px',
      
    }}>
      {/* Label */}
      <div style={{
        background: '#111',
        color: '#888',
        fontSize: '1.1vmin',
        fontWeight: 'bold',
        textAlign: 'center',
        padding: '2px 0',
        letterSpacing: '1px',
        fontFamily: '"Orbitron", serif',
        textTransform: 'uppercase'
      }}>
        PROGRESS
      </div>
      
      {/* Digital Display */}
      <div style={{
        background: '#111',
        border: '1px solid #333',
        margin: '3px 0',
        padding: '0.5vmin',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          fontFamily: '"Orbitron", monospace',
          fontSize: '1.6vmin',
          color: '#ffd700',
          textShadow: '0 0 10px rgba(255, 215, 0, 0.9)',
          letterSpacing: '1px'
        }}>
          {displayPercentage.toString().padStart(3, '0')}%
        </div>
      </div>
      
      {/* Lights Container */}
      <div className="flex flex-col gap-4 my-3 px-2 flex-grow" style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',     
        height: '100%',
        gap: '5%'  
      }}>
        {[2, 1, 0].map((position) => (
          <IndicatorLight 
            key={position}
            isActive={position < activeCount}
          />
        ))}
      </div>
      
     
    </div>
  );
};

const IndicatorLight = ({ isActive }) => {
  return (
    <div style={{
      width: '100%',
      height: '1.5vmin',
      position: 'relative',
      background: '#222',
      border: '2px solid #333',
      borderRadius: '2px',
      overflow: 'visible',
      boxShadow: isActive 
        ? 'inset 0 1px 2px rgba(0, 0, 0, 0.8), 0 0 15px rgba(255, 215, 0, 0.5)'
        : 'inset 0 1px 2px rgba(0, 0, 0, 0.8)'
    }}>
      {/* The light element */}
      <div 
        style={{
          height: '100%',
          width: '100%',
          background: isActive 
            ? 'radial-gradient(circle at center, rgba(255, 236, 130, 1) 0%, rgba(255, 215, 0, 1) 30%, rgba(184, 134, 11, 0.8) 70%)' 
            : 'linear-gradient(145deg, #444, #333)',
          opacity: isActive ? 1 : 0.4,
          position: 'relative',
          zIndex: 1,
          transition: 'all 0.3s ease'
        }}
      />
      
      {/* Multiple layers for realistic glow */}
      {isActive && (
        <>
          {/* Inner bright center */}
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 60%)',
            mixBlendMode: 'overlay',
            pointerEvents: 'none'
          }}></div>
          
          {/* Horizontal light flare */}
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            background: 'linear-gradient(90deg, rgba(255, 255, 255, 0) 20%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 80%)',
            opacity: 0.7,
            pointerEvents: 'none'
          }}></div>
          
          {/* Vertical glossy highlight */}
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 30,
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 30%)',
            pointerEvents: 'none'
          }}></div>
        </>
      )}
    </div>
  );
};


const ProgressLightsDemo = ({ correct = 0 }) => {
  const [progress, setProgress] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [customValue, setCustomValue] = useState("");
  
  // Update progress based on buttons
  const updateProgress = (direction) => {
    if (direction === 'up') {
      const newProgress = Math.min(3, progress + 1);
      setProgress(newProgress);
      setPercentage(Math.round((newProgress / 3) * 100));
    } else {
      const newProgress = Math.max(0, progress - 1);
      setProgress(newProgress);
      setPercentage(Math.round((newProgress / 3) * 100));
    }
  };
  
  // Handle custom percentage input
  const handleCustomChange = (e) => {
    setCustomValue(e.target.value);
  };
  
  const applyCustomValue = () => {
    const value = parseInt(customValue) || 0;
    const clampedValue = Math.max(0, Math.min(100, value));
    setPercentage(clampedValue);
    
    // Update lights based on percentage
    if (clampedValue < 33) setProgress(0);
    else if (clampedValue < 66) setProgress(1);
    else if (clampedValue < 100) setProgress(2);
    else setProgress(3);
  };
  
  // Apply custom value when Enter is pressed
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      applyCustomValue();
    }
  };
  
  // Set initial demo value
  useEffect(() => {
    // Convert number of correct answers to progress (0-3)
    // Using a simple mapping where each correct answer = one light
    const newProgress = Math.min(3, correct);
    setProgress(newProgress);
    
    // Calculate percentage based on progress (out of 3 lights)
    setPercentage(Math.round((newProgress / 3) * 100));
  }, [correct]);
  
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <div className="relative">
        <ProgressLights progress={progress} percentage={percentage} />
      </div>
    </div>
  );
};

export default ProgressLightsDemo;