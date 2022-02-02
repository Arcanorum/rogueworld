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

        return jsyaml.load(data) as any;
    }
    catch (err) {
        warning(err);

        return false;
    }
};

const Settings = loadYAMLConfig('Settings') || loadYAMLConfig('Settings.default');
const Entities = loadYAMLConfig('Entities');

export {
    Settings,
    Entities,
};
