import { Settings } from '@dungeonz/configs';
import { Maps } from '@dungeonz/maps';
import { message } from '@dungeonz/utils';
import { execFileSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

// Make sure the output directory exists.
fs.ensureDirSync(path.join(__dirname, '../build/images'));

Maps.forEach((map) => {
    message('Generating map image file for:', map.name);

    execFileSync(
        `${Settings.TILED_PATH}/tiled.tmxrasterizer`,
        [
            map.path, // Input map file path.
            path.join(__dirname, '../build/images', `${map.name}.png`), // Output image file path.
        ],
    );
});
