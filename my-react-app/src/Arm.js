import React,  { useState }  from "react";
import "./Arm.css";

const Arm = ({value}) => {
    return(
        <div className="arm-group">
        <div className="arm" style={{transform: `rotate(${value}deg)`}}>
            <div className="circle-part"></div>
            <div className="rect-part">
            </div>
            <div className="big-shadow"></div>
            <div className="rect-shadow"></div>
            <div className="arm-part">
                <div className="questions-layout"></div>
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