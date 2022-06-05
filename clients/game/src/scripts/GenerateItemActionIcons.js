// Generates the action sprite image files from the item icon sources.
// Saves having to manually draw new images for every item type.

const path = require('path');
const fs = require('fs-extra');

const inputPath = path.join(__dirname, '../assets/images/gui/items/');
const outputPath = path.join(__dirname, '../assets/images/gui/actions/items/');

fs.readdir(inputPath, (err, filesNames) => {
    if (err) {
        console.log(`* Unable to scan directory: ${err}`);
    }

    filesNames.forEach((fileName) => {
        const outputFileName = fileName
            // Split the name into sections.
            .split('-')
            // Remove the 'icon-' part.
            .slice(1)
            // Capitalise them so they use the same format at the item typeName. 'iron-sword.png' => 'IronSword.png'.
            .map((nameSection) => nameSection.charAt(0).toUpperCase() + nameSection.slice(1))
            // Join them together.
            .reduce((string, nameSection) => string += nameSection);

        fs.copySync(inputPath + fileName, `${outputPath}action-${outputFileName}`);
    });
});

console.log('* Generated item action icon images.');
