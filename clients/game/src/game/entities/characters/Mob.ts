import getTextDef from '../../../shared/GetTextDef';
import Entity from '../Entity';

class Mob extends Entity {
    constructor(x: number, y: number, config: any) {
        config.displayName = getTextDef(`Mob name: ${config.displayName}`);
        super(x, y, config);
    }
}

export default Mob;
