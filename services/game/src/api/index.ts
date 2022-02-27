import { Settings } from '@dungeonz/configs';
import { dirname as mapsDirname } from '@dungeonz/maps';
import { error, message, warning } from '@dungeonz/utils';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { ensureDir } from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import { expressServer } from '../Server';
const { extrudeTilesetToImage } = require('tile-extruder'); // Weird TS bug(?), ignoring definitions for tile-extruder...

/**
 * Need to provide these resources the game client via an API request, as this info is only available
 * once the server has started, so isn't suitable for being included in the client build files.
 */

(async() => {
    try {
        // Check the location to write to exists. If not, create it.
        ensureDir('./src/api/resources/images');

        const outputPath = './src/api/resources/images/ground.png';
        // Serve the same ground tileset image as what is used in the map editor to keep them in sync.
        // Also extrude them by 1 pixel in each direction, as Phaser 3 has some issues with exact size tiles.
        // https://phaser.io/news/2018/05/webgl-tile-extruder
        await extrudeTilesetToImage(16, 16, `${mapsDirname}/tilesets/ground.png`, outputPath);

        // Scale the ground tileset, as Phaser blitter bobs can't be scaled, but the texture can,
        // so the source texture needs to be the right size as needed on the client.
        const metadata = await sharp(outputPath).metadata();
        const buffer = await sharp(outputPath)
            .resize(
                (metadata.width! * Settings.CLIENT_DISPLAY_SCALE) | 1,
                (metadata.height! * Settings.CLIENT_DISPLAY_SCALE) | 1,
                { kernel: sharp.kernel.nearest },
            )
            .toBuffer();
        await sharp(buffer).toFile(outputPath);
    }
    catch (err) {
        error(err);
    }
    message('Tilesets copied to client assets.');
})();

expressServer.use(cors());

const sendFile = (req: Request, res: Response, filePath: string) => {
    try {
        res.sendFile(
            filePath,
            (err) => { if (err) res.statusCode = 500; },
        );
    }
    catch(err) {
        warning('Error sending file: ', err);
        res.send(err);
    }
};

const itemTypesPath = path.join(__dirname, './resources/catalogues/ItemTypes.json');
expressServer.get('/api/item-types', (req, res) => sendFile(req, res, itemTypesPath));

const entityTypesPath = path.join(__dirname, './resources/catalogues/EntityTypes.json');
expressServer.get('/api/entity-types', (req, res) => sendFile(req, res, entityTypesPath));

const mapsPath = path.join(__dirname, './resources/maps/');
expressServer.get('/api/maps/:name', (req, res) => sendFile(req, res, `${mapsPath + req.params.name}.json`));

expressServer.use('/api/images', express.static(path.join(__dirname, './resources/images')));
