import Entity, { EntityConfig } from './Entity';

type CharacterConfig = EntityConfig;

class Character extends Entity {
    maxHitPoints = 1;

    hitPoints = this.maxHitPoints;

    defence = 0;

    constructor(config: CharacterConfig) {
        super(config);
    }

    modDefence(amount: number) {
        this.defence += amount;
    }
}

export default Character;
