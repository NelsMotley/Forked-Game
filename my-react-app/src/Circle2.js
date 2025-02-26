import React, {useEffect, useState} from 'react';
import './Circle2.css';
import $ from 'jquery';
import { Textfit } from 'react-textfit';
import Meter from './Meter.js';
import Slider from './Slilder.js';
import Arm from './Arm.js';
import axios from 'axios';
import ArmPortal from './ArmPortal.js';

const Circle2 = () => {
    const [smallCircleRotation, setSmallCircleRotation] = useState(0);
    const [bigCircleRotation, setBigCircleRotation] = useState(0);
    const [hugeCircleRotation, setHugeCircleRotation] = useState(0);
    const [isOdd, setIsOdd] = useState(false);
    const [isOdd2, setIsOdd2] = useState(true);
    const[feedback, setFeedback] = useState("");
    const [data, setData] = useState([]);
    const [smallCircleAnswer, setSmallCircleAnswer] = useState("");
    const [bigCircleAnswer, setBigCircleAnswer] = useState("");
    const [hugeCircleAnswer, setHugeCircleAnswer] = useState("");
    const [selectedCircle, setSelectedCircle] = useState("small");
    const [smallCurrent, setSmallCurrent] = useState("");
    const [bigCurrent, setBigCurrent] = useState("");
    const [hugeCurrent, setHugeCurrent] = useState("");
    const [hugeTransitionDuration, setHugeTransitionDuration] = useState("0.7s");
    const [bigTransitionDuration, setBigTransitionDuration] = useState("0.5s");
    const [smallTransitionDuration, setSmallTransitionDuration] = useState("0.5s");
    const [hugeRight, setHugeRight] = useState([0,0,1,0]);
    const [lives, setLives] = useState(4);
    const [score, setScore] = useState(0.0);
    const [hugeSolved, setHugeSolved] = useState(false);
    const [bigSolved, setBigSolved] = useState(false);
    const [smallSolved, setSmallSolved] = useState(false);
    const [numCorrect, setNumCorrect] = useState(0);
    const [win, setWin] = useState(0);
    const [finished, setFinished] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const DEFAULT_OFFSET = 45;


    const handleSelectedOption = (option) => {
        setSelectedOption(option);
    };

    const isSelectionCorrect = () => {
        if (selectedOption === 1 && lives > 0) {
            if (data.option1 === data.score) {
                console.log("Correct option 1");
                setWin(45);
                setFinished(false);
                setScore(10);
            }
            else {
                setLives((prev) => prev - 1);
            }
        } 
        else if (selectedOption === 2 && lives > 0) {
            if (data.option2 === data.score) {
                console.log("Correct option 2");
                setWin(45);
                setFinished(false);
                setScore(10);
            }
            else {
                setLives((prev) => prev - 1);
            }
        }
        else if (selectedOption === 3 && lives > 0) {
            if (data.option3 === data.score) {
                console.log("Correct option 3");
                setWin(45);
                setFinished(false);
                setScore(10);
            }
            else {
                setLives((prev) => prev - 1);
            }
        }
        // Add further logic here for when a button is selected.
      };

    useEffect(() => {
        axios.get('http://localhost:5000/api/review')
            .then(response => {
                console.log(response.data);
                setData(response.data);
                setBigCircleAnswer(response.data.answer2);
                setSmallCircleAnswer(response.data.answer1);
                setHugeCircleAnswer(response.data.answer3);
                setSmallCurrent(response.data.score1);
                setBigCurrent(response.data.genre1);
                setHugeCurrent(response.data.sentence1);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const handleCircleClick = (circle) => {
        console.log("Selected circle: " + circle);
        
    }

    const set_bias = (circleType, quadrant)=> {
        console.log("current huge: " + circleType);
        if (circleType === "huge") {
            if(quadrant === "top") {
                setHugeRight([0,0,1,0]);
            }
            else if (quadrant === "right") {
                setHugeRight([0,0,0,1]);
            }
            else if (quadrant === "bottom") {
                setHugeRight([0,1,0,0]);
            }
            else if (quadrant === "left") {
                setHugeRight([1,0,0,0]);
        }
    }
    }

    const handleQuadrantClick = (circleType, quadrantName, e) => {
        // Prevent the click from bubbling to parent elements (if needed)
        e.stopPropagation();
        console.log(`Clicked ${quadrantName} quadrant of ${circleType} circle`);
        let targetRotation;
        if (circleType === 'small' && !smallSolved) {
            setSmallCircleRotation((prev) => {
                switch (quadrantName) {
                    case 'top':
                        setSmallCurrent(data.score1);
                        targetRotation = 0;
                        break;
                    case 'right':
                        setSmallCurrent(data.score2);
                        targetRotation = -90;
                        break;
                    case 'bottom':
                        setSmallCurrent(data.score4);
                        targetRotation = 180;
                        break;
                    case 'left':
                        setSmallCurrent(data.score3);
                        targetRotation = 90;
                        break;
                    default:
                        targetRotation = prev;
                }
                const shortestRotation = ((targetRotation - prev + 540) % 360) - 180;
                console.log("Shortest rotation: " + shortestRotation);
                if (Math.abs(shortestRotation) > 90) {
                    setSmallTransitionDuration("0.8s"); // slower for far rotations
                } else {
                    setSmallTransitionDuration("0.5s");
                }
                return prev + shortestRotation;
            });
        }
        else if (circleType === 'big' && !bigSolved) {
            setBigCircleRotation((prev) => {
                switch (quadrantName) {
                    case 'top':
                        setBigCurrent(data.genre1);
                        setIsOdd(false);
                        targetRotation = 0;
                        break;
                    case 'right':
                        setBigCurrent(data.genre2);
                        setIsOdd(true);
                        targetRotation = -90;
                        break;
                    case 'bottom':
                        setBigCurrent(data.genre4);
                        setIsOdd(false);
                        targetRotation = 180;
                        break;
                    case 'left':
                        setBigCurrent(data.genre3);
                        setIsOdd(true);
                        targetRotation = 90;
                        break;
                    default:
                        return prev;
                }
                const shortestRotation = ((targetRotation - prev + 540) % 360) - 180;
                console.log("Shortest rotation: " + shortestRotation);
                if (Math.abs(shortestRotation) > 90) {
                    setBigTransitionDuration("0.9s"); // slower for far rotations
                } else {
                    setBigTransitionDuration("0.5s");
                }
                return prev + shortestRotation;
            });
            
        }
        else if (circleType === 'huge' && !hugeSolved) {
            setHugeCircleRotation((prev) => {
                switch (quadrantName) {
                    case 'top':
                        setHugeCurrent(data.sentence1);
                        setIsOdd2(true);
                        targetRotation = 0;
                        break;
                    case 'right':
                        setHugeCurrent(data.sentence2);
                        setIsOdd2(false);
                        targetRotation = -90;
                        break;
                    case 'bottom':
                        setHugeCurrent(data.sentence4);
                        setIsOdd2(true);
                        targetRotation = 180;
                        break;
                    case 'left':
                        setHugeCurrent(data.sentence3);
                        setIsOdd2(false);
                        targetRotation = 90;
                        break;
                    default:
                        return prev;
                }
                set_bias(circleType, quadrantName);

                const shortestRotation = ((targetRotation - prev + 540) % 360) - 180;
                console.log("Shortest rotation: " + shortestRotation);
                if (Math.abs(shortestRotation) > 90) {
                    setHugeTransitionDuration("1.2s"); // slower for far rotations
                } else {
                    setHugeTransitionDuration("0.7s");
                }
                return prev + shortestRotation;
            });
        }
        // Perform any other logic here
      };

      const handleRotateClick = () => {
        axios.get('http://localhost:5000/api/review')
            .then(response => {
                const newData = response.data;
                console.log("New puzzle data:", newData);
                setData(newData);
                setBigCircleAnswer(newData.answer2);
                setSmallCircleAnswer(newData.answer1);
                setHugeCircleAnswer(newData.answer3);
                setSmallCurrent(newData.score1);
                setBigCurrent(newData.genre1);
                setHugeCurrent(newData.sentence1);
                // Reset rotations if you prefer a consistent starting point:
                setSmallCircleRotation(0);
                setBigCircleRotation(0);
                setHugeCircleRotation(0);
                setHugeRight([0,0,1,0]);
                setIsOdd(false);
                setIsOdd2(true);
                setLives(4);
                setScore(0.0);
                setHugeSolved(false);
                setBigSolved(false);
                setSmallSolved(false);
                setWin(0);
                setFinished(false);
            })
            .catch(error => {
                console.error("Error fetching new puzzle:", error);
            });
    };

    const rotateHugeCircle = () => {
        setHugeCircleRotation((prev) => prev + 90);
        setIsOdd2((prev) => !prev);
        console.log("Huge circle: " + hugeCircleRotation % 360);
    }

    const rotateSmallCircle = () => {
        setSmallCircleRotation((prev) => prev + 90);
        console.log("Small circle: " + smallCircleRotation % 360);
    }

    const rotateBigCircle = () => {
        setBigCircleRotation((prev) => prev + 90);
        setIsOdd((prev) => !prev);
        console.log("big circle: " + bigCircleRotation % 360);
    }

    const getTextRotation = (baseRotation, offset) => {
        return -baseRotation + offset;
    };

    const offestRotation = (baseRotation) => {
        if (isOdd) {
            console.log("is odd");
            return -baseRotation-45;
        } else {
            return -baseRotation-135;
        }
    }

    const offestRotation2 = (baseRotation) => {
        if (isOdd) {
            console.log("is odd");
            return -baseRotation-135;
        } else {
            return -baseRotation -45;
        }
    }

    const offestRotation_h = (baseRotation) => {
        if (isOdd2) {
            return -baseRotation -45;
        } else {
            return -baseRotation-135;
        }
    }

    const offestRotation2_h = (baseRotation) => {
        
        if (isOdd2) {
            return -baseRotation - 135;
        } else {
            return -baseRotation - 45;
        }
    }

    const checkAnswers = () => {
        if (lives === 0) {
            setFeedback("Game Over :/");
            return;
        }
        if (smallSolved && bigSolved && hugeSolved) {
            isSelectionCorrect();
            return;
        }
        if (smallCurrent === smallCircleAnswer && bigCurrent === bigCircleAnswer && hugeCurrent === hugeCircleAnswer && numCorrect <= 3) {
            setFinished(true);
            setSmallSolved(true);
            setBigSolved(true);
            setHugeSolved(true);
            setScore((prev) => Math.round(((Math.random() * 2 + 7)) * 10) / 10);
            console.log(smallSolved);
            console.log("Correct");
            setFeedback("Correct");
        } else {
            let correctAnswers = 0;
            if (smallCurrent === smallCircleAnswer) {
                correctAnswers++;
                setSmallSolved(true);
            }
            if (bigCurrent === bigCircleAnswer){
                correctAnswers++;
                setBigSolved(true);
            } 
            if (hugeCurrent === hugeCircleAnswer){
                correctAnswers++;
                setHugeSolved(true);
            }
           
            if (correctAnswers === 1 && numCorrect < 1) {
                setScore((prev) => Math.round(((Math.random() * 2 + 2)) * 10) / 10);
                setFeedback("1 out of 3 correct");
            } else if (correctAnswers === 2 && numCorrect < 2) {  
                setScore((prev) => Math.round(((Math.random() * 2 + 4)) * 10) / 10);
                setFeedback("2 out of 3 correct");
            }
            setNumCorrect(correctAnswers);
            setLives((prev) => prev - 1);
            if (lives === 1) {
                setFeedback("Game Over :/");
                return;
            }
            setFeedback("Incorrect");
            console.log("Incorrect big correct answer is: " + bigCircleAnswer + " and small correct answer is: " + smallCircleAnswer);
        }
    };

    return (
        <div>
            <div className='fake'>
            <div className='test'>
            <div className='logo-container'>
            <div className='logo'>
            <Textfit mode="single" forceSingleModeWidth={true} max={60} style={{ width: '90%', height: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <h2 className="question-label"> {data.artist} </h2>
                </Textfit>
            </div>
            <div className='subtitle-wrapper'>
                <Textfit mode="single" forceSingleModeWidth={true} max={60} style={{ width: '90%', height: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="orbitron-subtitle">{data.album}</div>
                </Textfit>
            </div>
            </div>
          
        <div className='content-container'>
        <div className='circle-container'>
            
            <div className='circle-wrapper'>
            <div className="inner-circle"></div>
            <div className={`circle2 small-circle ${selectedCircle === 'small' ? 'selected' : ''}`} style={{ transform: `translate(-50%, -50%) rotate(${smallCircleRotation + 45}deg)`, transition: `transform ${smallTransitionDuration} ease-in-out`}} onClick={() => handleCircleClick('small')}>
                <div className={`quadrant top-left ${smallSolved ? (data.score1 === smallCircleAnswer ? "correct-quadrant2" : "incorrect-quadrant2") : "" }`}  
                onClick={(e) => handleQuadrantClick("small", "top", e)}>
                    <div className='quadrant-text' style={{ transform: `rotate(${-smallCircleRotation - 45}deg)` }}>{data.score1}</div>
                </div>
                <div className={`quadrant top-right ${smallSolved ? (data.score2 === smallCircleAnswer ? "correct-quadrant2" : "incorrect-quadrant2") : "" }`}
                onClick={(e) => handleQuadrantClick("small", "right", e)}>
                    <div className='quadrant-text' style={{ transform: `rotate(${-smallCircleRotation - 45 }deg)` }}>{data.score2}</div>
                </div>
                <div className={`quadrant bottom-left ${smallSolved ? (data.score3 === smallCircleAnswer ? "correct-quadrant2" : "incorrect-quadrant2") : "" }`}
                    onClick={(e) => handleQuadrantClick("small", "left", e)}>
                    <div className='quadrant-text' style={{ transform: `rotate(${-smallCircleRotation - 45}deg)` }}>{data.score3}</div>
                </div>
                <div className={`quadrant bottom-right ${smallSolved ? (data.score4 === smallCircleAnswer ? "correct-quadrant2" : "incorrect-quadrant2") : "" }`}
                onClick={(e) => handleQuadrantClick("small", "bottom", e)}><div className='quadrant-text' style={{ transform: `rotate(${-smallCircleRotation - 45}deg)` }}>{data.score4}</div></div>
            </div>

            <div className={`circle2 big-circle ${selectedCircle === 'big' ? 'selected' : ''}`} style={{ transform: `translate(-50%, -50%) rotate(${bigCircleRotation + 45}deg)`, transition: `transform ${bigTransitionDuration} ease-in-out`}} onClick={() => handleCircleClick("big")}>
                <div className={`quadrant top-left ${bigSolved ? (data.genre1 === bigCircleAnswer ? "correct-quadrant" : "incorrect-quadrant") : "" }`} 
                onClick={(e) => handleQuadrantClick("big", "top", e)}>
                    <div className='quadrant-text' style={{ transform: `rotate(${offestRotation(bigCircleRotation)}deg)` }}>{data.genre1}</div>
                </div>
                <div className={`quadrant top-right ${bigSolved ? (data.genre2 === bigCircleAnswer ? "correct-quadrant" : "incorrect-quadrant") : "" }`}
                    onClick={(e) => handleQuadrantClick("big", "right", e)}>
                    <div className='quadrant-text' style={{ transform: `rotate(${offestRotation2(bigCircleRotation)}deg)` }}>{data.genre2}</div>
                </div>
                <div className={`quadrant bottom-left ${bigSolved ? (data.genre3 === bigCircleAnswer ? "correct-quadrant" : "incorrect-quadrant") : "" }`}
                    onClick={(e) => handleQuadrantClick("big", "left", e)}>
                    <div className='quadrant-text' style={{ transform: `rotate(${offestRotation2(bigCircleRotation)}deg)` }}>{data.genre3}</div>
                </div>
                <div className={`quadrant bottom-right ${bigSolved ? (data.genre4 === bigCircleAnswer ? "correct-quadrant" : "incorrect-quadrant") : "" }`}
                    onClick={(e) => handleQuadrantClick("big", "bottom", e)}>
                    <div className='quadrant-text' style={{ transform: `rotate(${offestRotation(bigCircleRotation)}deg)` }}>{data.genre4}</div>
                </div>
            </div>
            <div className = "huge-circle-wrapper">
            <div className={`circle2 huge-circle ${selectedCircle === 'huge' ? 'selected' : ''}`} style={{ transform: `rotate(${hugeCircleRotation + 45}deg)`, transition: `transform ${hugeTransitionDuration} ease-in-out`}} onClick={() => handleCircleClick("huge")}>
            <div className={`quadrant top-left ${
                hugeSolved
                ? (data.sentence1 === hugeCircleAnswer ? "correct-quadrant" : "incorrect-quadrant")
                : ""
                }`}
                onClick={(e) => handleQuadrantClick("huge", "top", e)}>
                <div className='quadrant-text' style={{ transform: `rotate(${offestRotation_h(hugeCircleRotation) + 180 * hugeRight[0]}deg)` }}>{data.sentence1}</div>
                </div>
                <div className={`quadrant top-right ${
                    hugeSolved
                    ? (data.sentence2 === hugeCircleAnswer ? "correct-quadrant" : "incorrect-quadrant")
                    : ""
                }`}
                    onClick={(e) => handleQuadrantClick("huge", "right", e)}>
                    <div className='quadrant-text' style={{ transform: `rotate(${offestRotation2_h(hugeCircleRotation) + 180 * hugeRight[2]}deg)` }}>{data.sentence2}</div>
                </div>
                <div className={`quadrant bottom-left ${hugeSolved
                ? (data.sentence3 === hugeCircleAnswer ? "correct-quadrant" : "incorrect-quadrant")
                : ""
                }`} 
                onClick={(e) => handleQuadrantClick("huge", "left", e)}>
                    <div className='quadrant-text' style={{ transform: `rotate(${offestRotation2_h(hugeCircleRotation) + 180 * hugeRight[1]}deg)` }}>{data.sentence3}</div>
                </div>
                <div className={`quadrant bottom-right ${hugeSolved
                ? (data.sentence4 === hugeCircleAnswer ? "correct-quadrant" : "incorrect-quadrant")
                : ""
                }`} 
                onClick={(e) => handleQuadrantClick("huge", "bottom", e)}>
                    <div className='quadrant-text' style={{ transform: `rotate(${offestRotation_h(hugeCircleRotation) + 180 * hugeRight[3]}deg)` }}>{data.sentence4}</div>
                </div>
            </div>
            </div>
            <div className="inverse-overlay"></div>
            
            </div>
        </div>

        
        
        </div>
            <div className={`feedback ${score === 10 ? 'feedback-active' : ''}`}>
                
            </div>
            <div className='meter-container'>
            
            <Meter value = {lives/4}/>
            </div>
            <div className='buttons-container'> 
                <div className='button-housing'><button className = "play-button" onClick={handleRotateClick}>New <br></br> Puzzle</button></div>    
                
                <div className='button-housing'><button className = "play-button"  onClick={checkAnswers}>Check <br></br>Answer</button></div>
            

            {/* New row of option buttons */}
            { (bigSolved && smallSolved && hugeSolved) && (
                <div className="option-buttons">
                
                </div>
            )}
            </div>
                <h1 style={{height: "50px"}}></h1>
            </div>
            <div className="life-bar-container">
                 
            </div> 
            </div>
            <div className='Slider-container'>
                <Slider value = {win}/>
            </div>
            
            <ArmPortal>
                <div className='arm-container'> 
                    <Arm value = {win} data = {data} onSelect={handleSelectedOption} selectedOption={selectedOption} fin = {finished}/>
                </div>
                
            </ArmPortal>
        
        </div>

        
        
    );
};

const LifeBar = ({lives}) => {
    return (
        <div className='life-bar'>
            {[...Array(4)].map((_, index) => (
                <div key={index} className={`life-square ${index < lives ? 'active' : 'inactive'}`}></div>
            ))}
        </div>
    );
};

export default Circle2;