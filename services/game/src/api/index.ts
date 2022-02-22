import { message, warning } from '@dungeonz/utils';
import cors from 'cors';
import path from 'path';
import { expressServer } from '../Server';

/**
 * Need to provide these resources the game client via an API request, as this info is only available
 * once the server has started, so isn't suitable for being included in the client build files.
 */

expressServer.use(cors());

const itemTypesPath = path.join(__dirname, './resources/catalogues/ItemTypes.json');
expressServer.get('/api/item-types', (req, res) => {
    try {
        res.sendFile(
            itemTypesPath,
            (err) => { if (err) res.statusCode = 500; },
        );
    }
    catch(err) {
        warning('Error getting item types: ', err);
        res.send(err);
    }
});

const mapsPath = path.join(__dirname, './resources/maps/');
expressServer.get('/api/maps/:name', (req, res) => {
    try {
        res.sendFile(
            `${mapsPath + req.params.name}.json`,
            (err) => { if (err) res.statusCode = 500; },
        );
    }
    catch(err) {
        warning('Error getting map data: ', err);
        res.send(err);
    }
});
