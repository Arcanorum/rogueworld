import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const App = dynamic(
    () => import('../components/App'),
    { ssr: false },
);

const HomePage = () => {
    return (
        <>
            <Head>
                <title>Dungeonz.io</title>
            </Head>
            <App />
        </>
    );
};

export default HomePage;
