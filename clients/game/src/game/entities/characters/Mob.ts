import getTextDef from '../../../shared/GetTextDef';
import Entity from '../Entity';

class Mob extends Entity {
    static loadConfig(config) {
        this.displayName = getTextDef(`Mob name: ${config.displayName}`);

        super.loadConfig(config);
    }
}

export default Mob;
