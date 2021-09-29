// Adapted from https://github.com/Simperfy/img2-Leaftlet-Tile but fixes the "Input image exceeds pixel limit" error.
const sharp = require("sharp");
const fs = require("fs");

async function img2LeafletTile({
    inputFile, outputFolder, zoomLevels = [],
}) {
    if (zoomLevels.length <= 0) throw new Error("Please provide zoomLevels array");

    fs.mkdirSync(outputFolder, { recursive: true });

    function removePaddedFile(paddedOutput) {
        fs.unlink(paddedOutput, (err) => {
            if (err) throw err;
        });
    }

    function getPadding(dimension, cropDimension) {
        if (dimension % cropDimension === 0) return 0;

        return cropDimension - (dimension % cropDimension);
    }

    /* eslint-disable no-restricted-syntax */
    for (const zoomLevel of zoomLevels) {
        const dimension = zoomLevel[1];

        const cropDimensionWidth = dimension;
        const cropDimensionHeight = dimension;

        let x = 0;
        let y = 0;
        const z = zoomLevel[0];

        let xLimit = 0;
        let yLimit = 0;

        const paddedOutput = `${outputFolder}/padded_${z}.png`;

        const options = { limitInputPixels: false };

        let image = sharp(inputFile, options);

        // Set limit
        /* eslint-disable no-await-in-loop */
        const metadata = await image.metadata();
        const padX = getPadding(metadata.width, cropDimensionWidth);
        const padY = getPadding(metadata.height, cropDimensionHeight);

        xLimit = metadata.width + padX;
        yLimit = metadata.height + padY;

        const paddedImage = image.extend({
            top: 0,
            left: 0,
            right: padX,
            bottom: padY,
            background: {
                r: 0, g: 0, b: 0, alpha: 0,
            },
        });

        image = await paddedImage.toFile(paddedOutput);

        const newImage = sharp(paddedOutput, options);

        let counter = 0;

        for (let a = 0; a < xLimit / cropDimensionWidth; a += 1) {
            const folder = `${outputFolder}/${z}/${a}/`;
            fs.mkdirSync(folder, { recursive: true });

            for (let b = 0; b < yLimit / cropDimensionHeight; b += 1) {
                const filename = `${b}.png`;
                const output = folder + filename;

                x = a * cropDimensionWidth;
                y = b * cropDimensionHeight;
                counter += 1;

                await newImage.extract({
                    left: x,
                    top: y,
                    width: cropDimensionWidth,
                    height: cropDimensionHeight,
                }).toFile(output);
            }
        }

        removePaddedFile(paddedOutput, counter);
    }
}

module.exports = img2LeafletTile;
