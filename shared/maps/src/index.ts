import plains from './maps/plains.json';
import groundTileset from './tilesets/ground.json';

export interface MapLayer {
    id: number;
    name: string;
    type: string;
    width: number;
    height: number;
    x: number;
    y: number;
    data: Array<number>;
    opacity: number;
    visible: boolean;
}

export interface MapProperty {
    name: string;
    type: string;
    value: any;
}

export interface MapTileset {
    firstgid: number;
    source: string;
}

export interface TiledMap {
    width: number;
    height: number;
    layers: Array<MapLayer>;
    properties: Array<MapProperty>;
    tilesets: Array<MapTileset>;
}

export interface GameMap {
    name: string;
    path: string;
    data: TiledMap;
}

export const Maps: Array<GameMap> = [
    {
        name: 'plains',
        path: `${__dirname}/maps/plains.json`,
        data: plains as TiledMap,
    },
];

export const Tilesets = {
    groundTileset,
};
