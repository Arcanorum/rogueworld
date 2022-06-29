import { TextDefinitions } from '@rogueworld/types';
import { message, warning } from '@rogueworld/utils';
import { ensureDirSync, readFileSync } from 'fs-extra';
import path from 'path';
import { read } from 'xlsx';
import downloadFile from './DownloadFile';
import parseSheet from './ParseSheet';

export default async function getTextDefinitions() {
    const URL = 'https://docs.google.com/spreadsheets/d/1n6jSigPBWrubNQMTz00GsLIh3U8CMtfZH8wMFYmfHaA/export?format=xlsx&id=1n6jSigPBWrubNQMTz00GsLIh3U8CMtfZH8wMFYmfHaA';

    // Save the translations data to file.
    // This request to get the data might not work in the future (changed URL, network problem,
    // etc.), so keep a local version to use as a fallback.
    // Might not be totally accurate, depending on the last time it was able to get the latest
    // version, but better than nothing.
    const buildPath = path.join(__dirname, '../build');

    const filePath = `${buildPath}/Translations.xlsx`;

    try {
        ensureDirSync(buildPath);

        await downloadFile(URL, filePath);

        message('Latest translations spreadsheet version downloaded.');
    }
    catch(err) {
        warning('Error getting latest translations spreadsheet version. Using local fallback.');
    }

    try {
        // Try and load either the new version, or the fallback (whichever it is), if it exists.
        const buffer = readFileSync(filePath);

        const workbook = read(buffer);

        const defsAsJSON: TextDefinitions = {};

        const firstTabIndex = 0;

        for (let i = firstTabIndex; i < workbook.SheetNames.length; i += 1) {
            parseSheet(workbook, workbook.SheetNames[i], defsAsJSON);
        }

        message('Translations spreadsheet loaded.');

        return defsAsJSON;
    }
    catch(err2) {
        warning('Error loading fallback.');
    }

    return {};
}