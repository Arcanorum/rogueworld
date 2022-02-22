import { warning } from '@dungeonz/utils';
import cors from 'cors';
import path from 'path';
import { expressServer } from '../Server';
import { Request, Response } from 'express';

/**
 * Need to provide these resources the game client via an API request, as this info is only available
 * once the server has started, so isn't suitable for being included in the client build files.
 */

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
