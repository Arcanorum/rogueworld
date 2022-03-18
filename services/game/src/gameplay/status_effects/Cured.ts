import StatusEffect from './StatusEffect';

class Cured extends StatusEffect { }

Cured.prototype._effectOnStart = true;
Cured.prototype._startingEffectsRemaining = 60;
Cured.prototype._startEffectEventName = 'effect_start_cured';
Cured.prototype._stopEffectEventName = 'effect_stop_cured';

export default Cured;
