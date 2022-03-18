import DamageTypes from '../DamageTypes';
import StatusEffect from './StatusEffect';

const { Biological } = DamageTypes;

class Disease extends StatusEffect { }

Disease.prototype._effectDamageAmount = 3;
Disease.prototype._effectDamageTypes = [ Biological ];
Disease.prototype._effectDamagePenetration = 100;
Disease.prototype._startingEffectsRemaining = 20;
Disease.prototype._effectRate = 4000;
Disease.prototype._startEffectEventName = 'effect_start_disease';
Disease.prototype._stopEffectEventName = 'effect_stop_disease';
Disease.prototype.hazardous = true;

export default Disease;
