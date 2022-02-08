import DamageTypes from '../DamageTypes';
import StatusEffect from './StatusEffect';

const { Physical } = DamageTypes;

class BrokenBones extends StatusEffect { }

BrokenBones.prototype._effectOnStart = false;
BrokenBones.prototype._startingEffectsRemaining = 5;
BrokenBones.prototype._startEffectEventName = 'effect_start_broken_bones';
BrokenBones.prototype._stopEffectEventName = 'effect_stop_broken_bones';
BrokenBones.prototype._moveDamageAmount = 3;
BrokenBones.prototype._moveDamageTypes = [ Physical ];
BrokenBones.prototype._moveDamagePenetration = 30;

export default BrokenBones;
