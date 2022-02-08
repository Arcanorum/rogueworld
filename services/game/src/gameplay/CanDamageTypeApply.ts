import Entity from '../entities/classes/Entity';
import DamageTypes from './DamageTypes';
import Damage from './Damage';

const CanDamageApply = (entity: Entity, damage: Damage) => {
    // Check the entity is immune to anything.
    if (entity.damageTypeImmunities) {
        // Check every type of this damage.
        for (const type in DamageTypes) {
            // If the entity is immune to the current type, check the net one.
            // if (entity.damageTypeImmunities.includes(type)) {
            //     continue;
            // }
            // Entity is not immune to this damage type, they can be affected.
            return true;
        }
    }
    else {
        return true;
    }
    return false;
};

export default CanDamageApply;
