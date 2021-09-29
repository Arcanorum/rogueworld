const fs = require("fs");
const path = require("path");
const img2LeafletTile = require("./GenerateMapTiles");
const Utils = require("../Utils");

const outputPath = path.join(__dirname, "./../../map/leaflet-map"); // path to folder output

// check if outputPath already exists
fs.stat(outputPath, async (err, stat) => {
    if (err === null) {
        Utils.message("leaflet-map folder already exists, skipping...");
    }
    else if (err.code === "ENOENT") {
        Utils.message("leaflet-map folder not found, creating...");
        Utils.message("this may take a while...");

        const inputPath = path.join(__dirname, "./../../map/overworld.png"); // path to input image

        const zoomLevels = [
            [1, 2048], // 2048 x 2048
            [2, 1024], // 1024 x 1024
            [3, 512], // 512 x 512
            [4, 256], // 256 x 256
        ];

        await img2LeafletTile({
            inputFile: inputPath,
            outputFolder: outputPath,
            zoomLevels,
        });

        Utils.message("Done!");
    }
});
