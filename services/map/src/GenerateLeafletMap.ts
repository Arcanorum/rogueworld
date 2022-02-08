import fs from 'fs';
import path from 'path';
import img2LeafletTile from './GenerateMapTiles';
import { message } from '@dungeonz/utils';

const outputPath = path.join(__dirname, './../../map/leaflet-map'); // path to folder output

// check if outputPath already exists
fs.stat(outputPath, async (err) => {
    if (err === null) {
        message('leaflet-map folder already exists, skipping...');
    }
    else if (err.code === 'ENOENT') {
        message('leaflet-map folder not found, creating...');
        message('this may take a while...');

        const inputPath = path.join(__dirname, './../../map/overworld.png'); // path to input image

        const zoomLevels = [
            [ 1, 2048 ], // 2048 x 2048
            [ 2, 1024 ], // 1024 x 1024
            [ 3, 512 ], // 512 x 512
            [ 4, 256 ], // 256 x 256
        ];

        await img2LeafletTile({
            inputFile: inputPath,
            outputFolder: outputPath,
            zoomLevels,
        });

        message('Done!');
    }
});
