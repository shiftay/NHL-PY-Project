import React, { useState, useEffect } from 'react';
import './css/style.css'; // You'll need to create this CSS file and move the styles

// Function to handle dynamic SVG rendering (if needed, otherwise, simplify)
const BackgroundPieces = () => {
    return (
        <>
            <svg
                version="1.1"
                className="bgpieces"
                id="baseLayer"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="100%"
                viewBox="0 0 1024 768"
                enableBackground="new 0 0 1024 768"
                xmlSpace="preserve"
            >
                <path
                    className="secondarySVG"
                    fill="#FFFFFF"
                    opacity="1.000000"
                    stroke="none"
                    d="M1025.000000,193.000000 
            C1025.000000,320.689301 1025.000000,448.378571 1024.538818,576.533936 
            C683.051697,577.000000 342.025848,577.000000 1.000000,577.000000 
            C1.000000,449.310699 1.000000,321.621368 1.461255,193.466034 
            C342.948334,193.000000 683.974182,193.000000 1025.000000,193.000000 
        z"
                />
            </svg>

            <svg
                version="1.1"
                className="bgpieces"
                id="secondLayer"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                width="100%"
                viewBox="0 0 1024 768"
                enableBackground="new 0 0 1024 768"
                xmlSpace="preserve"
            >
                <path
                    className="mainSVG"
                    fill="#FFFFFF"
                    opacity="1.000000"
                    stroke="none"
                    d="M1.000000,257.462646 
            C342.024902,257.000000 683.049805,257.000000 1024.537354,257.000000 
            C1025.000000,342.024902 1025.000000,427.049805 1024.540283,512.537354 
            C683.053711,513.000000 342.026855,513.000000 1.000000,513.000000 
            C1.000000,427.975098 1.000000,342.950195 1.000000,257.462646 
        z"
                />
            </svg>
        </>
    );
};

const TopRight = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Apply dark mode class to the body
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div id="top-right">
            <div id="dark-mode">
                <label className="switch" id="slider">
                    <input
                        id="checkbox"
                        type="checkbox"
                        checked={isDarkMode}
                        onChange={toggleDarkMode}
                    />
                    <span className="slider"></span>
                </label>
                <div id="logoSpace"></div>
            </div>
            <div id="team-holder"></div>
        </div>
    );
};

// Flip Card Component (reusable)
const FlipCard = ({ frontContent, backContent }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFrontClick = () => {
      setIsFlipped(true);
  }

  const handleBackClick = () => {
    setIsFlipped(false);
  }

  return (
    <div className={`flip-card ${isFlipped ? 'flipped' : ''}`} >
      <div className="flip-card-inner" >
        <div className="flip-card-front" onClick={handleFrontClick}>
          {frontContent}
        </div>
        <div className="flip-card-back" onClick={handleBackClick}>
          {backContent}
        </div>
      </div>
    </div>
  );
};

const PuckdleGame = () => {
    return (
        <div className="flip-card-puckdle">
            <div className="flip-card-front">
                <img id="icon" src="assets/puckdle_icon.png" alt="Puckdle Icon" />
                <div className="top-right-button" id="puckdle-info">
                    <img src="assets/info.png" alt="Info" />
                </div>
                <div className="button-container">
                    <div className="button">Daily</div>
                    <div className="button" onClick={() => (window.location.href = 'puckdle/')}>
                        Unlimited
                    </div>
                </div>
            </div>
            <div className="flip-card-back">
                <div className="top-right-button" id="puckdle-close-info">
                    <img src="assets/close.png" alt="Close" />
                </div>
                <div id="description">
                    <strong>Puckdle</strong>
                    <hr />
                    A Wordle Inspired Hockey game, where you attempt to guess the
                    player! Try our Daily Puzzle, or have a go at the Unlimited
                    Version!
                    <hr />
                    <i>Always a player from the most current season(2024-2025)</i>
                </div>
            </div>
        </div>
    );
};

const ScoutingReportGame = () => {
    return (
        <div className="flip-card-scouting">
            <div className="flip-card-front">
                <img id="icon" src="assets/scoutingReport.png" alt="Scouting Report" />
                <div className="top-right-button" id="scouting-info">
                    <img src="assets/info.png" alt="Info" />
                </div>
                <div className="button-container">
                    <div className="button" onClick={() => (window.location.href = 'scouting-report/')}>
                        Daily
                    </div>
                </div>
            </div>
            <div className="flip-card-back">
                <div className="top-right-button" id="scouting-close-info">
                    <img src="assets/close.png" alt="Close" />
                </div>
                <div id="description">
                    <strong>Scouting Report</strong>
                    <hr />
                    Can you figure out the connections from the different subjects?
                    <br />
                    A connections-style game using NHL subjects.
                    <hr />
                    <i>Updates daily.</i>
                </div>
            </div>
        </div>
    );
};

const FaceOffGame = () => {
    return (
        <div className="flip-card-scouting">
            <div className="flip-card-front">
                <img id="icon" src="assets/faceoff_icon.png" alt="Face Off" />
                <div className="top-right-button" id="scouting-info">
                    <img src="assets/info.png" alt="Info" />
                </div>
                <div className="button-container">
                    <div className="button" onClick={() => (window.location.href = 'face-off/')}>
                        Head there
                    </div>
                </div>
            </div>
            <div className="flip-card-back">
                <div className="top-right-button" id="scouting-close-info">
                    <img src="assets/close.png" alt="Close" />
                </div>
                <div id="description">
                    <strong>Face Off</strong>
                    <hr />
                    Can you handle the pressure at center ice?
                    <br />
                    A competitive game of connecting players.
                    {/* <hr>
                        <i>Updates daily.</i> */}
                </div>
            </div>
        </div>
    );
};

const CompletedGrid = () => {
    return (
        <div className="completed-grid">
            <div className="word-grid-holder" id="word-grid-holder">
                <FlipCard frontContent={<PuckdleGame />} backContent={<PuckdleGame />} />
                <FlipCard frontContent={<ScoutingReportGame />} backContent={<ScoutingReportGame />} />
                <FlipCard frontContent={<FaceOffGame />} backContent={<FaceOffGame />} />
            </div>
        </div>
    );
};

const MainContent = () => {
    return (
        <main>
            <CompletedGrid />
        </main>
    );
};

const CheldleApp = () => {
    return (
        <div id="body">
            <BackgroundPieces />
            <TopRight />
            <div className="container">
                <MainContent />
            </div>
            {/* Remove script tag.  React does not use script tags in this way. */}
        </div>
    );
};

export default CheldleApp;