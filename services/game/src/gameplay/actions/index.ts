import DamageTypes from '../DamageTypes';
import addAction from './AddAction';
import basicAttack from './generic/BasicAttack';
import './items';

addAction('punch', 1000, basicAttack, { amount: 10, types: [DamageTypes.Physical], penetration: 0 });
addAction('bite', 2000, basicAttack, { amount: 7, types: [DamageTypes.Physical], penetration: 50 });
addAction('spit-venom', 2000, basicAttack, { amount: 7, types: [DamageTypes.Biological], penetration: 50 });
addAction('fireball', 2000, basicAttack, { amount: 10, types: [DamageTypes.Magical], penetration: 50 });
