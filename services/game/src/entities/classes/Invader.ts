import { OneSecond } from '@rogueworld/types';
import Dynamic from './Dynamic';
import { EntityConfig } from './Entity';

export default class Invader extends Dynamic {
    static abstract = true;

    static focusedOnWorldTree = false;

    static baseLifespan = OneSecond * 30;

    constructor(config: EntityConfig) {
        super(config);

        this.target = config.board.worldTree;
    }
}
