import { EntityConfig } from '../Entity';
import Mob from './Mob';

interface DoorConfig extends EntityConfig {
    isBlocking: boolean;
}

class Door extends Mob {
    static typeName = 'Door';

    static animationSetName = null;

    constructor(
        x: number,
        y: number,
        config: DoorConfig,
    ) {
        super(x, y, config);

        this.setActiveState(config.isBlocking);
    }

    setActiveState(state: boolean) {
        if(state) {
            this.baseSprite.setFrame(`${(this.constructor as typeof Door).animationSetName}-1`);
        }
        else {
            this.baseSprite.setFrame(`${(this.constructor as typeof Door).animationSetName}-2`);
        }
    }
}

export default Door;
