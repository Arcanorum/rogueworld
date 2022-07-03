import { OneSecond } from '@rogueworld/types';
import DamageTypes from '../DamageTypes';
import Curse from './Curse';

export default class IllOmen extends Curse {
    onTimeUp() {
        this.entity?.damage({
            amount: 40,
            types: [DamageTypes.Magical],
            penetration: 30,
        }, this.source);

        // Check the entity still has this curse applied, as they might have died from the above
        // damage and thus had their curse removed.
        if (this.entity && this.entity.curse === this) {
            super.onTimeUp();
        }
    }
}
IllOmen.prototype.duration = OneSecond * 4;
