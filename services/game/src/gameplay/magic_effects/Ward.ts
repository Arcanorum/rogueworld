import { OneMinute } from '@rogueworld/types';
import Enchantment from './Enchantment';

export default class Ward extends Enchantment {
    onEntityDamaged() {
        this.remove();
        return false;
    }
}
Ward.prototype.duration = OneMinute * 5;
