import React from 'react';
import './Gallery.css';

const Gallery = () => {
    return (
        <div className="gallery-container">
            <div className="gallery-header">
                <h1>Thankiii mudhumaaaaaaaa, Lubbuuu dhaaaaaaaaaaaaaaasthi</h1>
                <p>❤️ Happy Valentine's Day My Love ❤️</p>
            </div>

            <div className="photo-grid">
                {/* Placeholder images - these can be replaced with real URLs or imports */}
                <div className="photo-item"><img src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2070&auto=format&fit=crop" alt="Love" /></div>
                <div className="photo-item"><img src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=1974&auto=format&fit=crop" alt="Couple" /></div>
                <div className="photo-item"><img src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2069&auto=format&fit=crop" alt="Hearts" /></div>
                <div className="photo-item"><img src="https://images.unsplash.com/photo-1474552226712-ac0f0961a954?q=80&w=2071&auto=format&fit=crop" alt="Flowers" /></div>
                <div className="photo-item"><img src="https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=1976&auto=format&fit=crop" alt="Rose" /></div>
                <div className="photo-item"><img src="https://images.unsplash.com/photo-1516961642265-531546e84af2?q=80&w=1974&auto=format&fit=crop" alt="Coffee" /></div>
            </div>
        </div>
    );
};

export default Gallery;
