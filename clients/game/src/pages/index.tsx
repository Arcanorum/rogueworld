import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { init } from '../shared/Config';
import { loadSettings } from '@rogueworld/configs';

const App = dynamic(
    () => import('../components/App'),
    { ssr: false },
);

const HomePage = ({ Settings }) => {
    init(Settings);

    return (
        <>
            <Head>
                <title>Rogueworld.io</title>
            </Head>
            <App />
        </>
    );
};

// Need to fuck around a bit to get NextJS to include the imported settings in the build due to a bug.
// https://github.com/vercel/next.js/issues/10943
// https://github.com/vercel/next.js/discussions/32236
export async function getStaticProps() {
    const pathToConfigs = '../../../../../shared/configs/src';

    // Anything from the @rogueworld/configs package that is needed in this client app should be
    // added here (basically just copy pasted from the index file that lists the exported configs).
    const Settings = loadSettings(pathToConfigs);

    return {
        props: {
            Settings,
        },
    };
}

export default HomePage;
