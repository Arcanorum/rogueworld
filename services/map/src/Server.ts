import { Settings } from '@dungeonz/configs';
import { message, warning } from '@dungeonz/utils';
import express from 'express';
import path from 'path';

const app = express();

const port = Settings.MAP_SERVER_PORT || 2222;

app.listen(
    port,
    () => { message(`Map server ready on port ${port}`); },
);

app.get('/map/:z/:x/:y', (req, res) => {
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
