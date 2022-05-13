import { Settings } from '@rogueworld/configs';
import { Maps } from '@rogueworld/maps';
import { message } from '@rogueworld/utils';
import fs from 'fs-extra';
import path from 'path';
import util from 'util';

async function generateMapImages() {
    const exec = util.promisify(require('child_process').exec);

    // Make sure the output directory exists.
    fs.ensureDirSync(path.join(__dirname, '../build/images'));

    for(const map of Maps) {
        message('Generating map image file for:', map.name);

        // Input map file path.
        const input = map.path;
        // Output image file path.
        const output = path.join(__dirname, '../build/images', `${map.name}.png`);

        // Run the tiled script to generate the source images for the map service from the map data.
        try {
            message('Trying headless rendering of map image.');
            await exec(`xvfb-run ${Settings.TMXRASTERIZER_PATH} --platform offscreen ${input} ${output}`);
            message('Map image rendered.');
        }
        catch(err1) {
            message('Failed to render headlessly:', err1);
            // Try using it normally if there is a connected display for a development setup.
            try {
                message('Trying normal rendering of map image.');
                await exec(`${Settings.TMXRASTERIZER_PATH} ${input} ${output}`);
                message('Map image rendered.');
            }
            catch(err2) {
                message('Failed to render normally:', err2);
            }
        }
    }
}

export default generateMapImages;
