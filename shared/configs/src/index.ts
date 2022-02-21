import { warning } from '@dungeonz/utils';
import fs from 'fs';
import jsyaml from 'js-yaml';
import path from 'path';

/**
 * Only .yaml is allowed (not .yml, .json, or anything else).
 * @param fileName - The name part of the file to load, WITHOUT the extension.
 * @param relativePath - A relative path to the src directory of this package, for when `__dirname` gets messed up by NextJS...
 */
export const loadYAMLConfig = (fileName: string, relativePath?: string) => {
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
        warning(err);

        return false;
    }
};

const Settings = loadYAMLConfig('Settings') || loadYAMLConfig('Settings.default');
const Entities = loadYAMLConfig('Entities');
const Items = loadYAMLConfig('Items');

export {
    Settings,
    Entities,
    Items,
};
