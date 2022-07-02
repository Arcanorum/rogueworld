import '@rogueworld/node-utils';
import { Settings } from '@rogueworld/configs';
import { message, warning } from '@rogueworld/utils';
import express from 'express';
import path from 'path';

const expressServer = express();

const port = Settings.MAP_SERVICE_PORT || 2222;

expressServer.listen(
    port,
    () => { message(`Map service ready on port ${port}`); },
);

expressServer.get('/map/:z/:x/:y', (req, res) => {
    try {
        const { z, x, y } = req.params;

        res.sendFile(
            path.join(__dirname, `../build/leaflet-map/${z}/${x}/${y}`),
            (err) => { if (err) res.statusCode = 404; },
        );
    }
    catch (err) {
        warning(err);
    }
});
