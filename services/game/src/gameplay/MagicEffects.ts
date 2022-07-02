import Entity from '../entities/classes/Entity';
import DamageTypes from './DamageTypes';

interface MagicEffectConfig {
    entity: Entity;
    source?: Entity;
}

class MagicEffect {
    /** The entity that this magic effect is affecting. */
    entity?: Entity;

    /** The source entity that this magic effect originates from. */
    source?: Entity;

    timeout: NodeJS.Timeout;

    duration = 10000;

    /**
     * @param config
     * @param config.entity - What this magic effect will affect.
     * @param config.source - The thing that caused this magic effect.
     */
    constructor({
        entity,
        source,
    }: MagicEffectConfig) {
        this.entity = entity;

        if (source) {
            this.source = source;
        }

        this.timeout = setTimeout(this.onTimeUp.bind(this), this.duration);
    }

    remove() {
        this.entity = undefined;

        this.source = undefined;

        clearTimeout(this.timeout);
    }

    /**
     * @returns Whether the caller should continue processing.
     */
    onEntityDamaged() { return true; }

    /**
     * @returns Whether the caller should continue processing.
     */
    onEntityDeath() { return true; }

    /**
     * @returns Whether the caller should continue processing.
     */
    onEntityAttack() { return true; }

    onTimeUp() {
        this.remove();
    }
}

export class Curse extends MagicEffect {
    constructor(config: MagicEffectConfig) {
        if (config.entity.curse) config.entity.curse.remove();

        super(config);

        if (!this.entity) return;

        if (this.entity.curse) {
            // The entity didn't already have a curse, so tell all nearby players this now has one.
            this.entity.board?.emitToNearbyPlayers(
                this.entity.row,
                this.entity.col,
                'curse_set',
                this.entity.id,
            );
        }

        this.entity.curse = this;
    }

    remove() {
        if (this.entity) {
            this.entity.curse = undefined;

            this.entity.board?.emitToNearbyPlayers(
                this.entity.row,
                this.entity.col,
                'curse_removed',
                this.entity.id,
            );
        }
        super.remove();
    }
}

export class Enchantment extends MagicEffect {
    constructor(config: MagicEffectConfig) {
        if (config.entity.enchantment) config.entity.enchantment.remove();

        super(config);

        if (!this.entity) return;

        if (this.entity.enchantment) {
            // The entity didn't already have an enchantment, so tell all nearby players this now has one.
            this.entity.board?.emitToNearbyPlayers(
                this.entity.row,
                this.entity.col,
                'enchantment_set',
                this.entity.id,
            );
        }
        this.entity.enchantment = this;
    }

    remove() {
        if (this.entity) {
            this.entity.enchantment = undefined;
            if (this.entity.board) {
                this.entity.board.emitToNearbyPlayers(
                    this.entity.row,
                    this.entity.col,
                    'enchantment_removed',
                    this.entity.id,
                );
            }
        }
        super.remove();
    }
}

class Ward extends Enchantment {
    onEntityDamaged() {
        this.remove();
        return false;
    }
}
Ward.prototype.duration = 300000; // 5 mins.

class Pacify extends Curse {
    onEntityAttack() {
        return false;
    }

    onEntityDamaged() {
        this.remove();
        return true;
    }
}

class Deathbind extends Curse {
    onEntityDeath() {
        if (this.entity) {
            // if (this.entity.CorpseType) {
            //     new this.entity.CorpseType.prototype.ZombieType({
            //         row: this.entity.row,
            //         col: this.entity.col,
            //         board: this.entity.board,
            //     }).emitToNearbyPlayers();
            // }
        }
        this.remove();
        return false;
    }
}
Deathbind.prototype.duration = 300000; // 5 mins.

class IllOmen extends Curse {
    onTimeUp() {
        this.entity?.damage({
            amount: 40,
            types: [DamageTypes.Magical],
            penetration: 30,
        }, this.source);

        // Check the entity still has this curse applied, as they might have died from the above
        // damage and thus had their curse removed.
        if (this.entity && this.entity.curse === this) {
            super.onTimeUp();
        }
    }
}
IllOmen.prototype.duration = 4000;

export const MagicEffects = {
    Ward,
    Pacify,
    Deathbind,
    IllOmen,
};
