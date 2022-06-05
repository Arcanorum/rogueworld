import DamageTypes from '../../DamageTypes';
import { Burn } from '../../status_effects';
import addAction from '../AddAction';
import applyStatusEffect from '../generic/ApplyStatusEffect';
import basicAttack from '../generic/BasicAttack';

addAction('health-potion', 2000, basicAttack, { amount: 7, types: [DamageTypes.Physical], penetration: 50 });
addAction('fire-staff', 3000, applyStatusEffect, { StatusEffect: Burn });
addAction('wooden-club', 1000, basicAttack, { amount: 15, types: [DamageTypes.Physical], penetration: 0 });
addAction('iron-sword', 2000, basicAttack, { amount: 7, types: [DamageTypes.Physical], penetration: 0 });
