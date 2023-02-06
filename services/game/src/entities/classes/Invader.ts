import { OneMinute, OneSecond } from '@rogueworld/types';
import Factions from '../../gameplay/Factions';
import Dynamic from './Dynamic';
import { EntityConfig } from './Entity';

export default class Invader extends Dynamic {
    static abstract = true;

    static viewRange = 20;

    static baseLifespan = OneMinute;

    static targetSearchRate = OneSecond * 10;

    static baseFaction = Factions.Invaders;

    constructor(config: EntityConfig) {
        super(config);

        this.setTarget(config.board.worldTree);
    }
}
