import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ORIGINAL_COLLAGE = 'assets';  // Root assets has originals
const TARGET_COLLAGE = 'src/assets/collage';
const ORIGINAL_ASSETS = 'assets';
const TARGET_ASSETS = 'src/assets';
const MAX_WIDTH = 1200;
const JPEG_QUALITY = 75;

async function compressWithRotation(srcPath, destPath) {
    const ext = path.extname(srcPath).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg') return;

    const originalSize = fs.statSync(srcPath).size;

    try {
        const inputBuffer = fs.readFileSync(srcPath);
        const outputBuffer = await sharp(inputBuffer)
            .rotate()  // Auto-rotate based on EXIF orientation
            .resize(MAX_WIDTH, null, {
                withoutEnlargement: true,
                fit: 'inside'
            })
            .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
            .toBuffer();

        fs.writeFileSync(destPath, outputBuffer);
        const newSize = outputBuffer.length;
        const saved = ((originalSize - newSize) / originalSize * 100).toFixed(1);
        console.log(`  OK ${path.basename(srcPath)}: ${(originalSize / 1024 / 1024).toFixed(1)}MB -> ${(newSize / 1024 / 1024).toFixed(1)}MB (${saved}% saved)`);
    } catch (err) {
        console.error(`  FAIL ${path.basename(srcPath)}: ${err.message}`);
    }
}

async function main() {
    console.log('\nRecompressing collage images with proper rotation...\n');

    // Recompress collage images from originals in root assets/
    const collageFiles = fs.readdirSync(ORIGINAL_COLLAGE).filter(f => {
        const ext = path.extname(f).toLowerCase();
        return (ext === '.jpg' || ext === '.jpeg') && !fs.statSync(path.join(ORIGINAL_COLLAGE, f)).isDirectory();
    });

    for (const file of collageFiles) {
        const srcPath = path.join(ORIGINAL_COLLAGE, file);
        const destPath = path.join(TARGET_COLLAGE, file);
        if (fs.existsSync(destPath)) {
            await compressWithRotation(srcPath, destPath);
        }
    }

    console.log('\nRecompressing standalone images...\n');

    // Also recompress surprise_image.jpg and final_surprise.jpg
    // These map to specific files in root assets
    const standaloneFiles = ['surprise_image.jpg', 'final_surprise.jpg'];
    for (const file of standaloneFiles) {
        // Find matching original - check if same filename exists in root assets
        // surprise_image.jpg = 20260112_003138.jpg (same size originally: 3943969)
        // final_surprise.jpg = 20260101_134112(0).jpg (same size originally: 912160)
        const destPath = path.join(TARGET_ASSETS, file);
        if (fs.existsSync(destPath)) {
            // Use the file from root assets that matches
            const rootFile = path.join(ORIGINAL_COLLAGE, file);
            if (fs.existsSync(rootFile)) {
                await compressWithRotation(rootFile, destPath);
            } else {
                console.log(`  SKIP ${file}: no matching original in root assets`);
            }
        }
    }

    console.log('\nDone! All images recompressed with proper rotation.\n');
}

main().catch(console.error);
