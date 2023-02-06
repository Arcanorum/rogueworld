import DamageTypes from '../../DamageTypes';
import addAction from '../AddAction';
import basicAttack from '../generic/BasicAttack';

addAction({
    name: 'lightning-staff', duration: 2000, run: basicAttack, config: { amount: 20, types: [DamageTypes.Magical], penetration: 0 },
});
