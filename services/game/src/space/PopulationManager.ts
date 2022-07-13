import Board from './Board';

interface Populator {
    name: string,
    count: number;
    max: number;
    spawnLoop: NodeJS.Timer;
}

export default class PopulationManager {
    board: Board;

    // populators: Array<Populator> = [];

    constructor(config: { board: Board }) {
        this.board = config.board;

        const populatorConfigs = [
            {
                name: 'forage',
                max: 500,
                spawnRate: 1000,
            },
            {
                name: 'trees',
                max: 500,
                spawnRate: 1000,
            },
            {
                name: 'oreRocks',
                max: 300,
                spawnRate: 1000,
            },
            {
                name: 'other',
                max: 200,
                spawnRate: 1000,
            },
            {
                name: 'mobs',
                max: 500,
                spawnRate: 1000,
            },
        ];

        populatorConfigs.forEach((populatorConfig) => {
            const populator = {
                ...populatorConfig,
                board: config.board,
                count: 0,

            };
            setInterval(this.spawn.bind(populator), populatorConfig.spawnRate, populator);
        });
    }

    spawn() {
        const boardTile = this.board.getRandomTile();

        // TODO: make a list of all entities that can be spawned on a given ground type.
        // Can still do it from the entity config, just don't keep it as an Entity property
        // just grab it and add this entity type to the matching ground type's list of spawnable
        // entities in the given category
        // - forage <-- most important right at the start!
        // - trees
        // - orerocks
        // - otherresource
        // - mob
    }
}
