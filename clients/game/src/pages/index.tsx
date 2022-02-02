import React from 'react';
import Head from 'next/head';
import App from '../components/App';

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
