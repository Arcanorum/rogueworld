import React from 'react';
import Head from 'next/head';
import { getRandomElement, message } from '@dungeonz/utils';
import App from '../components/App';


console.log('rand elem:', getRandomElement([ 'a', 'b', 'c', 'd' ]));

message('stuff');

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
