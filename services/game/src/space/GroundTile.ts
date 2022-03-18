import Damage from '../gameplay/Damage';
import DamageTypes from '../gameplay/DamageTypes';
import { StatusEffect } from '../gameplay/status_effects';
import { GroundTypeName } from './GroundTypes';

interface GroundTileConfig {
    name: GroundTypeName;
    damageConfig?: Damage;
    canBeStoodOn?: boolean;
    canBeBuiltOn?: boolean;
    statusEffects?: Array<typeof StatusEffect>;
}

class GroundTile {
    /**
     * A unique name for this type of tile.
     */
    name: GroundTypeName;

    /**
     * How much damage this tile deals to entities that stand on it.
     */
    damageAmount = 0;

    /**
     * What kinds of damage this tile deals to entities that stand on it.
     */
    damageTypes: Array<DamageTypes> = [];

    /**
     * what percentage of defence is ignored when this tile deals damage to entities that stand on it. 0 to 1.
     */
    damagePenetration = 0;

    /**
     * Whether this tile can be stood on.
     */
    canBeStoodOn = true;

    /**
     * Whether this tile can be built on (player structures).
     */
    canBeBuiltOn = false;

    /**
     * Any status effects that can be applied to entities that stand on it.
     */
    statusEffects?: Array<typeof StatusEffect>;

    /**
     * Whether this tile is dangerous in any way (deals damage or applies a damaging status effect).
     */
    hazardous = false;

    constructor(config: GroundTileConfig) {
        this.name = config.name;

        if (config.damageConfig) {
            this.damageAmount = config.damageConfig.amount;
            this.damageTypes = config.damageConfig.types;
            this.damagePenetration = config.damageConfig.penetration;
        }

        if (config.canBeStoodOn === false) this.canBeStoodOn = false;

        if (config.canBeBuiltOn) this.canBeBuiltOn = true;

        if (config.statusEffects) this.statusEffects = config.statusEffects || null;

        if (this.damageAmount > 0) this.hazardous = true;

        if (this.statusEffects) {
            this.hazardous = this.statusEffects.some((StatusEffect) => {
                return StatusEffect.prototype.hazardous;
            });
        }
    }
}

export default GroundTile;
