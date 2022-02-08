import express from 'express';
import path from 'path';
import { message, warning } from '@dungeonz/utils';
import { Settings } from '@dungeonz/configs';

const app = express();

app.listen(Settings.GAME_SERVICE_PORT || 1111);

/**
 * Need to provide the item types for the client via an API request, as this info is only available
 * once the server has started, so isn't suitable for being included in the client build files.
 */
const itemTypesPath = path.join(__dirname, '../items/ItemTypes.json');
app.get('api/item-types', (req, res) => {
    message('getting item types from api');

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

export default app;
