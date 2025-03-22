import React, {useEffect, useState} from 'react';
import './Circle2.css';
import $ from 'jquery';
import { Textfit } from 'react-textfit';
import Meter from './Meter.js';
import Slider from './Slilder.js';
import Arm from './Arm.js';
import axios from 'axios';
import ArmPortal from './ArmPortal.js';
import VictoryModal from './WinScreen.js';
import GuideModal from './InfoScreen.js';


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
    const [numRounds, setNumRounds] = useState(0);
    const [wholeJSON, setWholeJSON] = useState([])
    const [hasWon, setHasWon] = useState(false);
    const API_URL = process.env.REACT_APP_API_URL || 'https://forked-game-production.up.railway.app/api/review';

    const DEFAULT_OFFSET = 45;


    const handleSelectedOption = (option) => {
        setSelectedOption(option);
    };

    useEffect(() => {
        // Check screen width when component mounts
        const handleScreenSize = () => {
          if (window.innerWidth < 800) {
            setWin(-10);
          }
        };
        handleScreenSize();
        
        
    }, []);

   

    const handleScreenSize = () => {
        if (window.innerWidth < 800) {
          setWin(-10);
        }
      };

    const isSelectionCorrect = () => {
        if (selectedOption === 1 && lives > 0) {
            if (data.option1 === data.score) {
                console.log("Correct option 1");
                setWin(45);
                setNumRounds(numRounds + 1);
                
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
                setNumRounds(numRounds + 1);
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
                setNumRounds(numRounds + 1);
               
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
        axios.get(API_URL)
            .then(response => {
                console.log(response.data);
                setData(response.data.easy);
                setWholeJSON(response.data);
                setBigCircleAnswer(response.data.easy.correct_genre);
                setSmallCircleAnswer(response.data.easy.correct_score);
                setHugeCircleAnswer(response.data.easy.correct_quote);
                setSmallCurrent(response.data.easy.scores.s1);
                setBigCurrent(response.data.easy.genres.g1);
                setHugeCurrent(response.data.easy.quotes.q1);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const reset_game = () => {
        axios.get(API_URL)
            .then(response => {
                console.log(response.data);
                setData(response.data.easy);
                setWholeJSON(response.data);
                setBigCircleAnswer(response.data.easy.correct_genre);
                setSmallCircleAnswer(response.data.easy.correct_score);
                setHugeCircleAnswer(response.data.easy.correct_quote);
                setSmallCurrent(response.data.easy.scores.s1);
                setBigCurrent(response.data.easy.genres.g1);
                setHugeCurrent(response.data.easy.quotes.q1);
                setNumRounds(0);
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
                    handleScreenSize();
                    setFinished(false);
            })
            .catch(error => {
                console.log(error);
            });
    }

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
                        setSmallCurrent(data.scores.s1);
                        targetRotation = 0;
                        break;
                    case 'right':
                        setSmallCurrent(data.scores.s3);
                        targetRotation = -90;
                        break;
                    case 'bottom':
                        setSmallCurrent(data.scores.s4);
                        targetRotation = 180;
                        break;
                    case 'left':
                        setSmallCurrent(data.scores.s2);
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
                        setBigCurrent(data.genres.g1);
                        setIsOdd(false);
                        targetRotation = 0;
                        break;
                    case 'right':
                        setBigCurrent(data.genres.g2);
                        setIsOdd(true);
                        targetRotation = -90;
                        break;
                    case 'bottom':
                        setBigCurrent(data.genres.g4);
                        setIsOdd(false);
                        targetRotation = 180;
                        break;
                    case 'left':
                        setBigCurrent(data.genres.g3);
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
                        setHugeCurrent(data.quotes.q1);
                        setIsOdd2(true);
                        targetRotation = 0;
                        break;
                    case 'right':
                        setHugeCurrent(data.quotes.q2);
                        setIsOdd2(false);
                        targetRotation = -90;
                        break;
                    case 'bottom':
                        setHugeCurrent(data.quotes.q4);
                        setIsOdd2(true);
                        targetRotation = 180;
                        break;
                    case 'left':
                        setHugeCurrent(data.quotes.q3);
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
        
                if (finished && numRounds < 3){
                    
                    if(win != 45){
                        setNumRounds(0);
                    }

                    if (numRounds == 1){
                        
                        setData(wholeJSON.medium);
                        setBigCircleAnswer(wholeJSON.medium.correct_genre);
                        setSmallCircleAnswer(wholeJSON.medium.correct_score);
                        setHugeCircleAnswer(wholeJSON.medium.correct_quote);
                        setSmallCurrent(wholeJSON.medium.scores.s1);
                        setBigCurrent(wholeJSON.medium.genres.g1);
                        setHugeCurrent(wholeJSON.medium.quotes.q1);
                    }
                
                    if(numRounds == 2){
                        setData(wholeJSON.hard);
                        setBigCircleAnswer(wholeJSON.hard.correct_genre);
                        setSmallCircleAnswer(wholeJSON.hard.correct_score);
                        setHugeCircleAnswer(wholeJSON.hard.correct_quote);
                        setSmallCurrent(wholeJSON.hard.scores.s1);
                        setBigCurrent(wholeJSON.hard.genres.g1);
                        setHugeCurrent(wholeJSON.hard.quotes.q1);
                    }
                    
                    
                    setSmallCircleRotation(0);
                    setBigCircleRotation(0);
                    setHugeCircleRotation(0);
                    setHugeRight([0,0,1,0]);
                    setIsOdd(false);
                    setIsOdd2(true);
                    if(lives < 4){
                        setLives(lives+1)
                    }
                    setScore(0.0);
                    setHugeSolved(false);
                    setBigSolved(false);
                    setSmallSolved(false);
                    setWin(0);
                    handleScreenSize();
                    setFinished(false);
                }

                
           
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
        
        if (smallCurrent === smallCircleAnswer && bigCurrent === bigCircleAnswer && hugeCurrent === hugeCircleAnswer && numCorrect <= 3) {
            setFinished(true);
            setSmallSolved(true);
            setBigSolved(true);
            setHugeSolved(true);
            setScore((prev) => Math.round(((Math.random() * 2 + 7)) * 10) / 10);
            setWin(45);
            if(win < 45){
                setNumRounds(numRounds + 1);
            }
            console.log(smallSolved);
            console.log("Correct");
            setFeedback("Correct");
            if ((numRounds + 1) >= 3 && !hasWon){
                const timer = setTimeout(() => {
                    setHasWon(true);
                  }, 2000); 
            }
        } else {
            let correctAnswers = 0;
            if (smallCurrent === smallCircleAnswer) {
               
                correctAnswers++;
                setSmallSolved(true);
            }
            if (bigCurrent === bigCircleAnswer){
                console.log("Correct is :" + bigCircleAnswer + " current is " + bigCurrent)
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
                const timer = setTimeout(() => {
                    setHasWon(true);
                  }, 2000); 
                setFeedback("Game Over :/");
                return;
            }
            setFeedback("Incorrect");
            console.log("Big current is " + bigCurrent + " and small answer is " + bigCircleAnswer);
        }
    };

    const [activeButton, setActiveButton] = useState('home');
    const [showInfo, setShowInfo] = useState(false);

    const handleButtonClick = (buttonId) => {
        setActiveButton(buttonId);
        if(buttonId === "home"){
            setShowInfo(false);
        }
        else{
            setShowInfo(true);
        }
    };

    return (
        <div>

            <GuideModal isVisible={showInfo} buttonId = {activeButton} onClose={() => {setShowInfo(false); setActiveButton('home');}}  />
            <div className='fake'>
            
            <div className='stereo-sidebar'>
                <div className='brand-name'>Forkle</div>
                
                    <div class="menu-buttons">
                    
                    <a href="#home" className={`stereo-button ${activeButton === 'home' ? 'active' : ''}`}
                                                onClick={() => handleButtonClick('home')}>
                        <div class="button-icon icon-play"></div>
                        <div class="button-text">play</div>
                    </a>
                    <a href="#services" 
                    className={`stereo-button ${activeButton === 'services' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('services')}
                    >
                        <div class="button-icon icon-home"></div>
                        <div class="button-text">Guide</div>
                    </a>
                    <a href="#about" 
                    className={`stereo-button ${activeButton === 'about' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('about')}
                    >
                        <div class="button-icon icon-about"></div>
                        <div class="button-text">About</div>
                    </a>
                    
                    <a href="#gallery" 
                    className={`stereo-button ${activeButton === 'gallery' ? 'active' : ''}`}
                    onClick={() => handleButtonClick('gallery')}
                    >
                        <div class="button-icon icon-gallery"></div>
                        <div class="button-text">Bug</div>
                    </a>
                    </div>
            
                    
                    
                    
            </div>
            <div className='test'>
            <div className='logo-wrapper'>
                <div className='logo-container'>
                    <div className='logo'>
                        <Textfit mode="single" forceSingleModeWidth={true} max={60} style={{ width: '90%', height: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <h2 className="question-label">{data ? data.correct_artist : ''}</h2>
                        </Textfit>
                    </div>
                    <div className='subtitle-wrapper'>
                        <Textfit mode="multi" forceSingleModeWidth={false} max={60} style={{ width: '90%', height: 'auto', display: 'flex',justifyContent: 'center', alignItems: 'center', lineHeight: 1.1 }}>
                            <div className="orbitron-subtitle">{data ? data.correct_title : ''} </div>
                        </Textfit>
                    </div>
                </div>
            </div>
           
            
          
        <div className='content-container'>
        <div className='circle-container'>
            
            <div className='circle-wrapper'>
            <div className="inner-circle"></div>
            <div className={`circle2 small-circle ${selectedCircle === 'small' ? 'selected' : ''}`} style={{ transform: `translate(-50%, -50%) rotate(${smallCircleRotation + 45}deg)`, transition: `transform ${smallTransitionDuration} ease-in-out`}} onClick={() => handleCircleClick('small')}>
                <div className={`quadrant top-left ${smallSolved ? (data.scores.s1  === smallCircleAnswer ? "correct-quadrant2" : "incorrect-quadrant2") : "" }`}  
                onClick={(e) => handleQuadrantClick("small", "top", e)}>
                    <div className='quadrant-text' style={{ transform: `rotate(${-smallCircleRotation - 45}deg)` }}>{data && data.scores ? data.scores.s1 : ''}</div>
                </div>
                <div className={`quadrant top-right ${smallSolved ? (data.scores.s3 === smallCircleAnswer ? "correct-quadrant2" : "incorrect-quadrant2") : "" }`}
                onClick={(e) => handleQuadrantClick("small", "right", e)}>
                    <div className='quadrant-text' style={{ transform: `rotate(${-smallCircleRotation - 45 }deg)` }}>{data && data.scores ? data.scores.s3 : ''}</div>
                </div>
                <div className={`quadrant bottom-left ${smallSolved ? (data.scores.s2 === smallCircleAnswer ? "correct-quadrant2" : "incorrect-quadrant2") : "" }`}
                    onClick={(e) => handleQuadrantClick("small", "left", e)}>
                    <div className='quadrant-text' style={{ transform: `rotate(${-smallCircleRotation - 45}deg)` }}>{data && data.scores ? data.scores.s2 : ''}</div>
                </div>
                <div className={`quadrant bottom-right ${smallSolved ? (data.scores.s4 === smallCircleAnswer ? "correct-quadrant2" : "incorrect-quadrant2") : "" }`}
                onClick={(e) => handleQuadrantClick("small", "bottom", e)}><div className='quadrant-text' style={{ transform: `rotate(${-smallCircleRotation - 45}deg)` }}>{data && data.scores ? data.scores.s4 : ''}</div></div>
            </div>

            <div className={`circle2 big-circle ${selectedCircle === 'big' ? 'selected' : ''}`} style={{ transform: `translate(-50%, -50%) rotate(${bigCircleRotation + 45}deg)`, transition: `transform ${bigTransitionDuration} ease-in-out`}} onClick={() => handleCircleClick("big")}>
                <div className={`quadrant top-left ${bigSolved ? (data.genres.g1 === bigCircleAnswer ? "correct-quadrant" : "incorrect-quadrant") : "" }`} 
                onClick={(e) => handleQuadrantClick("big", "top", e)}>
                    <div className='quadrant-text' style={{ transform: `rotate(${offestRotation(bigCircleRotation)}deg)` }}>{data && data.genres ? data.genres.g1 : ''}</div>
                </div>
                <div className={`quadrant top-right ${bigSolved ? (data.genres.g2 === bigCircleAnswer ? "correct-quadrant" : "incorrect-quadrant") : "" }`}
                    onClick={(e) => handleQuadrantClick("big", "right", e)}>
                    <div className='quadrant-text' style={{ transform: `rotate(${offestRotation2(bigCircleRotation)}deg)` }}>{data && data.genres ? data.genres.g2 : ''}</div>
                </div>
                <div className={`quadrant bottom-left ${bigSolved ? (data.genres.g3 === bigCircleAnswer ? "correct-quadrant" : "incorrect-quadrant") : "" }`}
                    onClick={(e) => handleQuadrantClick("big", "left", e)}>
                    <div className='quadrant-text' style={{ transform: `rotate(${offestRotation2(bigCircleRotation)}deg)` }}>{data && data.genres ? data.genres.g3 : ''}</div>
                </div>
                <div className={`quadrant bottom-right ${bigSolved ? (data.genres.g4 === bigCircleAnswer ? "correct-quadrant" : "incorrect-quadrant") : "" }`}
                    onClick={(e) => handleQuadrantClick("big", "bottom", e)}>
                    <div className='quadrant-text' style={{ transform: `rotate(${offestRotation(bigCircleRotation)}deg)` }}>{data && data.genres ? data.genres.g4 : ''}</div>
                </div>
            </div>
            <div className = "huge-circle-wrapper">
            <div className={`circle2 huge-circle ${selectedCircle === 'huge' ? 'selected' : ''}`} style={{ transform: `rotate(${hugeCircleRotation + 45}deg)`, transition: `transform ${hugeTransitionDuration} ease-in-out`}} onClick={() => handleCircleClick("huge")}>
            <div className={`quadrant top-left ${
                hugeSolved
                ? (data.quotes.q1 === hugeCircleAnswer ? "correct-quadrant" : "incorrect-quadrant")
                : ""
                }`}
                onClick={(e) => handleQuadrantClick("huge", "top", e)}>
                <div className='quadrant-text' style={{ transform: `rotate(${offestRotation_h(hugeCircleRotation) + 180 * hugeRight[0]}deg)` }}>{data && data.quotes ? data.quotes.q1 : ''}</div>
                </div>
                <div className={`quadrant top-right ${
                    hugeSolved
                    ? (data.quotes.q2 === hugeCircleAnswer ? "correct-quadrant" : "incorrect-quadrant")
                    : ""
                }`}
                    onClick={(e) => handleQuadrantClick("huge", "right", e)}>
                    <div className='quadrant-text' style={{ transform: `rotate(${offestRotation2_h(hugeCircleRotation) + 180 * hugeRight[2]}deg)` }}>{data && data.quotes ? data.quotes.q2 : ''}</div>
                </div>
                <div className={`quadrant bottom-left ${hugeSolved
                ? (data.quotes.q3 === hugeCircleAnswer ? "correct-quadrant" : "incorrect-quadrant")
                : ""
                }`} 
                onClick={(e) => handleQuadrantClick("huge", "left", e)}>
                    <div className='quadrant-text' style={{ transform: `rotate(${offestRotation2_h(hugeCircleRotation) + 180 * hugeRight[1]}deg)` }}>{data && data.quotes ? data.quotes.q3 : ''}</div>
                </div>
                <div className={`quadrant bottom-right ${hugeSolved
                ? (data.quotes.q4  === hugeCircleAnswer ? "correct-quadrant" : "incorrect-quadrant")
                : ""
                }`} 
                onClick={(e) => handleQuadrantClick("huge", "bottom", e)}>
                    <div className='quadrant-text' style={{ transform: `rotate(${offestRotation_h(hugeCircleRotation) + 180 * hugeRight[3]}deg)` }}>{data && data.quotes ? data.quotes.q4 : ''}</div>
                </div>
            </div>
            </div>
            <div className="inverse-overlay"></div>
            
            </div>
        </div>

        
        
        </div>
            <div className={`feedback ${score === 10 ? 'feedback-active' : ''}`}>
                
            </div>
            <div className='info-box'>
            <div className='meter-container'>
            
            <Meter value = {lives/4}/>
            </div>
            <div className='buttons-container'> 
                <div className='button-housing'><button className = "play-button" onClick={handleRotateClick}>Next <br></br> Puzzle</button></div>    
                
                <div className='button-housing'><button className = "play-button"  onClick={checkAnswers}>Check<br></br>Answer</button></div>
            
            </div>
            </div>


            {/* New row of option buttons */}
            { (bigSolved && smallSolved && hugeSolved) && (
                <div className="option-buttons">
                
                </div>
            )}
            
                
            </div>
            
            </div>
            
            
            <ArmPortal>
                <div className='arm-container'> 
                    <Arm value = {win} data = {data} onSelect={handleSelectedOption} selectedOption={selectedOption} fin = {finished} rounds = {numRounds}/>
                </div>
                
            </ArmPortal>
            
            <VictoryModal
                    isVisible={hasWon}
                    onClose={() => setHasWon(false)}
                    onPlayAgain={reset_game}
                    scores =  { wholeJSON.easy ?{
                        easy: { title: wholeJSON.easy.correct_title, author: wholeJSON.easy.correct_artist, date: "Date", score: wholeJSON.easy.correct_score },
                        medium: { title: wholeJSON.medium.correct_title, author: wholeJSON.medium.correct_artist, date: "Date", score:wholeJSON.medium.correct_score },
                        hard: { title: wholeJSON.hard.correct_title, author: wholeJSON.hard.correct_artist, date: "Date", score: wholeJSON.hard.correct_score }} : null
                    }
                    links={ wholeJSON.easy ? {
                        easy: wholeJSON.easy.link,
                        medium: wholeJSON.medium.link,
                        hard: wholeJSON.hard.link
                    } : null}
                    numToShow={numRounds}
                    width="400px"
                    height="300px"
            />
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