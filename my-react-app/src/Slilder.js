import React, { useState } from "react";
import "./Silder.css";
import { motion } from "framer-motion";

const Slider = () => {
    const [value, setValue] = useState(50);
    return (
        <div className="slider-container">
            <div className="slider-track"></div>
            <div className="slider-scale">
                {Array.from({length: 10}).map((_, i) => (
                    <div key={i} className="scale-marker">{10- i}</div>
                ))}
            </div>

            <motion.div
                drag='y'
                dragConstraints={{top: 0, bottom: 200}}
                dragElastic={0.1}
                onDrag={(event, info) => {
                    const newValue = Math.max(0, Math.min(100, 50 - info.point.y/ 1.5));
                    setValue(newValue);
                }}
                className="slider-knob">
                    <div className="knob-indicator"></div>
            </motion.div>
            <div className="indicator-light"></div>
        </div>
    );
};

export default Slider;