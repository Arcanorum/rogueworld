import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';

const App = dynamic(
    () => import('../components/App'),
    { ssr: false },
);

const HomePage = () => {
    console.log('in home component');

    return (
        <>
            <Head>
                <title>Dungeonz.io</title>
            </Head>
            <div>stuff</div>
            <App />
        </>
    );
};

export default HomePage;
