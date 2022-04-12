import { Settings } from '@dungeonz/configs';
import { Maps } from '@dungeonz/maps';
import { message } from '@dungeonz/utils';
import { execSync, ChildProcess } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

// Make sure the output directory exists.
fs.ensureDirSync(path.join(__dirname, '../build/images'));

Maps.forEach((map) => {
    message('Generating map image file for:', map.name);

    // Input map file path.
    const input = map.path;
    // Output image file path.
    const output = path.join(__dirname, '../build/images', `${map.name}.png`);

    console.log('input path:', input);
    console.log('output path:', output);

    // Run the tiled script to generate the source images for the map service from the map data.
    try {
        message('Trying headless rendering of map image.');
        execSync(`xvfb-run ${Settings.TMXRASTERIZER_PATH} --platform offscreen ${input} ${output}`);
        message('Map image rendered.');
    }
    catch(err1) {
        message('Failed to render headlessly:', err1);
        // Try using it normally if there is a connected display for a development setup.
        try {
            message('Trying normal rendering of map image.');
            execSync(`${Settings.TMXRASTERIZER_PATH} ${input} ${output}`);
            message('Map image rendered.');
        }
        catch(err2) {
            message('Failed to render normally:', err2);
        }
    }
});
