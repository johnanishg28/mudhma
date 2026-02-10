import React, { useState, useEffect } from 'react';
import ValentinePage from './components/ValentinePage';
import Gallery from './components/Gallery';
import LoadingScreen from './components/LoadingScreen';
import { preloadAssets } from './utils/preloadAssets';
import { collageImages } from './components/CollageImages';

// Import all assets used in ValentinePage
import proposingBear from './assets/Dudu_proposing.svg';
import loveBoxBear from './assets/Dudu_love_box.svg';
import danceBear from './assets/Dudu_dance.gif';
import kissBear from './assets/Dudu_kiss_Bubu.gif';
import hugBear from './assets/dudu_hug_bubu.gif';
import surpriseImage from './assets/surprise_image.jpg';
import teasingGif from './assets/dudu_teasing_new.gif';
import finalSurpriseImage from './assets/final_surprise.jpg';
import giftIcon from './assets/gift.svg';
import popperIcon from './assets/popper.svg';
import eyesIcon from './assets/eyes.svg';

function App() {
    const [valentineAccepted, setValentineAccepted] = useState(false);
    const [loadingPhase, setLoadingPhase] = useState('preload'); // 'preload', 'timer', 'complete'

    useEffect(() => {
        const assetsToLoad = [
            proposingBear,
            loveBoxBear,
            danceBear,
            kissBear,
            hugBear,
            surpriseImage,
            teasingGif,
            finalSurpriseImage,
            giftIcon,
            popperIcon,
            eyesIcon,
            ...collageImages.map(img => img.src)
        ];

        preloadAssets(assetsToLoad)
            .then(() => {
                // Minimum loading time to show the "Big Surprise Loading" message
                setTimeout(() => {
                    setLoadingPhase('timer');
                }, 1000);
            })
            .catch((err) => {
                console.error("Failed to preload assets", err);
                // Fallback: proceed anyway even if some fail
                setLoadingPhase('timer');
            });
    }, []);

    const handleTimerComplete = () => {
        setLoadingPhase('complete');
    };

    if (loadingPhase !== 'complete') {
        return (
            <LoadingScreen
                phase={loadingPhase === 'preload' ? 'preload' : 'timer'}
                onTimerComplete={handleTimerComplete}
            />
        );
    }

    return (
        <div className="App">
            {!valentineAccepted ? (
                <ValentinePage onAccept={() => setValentineAccepted(true)} />
            ) : (
                <Gallery />
            )}
        </div>
    );
}

export default App;
