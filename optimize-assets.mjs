import sharp from 'sharp';
import { optimize } from 'svgo';
import fs from 'fs';
import path from 'path';

const COLLAGE_DIR = 'src/assets/collage';
const ASSETS_DIR = 'src/assets';
const MAX_WIDTH = 1200;
const JPEG_QUALITY = 75;

async function compressJpg(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg') return;

    const originalSize = fs.statSync(filePath).size;
    const tempPath = filePath + '.tmp';

    try {
        const inputBuffer = fs.readFileSync(filePath);
        const outputBuffer = await sharp(inputBuffer)
            .resize(MAX_WIDTH, null, {
                withoutEnlargement: true,
                fit: 'inside'
            })
            .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
            .toBuffer();

        fs.writeFileSync(tempPath, outputBuffer);
        fs.unlinkSync(filePath);
        fs.renameSync(tempPath, filePath);

        const newSize = outputBuffer.length;
        const saved = ((originalSize - newSize) / originalSize * 100).toFixed(1);
        console.log(`  OK ${path.basename(filePath)}: ${(originalSize / 1024 / 1024).toFixed(1)}MB -> ${(newSize / 1024 / 1024).toFixed(1)}MB (${saved}% saved)`);
    } catch (err) {
        if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        console.error(`  FAIL ${path.basename(filePath)}: ${err.message}`);
    }
}

async function optimizeSvg(filePath) {
    if (path.extname(filePath).toLowerCase() !== '.svg') return;

    const originalSize = fs.statSync(filePath).size;
    try {
        const svgContent = fs.readFileSync(filePath, 'utf-8');
        const result = optimize(svgContent, {
            path: filePath,
            multipass: true,
            plugins: ['preset-default'],
        });

        fs.writeFileSync(filePath, result.data);
        const newSize = Buffer.byteLength(result.data, 'utf-8');
        const saved = ((originalSize - newSize) / originalSize * 100).toFixed(1);
        console.log(`  OK ${path.basename(filePath)}: ${(originalSize / 1024 / 1024).toFixed(1)}MB -> ${(newSize / 1024 / 1024).toFixed(1)}MB (${saved}% saved)`);
    } catch (err) {
        console.error(`  FAIL ${path.basename(filePath)}: ${err.message}`);
    }
}

async function main() {
    console.log('\nCompressing collage images...\n');

    const collageFiles = fs.readdirSync(COLLAGE_DIR);
    for (const file of collageFiles) {
        await compressJpg(path.join(COLLAGE_DIR, file));
    }

    console.log('\nCompressing other asset images...\n');

    const assetFiles = fs.readdirSync(ASSETS_DIR);
    for (const file of assetFiles) {
        const filePath = path.join(ASSETS_DIR, file);
        if (fs.statSync(filePath).isFile()) {
            await compressJpg(filePath);
        }
    }

    console.log('\nOptimizing SVG files...\n');

    for (const file of assetFiles) {
        const filePath = path.join(ASSETS_DIR, file);
        if (fs.statSync(filePath).isFile()) {
            await optimizeSvg(filePath);
        }
    }

    console.log('\nDone! All assets optimized.\n');
}

main().catch(console.error);
