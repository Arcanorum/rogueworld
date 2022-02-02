import PubSub from 'pubsub-js';
import {
    POSITION_VALUE,
    DISPLAY_NAME_VALUE,
    HITPOINTS_VALUE,
    MAX_HITPOINTS_VALUE,
    FOOD_VALUE,
    MAX_FOOD_VALUE,
    GLORY_VALUE,
    DEFENCE_VALUE,
} from '../EventTypes';

class Player {
    entityId!: string;

    row!: number;

    col!: number;

    displayName!: string;

    hitPoints!: number;

    maxHitPoints!: number;

    food!: number;

    maxFood!: number;

    glory!: number;

    defence!: number;

    constructor() {
        this.init();
    }

    init() {
        this.entityId = '';

        this.row = 0;

        this.col = 0;

        this.displayName = '';

        this.hitPoints = 0;

        this.maxHitPoints = 0;

        this.food = 0;

        this.maxFood = 0;

        this.food = 0;

        this.maxFood = 0;

        this.glory = 0;

        this.defence = 0;
    }

    setRow(value: number) {
        const old = this.row;
        this.row = value;
        // Send the row and column together, as there shouldn't be
        // anything that only cares about changes to only one vector.
        PubSub.publish(POSITION_VALUE, {
            old: { row: old, col: this.col },
            new: { row: this.row, col: this.col },
        });
    }

    setCol(value: number) {
        const old = this.col;
        this.col = value;
        // Send the row and column together, as there shouldn't be
        // anything that only cares about changes to only one vector.
        PubSub.publish(POSITION_VALUE, {
            old: { row: this.row, col: old },
            new: { row: this.row, col: this.col },
        });
    }

    setDisplayName(value: string) {
        const old = this.displayName;
        this.displayName = value;
        PubSub.publish(DISPLAY_NAME_VALUE, { old, new: this.displayName });
    }

    setHitPoints(value: number) {
        const old = this.hitPoints;
        this.hitPoints = value;
        PubSub.publish(HITPOINTS_VALUE, { old, new: this.hitPoints });
    }

    setMaxHitPoints(value: number) {
        const old = this.maxHitPoints;
        this.maxHitPoints = value;
        PubSub.publish(MAX_HITPOINTS_VALUE, { old, new: this.maxHitPoints });
    }

    setFood(value: number) {
        const old = this.food;
        this.food = value;
        PubSub.publish(FOOD_VALUE, { old, new: this.food });
    }

    setMaxFood(value: number) {
        const old = this.maxFood;
        this.maxFood = value;
        PubSub.publish(MAX_FOOD_VALUE, { old, new: this.maxFood });
    }

    setGlory(value: number) {
        const old = this.glory;
        this.glory = value;
        PubSub.publish(GLORY_VALUE, { old, new: this.glory });
    }

    setDefence(value: number) {
        const old = this.defence;
        this.defence = value;
        PubSub.publish(DEFENCE_VALUE, { old, new: this.defence });
    }
}

export default Player;
