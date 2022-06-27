import { Settings } from '@rogueworld/configs';
import { initService, message } from '@rogueworld/utils';
initService();
import express from 'express';
import getTextDefinitions from './TextDefinitionsParser';

(async() => {
    const textDefs = await getTextDefinitions();
    // TODO: add some kind of retry logic if there are no defs, i.e. couldn't download the spreadsheet

    const expressServer = express();

    const port = Settings.LANGUAGE_SERVICE_PORT || 2222;

    expressServer.listen(
        port,
        () => { message(`Language service ready on port ${port}`); },
    );

    expressServer.get('/language/:languageName', (req, res) => {
        const { languageName } = req.params;

        if(!textDefs[languageName]) {
            res.statusCode = 400;
            res.send('Invalid language name');
            return;
        }

        // Always send back the English definitoons too, to use as a fallback as the text for English should always be defined.
        res.send({
            English: textDefs['English'],
            [languageName]: textDefs[languageName],
        });
    });
})();
