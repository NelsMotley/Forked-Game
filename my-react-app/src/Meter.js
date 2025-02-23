import React,  { useState }  from "react";
import "./Meter.css";

const Meter = ({value}) => {
    const campledValue = Math.max(0, Math.min(1, value));
    const angle = -30 + (campledValue * 60);
    const totalTicks = 10;

    const [wobble, setWobble] = useState(false);

    const handleTransitionEnd = (e) => {
        // Trigger wobble effect
        setWobble(true);
        // Remove wobble class after animation completes (adjust time to match animation duration)
        setTimeout(() => {
          setWobble(false);
        }, 800);
      };

    return (
        <div className="meter">
            <div className="meter-display metallic">
                <div className="meter-scale glass-cover">
                    <div className="meter-background">
                        
                        <div className="meter-ticks">
                            {[...Array(10)].map((_, i) => {
                                const tickFraction = i/(totalTicks - 1);
                                const tickAngle = -30 + tickFraction * 60;
                                const radius = 180;
                                const x = radius * Math.cos(tickAngle * Math.PI / 180);
                                const y = radius * Math.sin(tickAngle * Math.PI / 180);
                                return (<div key={i} className="tick" 
                                style={{transform: `translate(${y}px, ${-x}px) rotate(${tickAngle}deg)`}}></div>);})}
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