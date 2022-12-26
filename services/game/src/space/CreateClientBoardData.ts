import { GameMap, MapLayer, Tilesets } from '@rogueworld/maps';
import { ObjectOfAny } from '@rogueworld/types';
import {
    arrayOfObjectsToObject, error, message, runLengthEncodeArray, warning,
} from '@rogueworld/utils';
import { ensureDirSync, writeFileSync } from 'fs-extra';
import path from 'path';
import { GroundTypes } from '.';
import { GroundTypeName } from './GroundTypes';

// A recent version of Tiled may have changed the tileset.tiles property to be an
// array of {id: Number, class: String}
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

        return undefined;
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
    let className: GroundTypeName;
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
            // Get and separate the class from the prefix using the tile GID.
            className = groundTilesetTiles[mapTile].class;
            // Move to the next row when at the width of the map.
            if (col === map.data.width) {
                col = 0;
                row += 1;
            }
            // Keep the tile number to create the client map data.
            clientData.groundGrid[row][col] = mapTile;
            // Check that the class of this tile is a valid one.
            if (!GroundTypes[className]) {
                warning(`Invalid ground mapTile class: ${className}`);
            }
            // Move to the next column.
            col += 1;
        }
    }

    // Compress the grids to reduce file size/transfer times.
    clientData.groundGrid.forEach((eachRow, eachIndex) => {
        clientData.groundGrid[eachIndex] = runLengthEncodeArray(eachRow);
    });

    // Save the client map data that was extracted.
    const outputData = JSON.stringify(clientData);

    const outputPath = path.join(__dirname, '../api/resources/maps');

    ensureDirSync(outputPath);

    // Write the data to file for the API to serve.
    writeFileSync(`${outputPath}/${map.name}.json`, outputData, 'utf8');

    message(`Map data written to client: ${map.name}`);
};
