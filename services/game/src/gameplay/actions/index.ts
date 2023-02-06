import DamageTypes from '../DamageTypes';
import { Burn, Poison } from '../status_effects';
import Action from './Action';
import ActionsList from './ActionsList';
import addAction from './AddAction';
import applyStatusEffect from './generic/ApplyStatusEffect';
import basicAttack from './generic/BasicAttack';
import './items';

addAction({
    name: 'punch', duration: 1000, run: basicAttack, config: { amount: 10, types: [DamageTypes.Physical], penetration: 0 },
});
addAction({
    name: 'bite', duration: 2000, run: basicAttack, config: { amount: 7, types: [DamageTypes.Physical], penetration: 50 },
});
addAction({
    name: 'iron-sword', duration: 2000, run: basicAttack, config: { amount: 7, types: [DamageTypes.Physical] },
});
addAction({
    name: 'iron-spear', duration: 2000, run: basicAttack, config: { amount: 5, types: [DamageTypes.Physical], penetration: 50 },
});
addAction({
    name: 'spit-venom', duration: 2000, run: applyStatusEffect, config: { StatusEffect: Poison },
});
addAction({
    name: 'fireball', duration: 2000, run: applyStatusEffect, config: { StatusEffect: Burn },
});
addAction({
    name: 'heal',
    duration: 2000,
    run: (source, targetPosition, targetEntity, config) => {
        targetEntity?.heal({ amount: config.amount }, source);
    },
    condition: (source, targetPosition, targetEntity, config) => {
        if (!targetEntity) return false;
        if (!targetEntity.hitPoints) return false;
        if (!targetEntity.maxHitPoints) return false;

        // Only attempt to heal if they are below max HP.
        return targetEntity.hitPoints < targetEntity.maxHitPoints;
    },
    config: { amount: 5 },
    beneficial: true,
});

export {
    Action,
    ActionsList,
    addAction,
};
