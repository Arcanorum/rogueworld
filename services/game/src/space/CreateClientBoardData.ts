import { GameMap, MapLayer, Tilesets } from '@dungeonz/maps';
import { ObjectOfAny } from '@dungeonz/types';
import { arrayOfObjectsToObject, error, message, runLengthEncodeArray, warning } from '@dungeonz/utils';
import { ensureDirSync, writeFileSync } from 'fs-extra';
import path from 'path';
import { GroundTypes } from '.';
import { GroundTypeName } from './GroundTypes';

// A recent version of Tiled may have changed the tileset.tiles property to be an array of {id: Number, type: String}
// Map the values back to an object by ID.
export const groundTilesetTiles = Tilesets.groundTileset.tiles.reduce((map, obj) => {
    map[obj.id] = obj;
    return map;
}, {} as ObjectOfAny);

/**
* Build the client data for a map.
*/
export const createClientBoardData = (map: GameMap) => {
    const mapProperties = arrayOfObjectsToObject(map.data.properties, 'name', 'value');

    // Skip disabled maps.
    if (mapProperties.Disabled === true) {
        message('Skipping disabled map:', map.name);
        return;
    }

    // Load the map objects.
    // Check that there is some map data for the map of this board.
    if (!map.data) {
        error('No map data found for this board when creating board:', map.name);
        return;
    }

    const findLayer = (layerName: string) => {
        const foundLayer = map.data.layers.find((eachLayer) => eachLayer.name === layerName);

        if (foundLayer) return foundLayer;

        warning(`Couldn't find tilemap layer '${layerName}' for board ${map.name}.`);
        return;
    };

    const clientData = {
        name: map.name,
        groundGrid: [] as Array<Array<number>>,
    };

    let i = 0;
    let len = 0;
    let tilesData: Array<number>;
    // A tile layer tile on the tilemap data.
    let mapTile: number;
    let type: GroundTypeName;
    let row: number;
    let col: number;

    // Initialise an empty grid, with a board tile instance for each column in each row.
    for (i = 0; i < map.data.height; i += 1) {
        // Add the same amount of rows to the map data to write to the clients.
        clientData.groundGrid[i] = [];
    }

    // Check that the ground layer exists in the map data.
    const layer: MapLayer | undefined = findLayer('Ground');
    if (layer) {
        tilesData = layer.data;
        row = 0;
        col = 0;

        // Add the tiles to the grid.
        for (i = 0, len = tilesData.length; i < len; i += 1) {
            mapTile = tilesData[i] - 1;

            if (groundTilesetTiles[mapTile] === undefined) {
                error(`Invalid/empty map tile found while creating client board data: ${map.name} at row: ${row}, col: ${col}`);
            }
            // Get and separate the type from the prefix using the tile GID.
            type = groundTilesetTiles[mapTile].type;
            // Move to the next row when at the width of the map.
            if (col === map.data.width) {
                col = 0;
                row += 1;
            }
            // Keep the tile number to create the client map data.
            clientData.groundGrid[row][col] = mapTile;
            // Check that the type of this tile is a valid one.
            if (!GroundTypes[type]) {
                warning(`Invalid ground mapTile type: ${type}`);
            }
            // Move to the next column.
            col += 1;
        }
    }

    // Compress the grids to reduce file size/transfer times.
    clientData.groundGrid.forEach((row, i) => {
        clientData.groundGrid[i] = runLengthEncodeArray(row);
    });

    // Save the client map data that was extracted.
    const outputData = JSON.stringify(clientData);

    const outputPath = path.join(__dirname, '../api/resources/maps');

    ensureDirSync(outputPath);

    // Write the data to file for the API to serve.
    writeFileSync(`${outputPath}/${map.name}.json`, outputData, 'utf8');

    message(`Map data written to client: ${map.name}`);
};
