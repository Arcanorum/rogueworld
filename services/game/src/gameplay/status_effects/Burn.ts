import StatusEffect from './StatusEffect';
import { GroundTypes } from '../../space';
import DamageTypes from '../DamageTypes';

const { Physical, Magical } = DamageTypes;

class Burn extends StatusEffect {
    shouldContinueEffect() {
        // If it is water, remove burning if it is applied.
        // Can't walk into deep water.
        if (this.appliedTo.getBoardTile().groundType === GroundTypes.ShallowWater) {
            return false;
        }

        return true;
    }

    shouldStop() {
        // Check if they are standing in anything that burns. If so, keep burning.
        const tileBurns = this.appliedTo
            .getBoardTile().groundType.statusEffects
            ?.some((StatusEffect) => { return StatusEffect === Burn; });

        if (tileBurns) {
            this._effectsRemaining = this._startingEffectsRemaining;
            return false;
        }

        return true;
    }
}

Burn.prototype._effectOnStart = true;
Burn.prototype._effectDamageAmount = 10;
Burn.prototype._effectDamageTypes = [ Physical, Magical ];
Burn.prototype._effectDamagePenetration = 50;
Burn.prototype._startingEffectsRemaining = 3;
Burn.prototype._startEffectEventName = 'effect_start_burn';
Burn.prototype._stopEffectEventName = 'effect_stop_burn';
Burn.prototype.hazardous = true;

export default Burn;
