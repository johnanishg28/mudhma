import React, { useState, useRef, useEffect, useMemo } from 'react';
import './ValentinePage.css';
import proposingBear from '../assets/Dudu_proposing.webp';
import loveBoxBear from '../assets/Dudu_love_box.webp';
import danceBear from '../assets/Dudu_dance.gif';
import kissBear from '../assets/Dudu_kiss_Bubu.gif';
import hugBear from '../assets/dudu_hug_bubu.gif';
import surpriseImage from '../assets/surprise_image.jpg';
import teasingGif from '../assets/dudu_teasing_new.gif';
import finalSurpriseImage from '../assets/final_surprise.jpg';
import giftIcon from '../assets/gift.webp';
import popperIcon from '../assets/popper.svg'; // Popper is <500KB so likely skipped
import eyesIcon from '../assets/eyes.webp';
import { collageImages } from './CollageImages';

const ValentinePage = ({ onAccept }) => {
    const [noPosition, setNoPosition] = useState({ top: 'auto', left: 'auto', position: 'static' });
    const [isEscaping, setIsEscaping] = useState(false);
    const [idleNoCount, setIdleNoCount] = useState(0);
    const [surpriseNoCount, setSurpriseNoCount] = useState(0);
    const [phase, setPhase] = useState('idle'); // idle, celebration, surprise, gift, final_surprise, real_surprise
    const [showSorryButton, setShowSorryButton] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const containerRef = useRef(null);

    const resetNoButton = () => {
        setIsEscaping(false);
        setNoPosition({ top: 'auto', left: 'auto', position: 'static' });
    };

    const handleAccept = () => {
        setPhase('celebration');
        resetNoButton();
    };

    const handleSurprise = () => {
        setPhase('surprise');
        resetNoButton();
    };

    const handleGift = () => {
        setPhase('gift');
    };

    const handleFinalSurprise = () => {
        setPhase('final_surprise');
    };

    const handleNoHover = (e) => {
        const container = containerRef.current;
        if (!container) return;

        if (phase === 'idle') {
            setIdleNoCount(prev => prev + 1);
        } else if (phase === 'surprise') {
            setSurpriseNoCount(prev => prev + 1);
        }

        const btnWidth = e.target.offsetWidth || 100;
        const btnHeight = e.target.offsetHeight || 50;

        // Use window dimensions to ensure it stays on screen
        const maxX = window.innerWidth - btnWidth - 50;
        const maxY = window.innerHeight - btnHeight - 50;

        const newX = Math.max(20, Math.random() * maxX);
        const newY = Math.max(20, Math.random() * maxY);

        setIsEscaping(true);
        setNoPosition({
            position: 'fixed',
            left: `${newX}px`,
            top: `${newY}px`,
            transition: 'all 0.4s ease-out'
        });
    };

    // Hearts animation state
    const [hearts] = useState(() => Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100, // 0-100%
        delay: Math.random() * 10, // 0-10s delay
        duration: 10 + Math.random() * 10, // 10-20s duration
        size: 1.5 + Math.random() * 2, // 1.5-3.5rem size
    })));

    // Confetti animation state
    const [confetti] = useState(() => Array.from({ length: 150 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3, // 0-3s delay
        duration: 3 + Math.random() * 3, // 3-6s duration
        bg: ['#ffea00', '#ff4d6d', '#2ec4b6', '#7209b7', '#3a86ff'][Math.floor(Math.random() * 5)],
        size: 0.8 + Math.random() * 0.5 // random size
    })));

    // Timer for Sorry Button in final_surprise phase
    useEffect(() => {
        if (phase === 'final_surprise') {
            const timer = setTimeout(() => {
                setShowSorryButton(true);
            }, 5000);
            return () => clearTimeout(timer);
        } else {
            setShowSorryButton(false);
        }
    }, [phase]);

    // Partition images for the 3-section layout
    const { leftImages, centerImage, rightImages } = useMemo(() => {
        const special = collageImages.find(img => img.isSpecial);
        const others = collageImages.filter(img => !img.isSpecial); // Should be 18 items

        // Shuffle others for randomness
        for (let i = others.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [others[i], others[j]] = [others[j], others[i]];
        }

        // Helper to add 'Cross Crossed' rotation (Alternating)
        const addRotation = (items) => items.map((img, index) => ({
            ...img,
            // Even indexes tilt right (+), Odd indexes tilt left (-)
            // Fixed angle (18deg) + small random jitter -> Strong "/ \ / \" pattern
            rotation: (index % 2 === 0 ? 1 : -1) * (18 + Math.random() * 3)
        }));

        return {
            centerImage: special,
            leftImages: addRotation(others.slice(0, 9)),
            rightImages: addRotation(others.slice(9, 18))
        };
    }, []);

    const handleRealSurprise = () => {
        setPhase('real_surprise');
    };

    return (
        <div className="valentine-container" ref={containerRef}>
            <div className="floating-hearts">
                {hearts.map((heart) => (
                    <div
                        key={heart.id}
                        className="heart"
                        style={{
                            left: `${heart.left}%`,
                            animationDelay: `${heart.delay}s`,
                            animationDuration: `${heart.duration}s`,
                            fontSize: `${heart.size}rem`
                        }}
                    >
                        ❤️
                    </div>
                ))}
            </div>

            {/* Teasing Bear Image - Idle Phase */}
            {phase === 'idle' && idleNoCount >= 5 && (
                <div className="teasing-bear-container">
                    <div className="teasing-speech-bubble">
                        ನೀನ್ ಎಷ್ಟೇ ಟ್ರೈ ಮಾಡಿದ್ರ್ ಆಗಲ್ಲ ಬಿಡು ಮುದ್ದುಮಾ, Yes ಒತ್ಬಿಡು
                    </div>
                    <img src={teasingGif} alt="Teasing Bear" className="teasing-bear" />
                </div>
            )}

            {/* Teasing Bear Image - Surprise Phase */}
            {
                phase === 'surprise' && surpriseNoCount >= 4 && (
                    <div className="teasing-bear-container">
                        <div className="teasing-speech-bubble">
                            ಎಷ್ಟ್ ಸತಿ ಹೇಳ್ಬೇಕು? ಮುಚ್ಕೊಂಡ್ Yes ಒತು....!
                        </div>
                        <img src={teasingGif} alt="Teasing Bear" className="teasing-bear" />
                    </div>
                )
            }

            {
                phase === 'idle' && (
                    <>
                        <div className="question-wrapper">
                            <h1 className="valentine-question">Will you be my Valentine, Mudhumaaaaaaaa...???</h1>
                            <img src={loveBoxBear} alt="Love Box Bear" className="love-box-bear" />
                        </div>

                        <img src={proposingBear} alt="Proposing Bear" className="proposing-bear" />

                        <div className="buttons-container">
                            <button
                                className="btn btn-yes"
                                onClick={handleAccept}
                            >
                                Yes
                            </button>

                            <button
                                className="btn btn-no"
                                style={isEscaping ? noPosition : {}}
                                onMouseEnter={handleNoHover}
                                onClick={handleNoHover}
                            >
                                No
                            </button>
                        </div>
                    </>
                )
            }

            {
                phase === 'celebration' && (
                    <div className="celebration-container">
                        {/* Text */}
                        <h1 className="celebration-text">
                            Yaayyyyyyyyy!!! Lubbuuuuuuu Dhaaaaaaaaaaasthiiiii!!!
                        </h1>

                        <div className="bears-row">
                            {/* Kissing Bear - Left */}
                            <img src={kissBear} alt="Kissing Bear" className="kiss-bear" />

                            {/* Dancing Bear - Center */}
                            <div className="dance-bear-wrapper">
                                <img src={danceBear} alt="Dancing Bear" className="dance-bear" />
                            </div>

                            {/* Hugging Bear - Right */}
                            <img src={hugBear} alt="Hugging Bear" className="hug-bear" />
                        </div>

                        <button className="btn surprise-btn" onClick={handleSurprise}>
                            Wanna see a Surprise??? Click here
                        </button>
                    </div>
                )
            }

            {
                phase === 'surprise' && (
                    <div className="surprise-container">
                        <h1 className="valentine-question">Are you Ready???</h1>
                        <img src={surpriseImage} alt="Surprise" className="surprise-image" />
                        <div className="buttons-container">
                            <button
                                className="btn btn-yes"
                                onClick={handleGift}
                            >
                                Yes
                            </button>

                            <button
                                className="btn btn-no"
                                style={isEscaping ? noPosition : {}}
                                onMouseEnter={handleNoHover}
                                onClick={handleNoHover}
                            >
                                No
                            </button>
                        </div>
                    </div>
                )
            }

            {
                phase === 'gift' && (
                    <div className="gift-container" onClick={handleFinalSurprise}>
                        <img src={giftIcon} alt="Gift Box" className="gift-box" />
                        <p className="click-me-text">Click Me!</p>
                    </div>
                )
            }

            {
                phase === 'final_surprise' && (
                    <div className="final-surprise-container">
                        <h1 className="celebration-text">Surpriseeeeeee!!!</h1>
                        <img src={finalSurpriseImage} alt="Final Surprise" className="final-surprise-image" />

                        <div className="right-message-container">
                            <img src={eyesIcon} alt="Eyes" className="eyes-icon" />
                            <p className="same-to-same-text">Same to same 🤪</p>
                        </div>

                        <img src={popperIcon} alt="Popper" className="blaster blaster-left" />
                        <img src={popperIcon} alt="Popper" className="blaster blaster-right" />

                        {/* Confetti Rain */}
                        <div className="confetti-container">
                            {confetti.map((piece) => (
                                <div
                                    key={piece.id}
                                    className="confetti-piece"
                                    style={{
                                        left: `${piece.left}%`,
                                        backgroundColor: piece.bg,
                                        animationDelay: `${piece.delay}s`,
                                        animationDuration: `${piece.duration}s`,
                                        width: `${piece.size}rem`,
                                        height: `${piece.size * 0.5}rem`
                                    }}
                                />
                            ))}
                        </div>
                        {showSorryButton && (
                            <button className="btn sorry-btn" onClick={handleRealSurprise}>
                                Sorry Sorry!!! ಇದಲ್ಲ ಇದಲ್ಲ, ಮುಂದೆ ಕಾಣ್ 🤭
                            </button>
                        )}
                    </div>
                )
            }

            {
                phase === 'real_surprise' && (
                    <div className="collage-container">
                        <h1 className="collage-title">Our Beautiful Memories ❤️</h1>

                        <div className="collage-layout">
                            {/* Left 3x3 Grid */}
                            <div className="side-grid">
                                {leftImages.map((img) => (
                                    <div
                                        key={img.id}
                                        className="collage-item side-item"
                                        style={{ transform: `rotate(${img.rotation}deg)` }}
                                        onClick={() => setSelectedImage(img)}
                                    >
                                        <img src={img.src} alt="Memory" loading="lazy" />
                                    </div>
                                ))}
                            </div>

                            {/* Center Special Image */}
                            <div className="center-focus">
                                <div
                                    className="collage-item special-item"
                                    onClick={() => setSelectedImage(centerImage)}
                                >
                                    <img src={centerImage.src} alt="First Selfie" loading="lazy" />
                                    <span className="special-badge">⭐ First Selfie! ⭐</span>
                                </div>
                            </div>

                            {/* Right 3x3 Grid */}
                            <div className="side-grid">
                                {rightImages.map((img) => (
                                    <div
                                        key={img.id}
                                        className="collage-item side-item"
                                        style={{ transform: `rotate(${img.rotation}deg)` }}
                                        onClick={() => setSelectedImage(img)}
                                    >
                                        <img src={img.src} alt="Memory" loading="lazy" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Lightbox */}
            {selectedImage && (
                <div className="lightbox-overlay" onClick={() => setSelectedImage(null)}>
                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={() => setSelectedImage(null)}>×</button>
                        <img src={selectedImage.src} alt="Full View" className="lightbox-image" />
                        {selectedImage.caption && <p className="lightbox-caption">{selectedImage.caption}</p>}
                    </div>
                </div>
            )}
        </div >
    );
};

export default ValentinePage;
