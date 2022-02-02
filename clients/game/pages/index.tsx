import React from 'react';
import Head from 'next/head';
import { getRandomElement, message } from '@dungeonz/utils';


console.log('rand elem:', getRandomElement([ 'a', 'b', 'c', 'd' ]));

message('stuff');

const HomePage = () => {
    return (
        <>
            <Head>
                <title>Dungeonz.io</title>
            </Head>
            <div>Hello World</div>
            <div>5 + 3 = ????</div>
        </>
    );
};

export default HomePage;
