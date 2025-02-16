import React from "react";
import "./Meter.css";

const Meter = ({value}) => {
    const campledValue = Math.max(0, Math.min(11, value));
    const angle = (campledValue / 11) * 120 - 60;
    return (
        <div className="meter">
            <div className="meter-display metallic">
                <div className="meter-scale glass-cover">
                    <div className="meter-background">
                        
                        <div className="meter-ticks">
                            {[...Array(11)].map((_, i) => {
                                const tickAngle = -60 + (i * 12);
                                const radius = 90;
                                const x = radius * Math.cos(tickAngle * Math.PI / 180);
                                const y = radius * Math.sin(tickAngle * Math.PI / 180);
                                return (<div key={i} className="tick" style={{transform: `translate(${y}px, ${-x}px) rotate(${tickAngle}deg)`}}></div>);})}
                        </div>
                        <div className="meter-needle" style={{transform: `rotate(${angle}deg)` }}></div>
                    </div>
                    <div className="meter-label">W POWER</div>
                </div>
            </div>
        </div>
    );
};

export default Meter;