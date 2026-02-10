export const preloadAssets = (sources) => {
    return Promise.all(
        sources.map((src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = src;
                img.onload = resolve;
                img.onerror = reject;
            });
        })
    );
};
