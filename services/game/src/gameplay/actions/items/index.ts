import DamageTypes from '../../DamageTypes';
import addAction from '../AddAction';
import basicAttack from '../generic/BasicAttack';

addAction('lightning-staff', 2000, basicAttack, { amount: 20, types: [DamageTypes.Magical], penetration: 0 });
