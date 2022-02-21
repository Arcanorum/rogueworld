import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Config from '../shared/Config';

const App = dynamic(
    () => import('../components/App'),
    { ssr: false },
);

const HomePage = ({ Settings }) => {
    // Make the settings available to the rest of the app at runtime through the globalish config object.
    Config.Settings = Settings;

    return (
        <>
            <Head>
                <title>Dungeonz.io</title>
            </Head>
            <App />
        </>
    );
};

// Need to fuck around a bit to get NextJS to include the imported settings in the build due to a bug.
// https://github.com/vercel/next.js/issues/10943
// https://github.com/vercel/next.js/discussions/32236
export async function getStaticProps() {
    const { loadYAMLConfig } = require('@dungeonz/configs');

    const pathToConfigs = '../../../../../shared/configs/src';

    // Anything from the @dungeonz/configs package that is needed in this client app should be
    // added here (basically just copy pasted from the index file that lists the exported configs).
    const Settings = loadYAMLConfig('Settings', pathToConfigs) || loadYAMLConfig('Settings.default', pathToConfigs);

    return {
        props: {
            Settings,
        },
    };
}

export default HomePage;
