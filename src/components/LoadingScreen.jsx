import React, { useState, useEffect } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ phase, onTimerComplete }) => {
    const [count, setCount] = useState(3);

    useEffect(() => {
        if (phase === 'timer') {
            const timer = setInterval(() => {
                setCount((prev) => {
                    if (prev === 1) {
                        clearInterval(timer);
                        onTimerComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [phase, onTimerComplete]);

    return (
        <div className="loading-screen">
            {phase === 'preload' && (
                <div className="loading-content">
                    <h1 className="loading-text">Big Surprise Loading...</h1>
                    <div className="spinner"></div>
                </div>
            )}

            {phase === 'timer' && (
                <div className="timer-content">
                    <h1 className="get-ready-text">Get Ready...</h1>
                    <div className="countdown">{count}</div>
                </div>
            )}
        </div>
    );
};

export default LoadingScreen;
