import { message } from '@dungeonz/utils';
import fs from 'fs-extra';
import path from 'path';
import generateMapImages from './GenerateMapImages';
import img2LeafletTile from './GenerateMapTiles';

// Delete all existing build files before generating new ones, to make sure redundant ones are cleaned up.
fs.emptyDirSync(path.join(__dirname, '../build'));

(async() => {
    await generateMapImages();

    const inputPath = path.join(__dirname, '../build/images/plains.png'); // path to input image
    const outputPath = path.join(__dirname, '../build/leaflet-map');

    message('Generating leaflet map.');
    message('Input path:', inputPath);
    message('Output path:', outputPath);

    // Make sure the output directory exists.
    fs.ensureDirSync(outputPath);

    const zoomLevels = [
        [1, 2048], // 2048 x 2048
        [2, 1024], // 1024 x 1024
        [3, 512], // 512 x 512
        [4, 256], // 256 x 256
    ];

    message('Creating leaflet-map directory.');
    message('This may take a while...');

    await img2LeafletTile({
        inputFile: inputPath,
        outputFolder: outputPath,
        zoomLevels,
    });

    message('Done!');
})();
