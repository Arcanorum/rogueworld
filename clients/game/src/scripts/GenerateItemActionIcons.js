// Generates the action sprite image files from the item icon sources.
// Saves having to manually draw new images for every item type.

const path = require('path');
const fs = require('fs-extra');

const inputPath = path.join(__dirname, '../assets/images/gui/items/');
const outputPath = path.join(__dirname, '../assets/images/gui/actions/items/');

fs.readdir(inputPath, (err, files) => {
    if (err) {
        console.log(`* Unable to scan directory: ${err}`);
    }

    files.forEach((file) => {
        const outputFileName = file.replace('icon-', 'action-');
        fs.copySync(inputPath + file, outputPath + outputFileName);
    });
});

console.log('* Generated item action icon images.');
