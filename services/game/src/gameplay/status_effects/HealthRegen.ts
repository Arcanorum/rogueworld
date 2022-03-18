import StatusEffect from './StatusEffect';

class HealthRegen extends StatusEffect { }

HealthRegen.prototype._healAmount = 10;
HealthRegen.prototype._startingEffectsRemaining = 5;
HealthRegen.prototype._startEffectEventName = 'effect_start_health_regen';
HealthRegen.prototype._stopEffectEventName = 'effect_stop_health_regen';

export default HealthRegen;
