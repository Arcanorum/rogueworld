import { dirname } from '@dungeonz/maps';
import { message } from '@dungeonz/utils';
import fs from 'fs-extra';
import path from 'path';
// import generateMapImages from './GenerateMapImages';
import img2LeafletTile from './GenerateMapTiles';

// Delete all existing build files before generating new ones, to make sure redundant ones are cleaned up.
fs.emptyDirSync(path.join(__dirname, '../build'));

(async() => {
    // TODO: Disabled as it uses way more memory than a 1GB VPS has and crashes. :/
    // Just generating them locally and uploading them to git for now.
    // await generateMapImages();

    const inputPath = path.join(dirname, 'images/plains.png');
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
