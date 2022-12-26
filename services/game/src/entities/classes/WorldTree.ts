import Damage from '../../gameplay/Damage';
import { World } from '../../space';
import Entity, { EntityConfig } from './Entity';
import Player from './Player';

export default class WorldTree extends Entity {
    static rangeOfInfluence = 5;

    constructor(config: EntityConfig) {
        super(config);

        this.board!.worldTree = this;
    }

    onDestroy(): void {
        delete this.board?.worldTree;

        super.onDestroy();

        World.reset();
    }

    onDamage(damage: Damage, source?: Entity | undefined): void {
        // Prevent damage from players.
        if (source instanceof Player) return;

        super.onDamage(damage, source);
    }
}
