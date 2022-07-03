import { readFileSync } from 'fs-extra';
import { read } from 'xlsx';
import path from 'path';
import { warning, xlsxWorkbookToTextDefs } from '@rogueworld/utils';
import loadYAMLConfig from './LoadYAMLConfig';

export const loadSettings = (pathToConfigs?: string) => {
    // Clone the default settings, since it is frozen.
    const settings = JSON.parse(
        JSON.stringify(
            loadYAMLConfig('Settings.default', pathToConfigs),
        ),
    );

    // Overwrite any default setting if it is set in the custom settings file.
    const customSettings = loadYAMLConfig('Settings', pathToConfigs);

    if (customSettings) {
        Object.entries(customSettings).forEach(([key, value]) => {
            if (Object.hasOwn(settings, key)) {
                settings[key] = value;
            }
        });
    }

    // Prevent the config from being modified after it has left this package.
    return Object.freeze(settings);
};

export const Settings = loadSettings();
export const Entities = loadYAMLConfig('Entities');
export const Items = loadYAMLConfig('Items');
export const ItemWeightClasses = loadYAMLConfig('ItemWeightClasses') as { [key: string]: number };
export const CraftingRecipes = loadYAMLConfig('CraftingRecipes');
export const CraftingStationClasses = loadYAMLConfig('CraftingStationClasses') as Array<string>;

export const loadTranslations = (pathToConfigs?: string) => {
    try {
        const buffer = readFileSync(
            path.resolve(__dirname, pathToConfigs || '', 'Translations.xlsx'),
        );

        const workbook = read(buffer);

        const translations = xlsxWorkbookToTextDefs(workbook);

        // Prevent it from being modified after it has left this package.
        return Object.freeze(translations);
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
};

export const Translations = loadTranslations();
