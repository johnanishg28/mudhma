import React, { useState } from 'react';
import ValentinePage from './components/ValentinePage';
import Gallery from './components/Gallery';

function App() {
    const [valentineAccepted, setValentineAccepted] = useState(false);

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
