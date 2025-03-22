import React, { useState, useRef, useEffect } from "react";
import "./Meter.css";

const Meter = ({value}) => {
    const meterRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const clampedValue = Math.max(0, Math.min(1, value));
    const angle = -30 + (clampedValue * 60);
    const totalTicks = 10;

    const [wobble, setWobble] = useState(false);

    useEffect(() => {
        const updateDimensions = () => {
            if (meterRef.current) {
                const width = meterRef.current.offsetWidth;
                const height = meterRef.current.offsetHeight;
                setDimensions({ width, height });
            }
        };

        // Initial dimensions
        updateDimensions();
        
        // Update dimensions on window resize
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const handleTransitionEnd = (e) => {
        // Trigger wobble effect
        setWobble(true);
        // Remove wobble class after animation completes (adjust time to match animation duration)
        setTimeout(() => {
          setWobble(false);
        }, 800);
    };

    const getTickPosition = (index) => {
        const tickFraction = index / (totalTicks - 1);
        const tickAngle = -30 + tickFraction * 60;
        
        const radius = dimensions.width * 0.6;
        const x = radius * Math.cos(tickAngle * Math.PI / 180);
        const y = radius * Math.sin(tickAngle * Math.PI / 180);
        
        return {
            transform: `translate(${y}px, ${-x}px) rotate(${tickAngle}deg)`
        };
    };

    return (
        <div className="meter" ref={meterRef}>
            <div className="meter-display metallic">
                <div className="meter-scale glass-cover">
                    <div className="meter-background">
                        
                        <div className="meter-ticks">
                            {[...Array(totalTicks)].map((_, i) => (
                                <div 
                                    key={i} 
                                    className="tick" 
                                    style={getTickPosition(i)}
                                ></div>
                            ))}
                        </div>
                         <div className={`meter-needle ${wobble ? "wobble" : ""}`}
                            style={{
                                transform: `rotate(${angle}deg)`,
                                "--final-angle": `${angle}deg`,
                             }}
                            onTransitionEnd={handleTransitionEnd}
                            ></div>
                        <div className="arc"></div>
                    </div>
                    <div className="meter-label">{value * 4} Lives</div>
                </div>
            </div>
        </div>
    );
};

export default Meter;