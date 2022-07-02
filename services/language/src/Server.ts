import '@rogueworld/init-service';
import { Settings } from '@rogueworld/configs';
import { message } from '@rogueworld/utils';
import cors from 'cors';
import express from 'express';
import getTextDefinitions from './TextDefinitionsParser';

(async () => {
    const textDefs = await getTextDefinitions();

    const expressServer = express();

    expressServer.use(cors());

    const port = Settings.LANGUAGE_SERVICE_PORT || 4444;

    expressServer.listen(
        port,
        () => { message(`Language service ready on port ${port}`); },
    );

    expressServer.get('/language/:languageName', (req, res) => {
        const { languageName } = req.params;

        if (!textDefs[languageName]) {
            res.statusCode = 400;
            res.send('Invalid language name');
            return;
        }

        // Always send back the English definitions too, to use as a fallback as the text for
        // English should always be defined.
        res.send({
            English: textDefs.English,
            [languageName]: textDefs[languageName],
        });
    });
})();
