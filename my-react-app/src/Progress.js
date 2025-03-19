import React, { useState, useEffect } from 'react';
import './Progress.css';

const Progress = ({
    progress = 45,
    maxValue = 90,
    label = "Progress",
    primaryScale = "FM",
    secondaryScale = "AM"
}) => {
    const [currentProgress, setCurrentProgress] = useState(0);

    useEffect(() => {
        const animationDuration = 1500;
        const startTime = Date.now();
        const startValue = currentProgress;
        const targetValue = Math.min(maxValue, Math.max(0, progress));

        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const animationProgress = Math.min(elapsed / animationDuration, 1);

            setCurrentProgress(startValue + (animationProgress * (targetValue - startValue)));

            if (animationProgress >= 1) {
                clearInterval(interval);
            }
        }, 16);
        return () => clearInterval(interval);
    }, [progress, maxValue]);

    // Calculate position from bottom (for vertical orientation)
    const indicatorPosition = `${(currentProgress / maxValue) * 100}%`;

    const generateTicks = (count, isMajor = false) => {
        return Array.from({length: count}).map((_, index) => {
            const position = `${(index / (count - 1)) * 100}%`;
            return (
                <div
                    key={`tick-${index}-${isMajor ? 'major' : 'minor'}`}
                    className={isMajor ? 'tick-major' : 'tick-minor'} 
                    style={{ bottom: position }}
                />
            );
        });
    };

    const generateFrequencyNumbers = (start, end, count, left = false) => {
        return Array.from({length : count}).map((_, index) => {
            const value = start + ((end - start) / (count - 1)) * index;
            const position = `${(index / (count - 1)) * 100}%`;
            
            // Round to 1 decimal place to avoid long numbers
            const displayValue = Math.round(value * 10) / 10;

            return (
                <div 
                  key={`freq-${index}`}
                  className={left ? 'frequency-number-left' : 'frequency-number-right'} 
                  style={{ bottom: position }}
                >
                  {displayValue}
                </div>
            );
        });
    };

    return (
        <div className="progress-container vertical">
          <div className="tuner-box">
            <div className="scale-labels">
              <span className="scale-label">{primaryScale}</span>
              <span className="scale-label">{secondaryScale}</span>
            </div>
            
            {/* Main tuner display */}
            <div className="tuner-display">
              {/* Primary scale (left) */}
              <div className="primary-scale">
                <div className="scale-inner">
                  {generateTicks(21)}
                  {generateFrequencyNumbers(88, 108, 6, true)}
                  <div className="gradient-line-container">
                    <div className="gradient-line-primary"></div>
                  </div>
                </div>
              </div>
              
              {/* Secondary scale (right) */}
              <div className="secondary-scale">
                <div className="scale-inner">
                  {generateTicks(17)}
                  {generateFrequencyNumbers(53, 160, 5)}
                  <div className="gradient-line-container">
                    <div className="gradient-line-secondary"></div>
                  </div>
                </div>
              </div>
              
              {/* Indicator needle */}
              <div 
                className="indicator-needle"
                style={{ bottom: indicatorPosition }}
              >
                <div className="needle-dot left"></div>
                <div className="needle-dot right"></div>
              </div>
            </div>
            
            {/* Label and value */}
            <div className="label-container">
              <span className="label-text">{label}</span>
              <span className="value-text">{Math.round(currentProgress)}%</span>
            </div>
            
            {/* Branding */}
            <div className="branding">
              <span className="brand-text">Progress</span>
            </div>
          </div>
        </div>
      );
};

export default Progress;