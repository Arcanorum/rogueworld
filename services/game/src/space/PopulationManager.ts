import { getRandomElement } from '@rogueworld/utils';
import Board from './Board';
import { SpawnCategories } from './GroundTile';

interface Populator {
    spawnCategory: keyof SpawnCategories,
    population: number;
    maxPopulation: number;
    board: Board;
}

export default class PopulationManager {
    board: Board;

    constructor(config: { board: Board }) {
        this.board = config.board;

        const populatorConfigs: Array<{
            spawnCategory: keyof SpawnCategories;
            maxPopulation: number;
            /** How often (in ms) to try to populate the board with a new entity. */
            spawnRate: number
        }> = [
            {
                spawnCategory: 'forage',
                maxPopulation: 600,
                spawnRate: 500,
            },
            {
                spawnCategory: 'trees',
                maxPopulation: 5000,
                spawnRate: 500,
            },
            {
                spawnCategory: 'oreRocks',
                maxPopulation: 2000,
                spawnRate: 500,
            },
            {
                spawnCategory: 'otherResourceNodes',
                maxPopulation: 600,
                spawnRate: 500,
            },
            {
                spawnCategory: 'mobs',
                maxPopulation: 4000,
                spawnRate: 500,
            },
        ];

        populatorConfigs.forEach((populatorConfig) => {
            const populator: Populator = {
                ...populatorConfig,
                board: config.board,
                population: 0,
            };
            setInterval(this.spawn.bind(populator), populatorConfig.spawnRate, populator);
        });
    }

    spawn(populator: Populator) {
        // console.log('spawning:', populator.spawnCategory);

        // Don't go over the max population.
        if (populator.population >= populator.maxPopulation) return;

        const randomRowCol = this.board.getRandomRowCol();
        const boardTile = this.board.grid[randomRowCol.row][randomRowCol.col];

        const RandomEntityType = getRandomElement(
            boardTile.groundType.spawnCategories[populator.spawnCategory],
        );

        // Check the ground type actually has anything that can spawn on it that is also of this
        // category.
        if (!RandomEntityType) return;

        new RandomEntityType({
            row: randomRowCol.row,
            col: randomRowCol.col,
            board: populator.board,
        }).emitToNearbyPlayers();

        populator.population += 1;
    }
}
