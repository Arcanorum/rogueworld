import DamageTypes from '../DamageTypes';
import Action, { ActionFunction } from './Action';
import basicAttack from './BasicAttack';

const ActionsList: {[key: string]: Action} = {};

function addAction(name: string, duration: number, run: ActionFunction, config: any) {
    ActionsList[name] = { name, duration, run, config };
}

addAction('punch', 1000, basicAttack, { amount: 10, types: [DamageTypes.Physical], penetration: 0 });
addAction('bite', 2000, basicAttack, { amount: 7, types: [DamageTypes.Physical], penetration: 50 });
addAction('spit-venom', 2000, basicAttack, { amount: 7, types: [DamageTypes.Biological], penetration: 50 });
addAction('iron-sword', 2000, basicAttack, { amount: 7, types: [DamageTypes.Physical], penetration: 50 });
addAction('fireball', 2000, basicAttack, { amount: 10, types: [DamageTypes.Magical], penetration: 50 });

export default ActionsList;
