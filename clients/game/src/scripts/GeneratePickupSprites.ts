// Generates the pickup sprite image files from the item icon sources.
// Saves having to manually draw new images for every item type.

import outline from 'outline-image';
import path from 'path';
import fs from 'fs';

const itemsPath = path.join(__dirname, '../assets/images/gui/items/');
const pickupsPath = path.join(__dirname, '../assets/images/entities/pickups/');

fs.readdir(itemsPath, (err: NodeJS.ErrnoException | null, files: Array<string>) => {
    if (err) {
        console.log(`* Unable to scan directory: ${err}`);
    }

    files.forEach((file) => {
        const pickupFileName = file.replace('icon-', 'pickup-');
        outline(itemsPath + file, pickupsPath + pickupFileName, '#fffae2', true);
    });
});

console.log('* Generated pickup sprite images.');
