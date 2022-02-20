import jsyaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { warning } from '@dungeonz/utils';

const loadYAMLConfig = (fileName: string) => {
    try {
        const data = fs.readFileSync(
            path.resolve(`${__dirname}/${fileName}.yaml`),
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
