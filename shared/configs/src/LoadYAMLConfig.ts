import { warning } from '@rogueworld/utils';
import fs from 'fs';
import jsyaml from 'js-yaml';
import path from 'path';

/**
 * Only .yaml is allowed (not .yml, .json, or anything else).
 * @param fileName - The name part of the file to load, WITHOUT the extension.
 * @param relativePath - A relative path to the src directory of this package, for when `__dirname`
 * gets messed up by NextJS...
 */
export default function loadYAMLConfig(fileName: string, relativePath?: string) {
    try {
        const data = fs.readFileSync(
            path.resolve(__dirname, relativePath || '', `${fileName}.yaml`),
            'utf8',
        );

        const loadedYaml = jsyaml.load(data) as any;

        // Prevent the config from being modified after it has left this package.
        return Object.freeze(loadedYaml);
    }
    catch (err) {
        // Check if this package is being used correctly before warning about missing config files.
        // When used incorrectly by a build tool (see NextJS __dirname bug...) then it shouldn't
        // bother logging the error to avoid terminal spam for each file it can't find.
        if (__dirname.includes('shared/configs/src')) {
            warning(err);
        }

        return false;
    }
}
