import { ColdResistance } from '.';
import { GroundTypes } from '../../space';
import StatusEffect from './StatusEffect';

class Chill extends StatusEffect {
    shouldStart() {
        if (!this.appliedTo.statusEffects) return false;

        // If the target has cold resistance, don't apply the chill effect.
        if (this.appliedTo.statusEffects[ColdResistance.name]) {
            return false;
        }

        return true;
    }

    shouldContinueEffect() {
        if (!this.appliedTo.statusEffects) return false;

        // If it is lava, remove chill if it is applied.
        if (this.appliedTo.getBoardTile()?.groundType === GroundTypes.Lava) {
            return false;
        }

        // If the target has cold resistance, stop the chill effect.
        if (this.appliedTo.statusEffects[ColdResistance.name]) {
            return false;
        }

        return true;
    }

    shouldStop() {
        // Check if they are standing on a chilling tile. If so, keep chilled.
        const tileChills = this.appliedTo
            .getBoardTile()?.groundType.statusEffects
            ?.some((someStatusEffect) => someStatusEffect === Chill);

        if (tileChills) {
            this._effectsRemaining = this._startingEffectsRemaining;
            return false;
        }

        return true;
    }
}

Chill.prototype._effectOnStart = true;
Chill.prototype._startingEffectsRemaining = 2;
Chill.prototype._startEffectEventName = 'effect_start_chill';
Chill.prototype._stopEffectEventName = 'effect_stop_chill';
Chill.prototype.moveRateModifier = 2;

export default Chill;
