import { Settings } from '@rogueworld/configs';

/**
 * General process initialisation to be done at the very start of any service.
 */
(() => {
    const devMode = Settings.DEV_MODE;

    // Skip if it has already been set elsewhere.
    if (process.env.NODE_ENV) return;

    if (devMode || devMode === undefined) {
        (process.env.NODE_ENV as string) = 'development';
    }
    else {
        (process.env.NODE_ENV as string) = 'production';
    }
})();
