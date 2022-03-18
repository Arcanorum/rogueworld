import StatusEffect from './StatusEffect';

class ColdResistance extends StatusEffect { }

ColdResistance.prototype._effectOnStart = true;
ColdResistance.prototype._startingEffectsRemaining = 60;
ColdResistance.prototype._startEffectEventName = 'effect_start_cold_resistance';
ColdResistance.prototype._stopEffectEventName = 'effect_stop_cold_resistance';

export default ColdResistance;
