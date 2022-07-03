import Curse from './Curse';

export default class Pacify extends Curse {
    onEntityAttack() {
        return false;
    }

    onEntityDamaged() {
        this.remove();
        return true;
    }
}
