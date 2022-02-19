import TestMap from './maps/test-map.json';

interface Map {
    name: string;
    path: string;
    data: object;
}

export const Maps: Array<Map> = [
    {
        name: 'test-map',
        path: `${__dirname}/maps/test-map.json`,
        data: TestMap,
    },
];
