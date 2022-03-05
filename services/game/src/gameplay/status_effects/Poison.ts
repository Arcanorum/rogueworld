import { Cured } from '.';
import DamageTypes from '../DamageTypes';
import StatusEffect from './StatusEffect';

const { Biological } = DamageTypes;

class Poison extends StatusEffect {
    shouldStart() {
        if(this.appliedTo.statusEffects === undefined) return false;

        // If the target is cured, don't apply the poison effect.
        if (this.appliedTo.statusEffects[Cured.name]) {
            return false;
        }

        return true;
    }

    shouldContinueEffect() {
        if(this.appliedTo.statusEffects === undefined) return false;

        // If the target is cured, stop the poison effect.
        if (this.appliedTo.statusEffects[Cured.name]) {
            return false;
        }

        return true;
    }

    shouldStop() {
        // Check if they are standing in poison. If so, keep poisoned.
        const tilePoisons = this.appliedTo
            .getBoardTile()?.groundType.statusEffects
            ?.some((StatusEffect) => { return StatusEffect === Poison; });

        if (tilePoisons) {
            this._effectsRemaining = this._startingEffectsRemaining;
            return false;
        }

        return true;
    }
}

Poison.prototype._effectDamageAmount = 5;
Poison.prototype._effectDamageTypes = [Biological];
Poison.prototype._effectDamagePenetration = 100;
Poison.prototype._startingEffectsRemaining = 5;
Poison.prototype._effectRate = 2000;
Poison.prototype._startEffectEventName = 'effect_start_poison';
Poison.prototype._stopEffectEventName = 'effect_stop_poison';
Poison.prototype.hazardous = true;

export default Poison;
