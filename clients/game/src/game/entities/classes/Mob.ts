import Entity from '../Entity';

class Mob extends Entity {
    static typeName = 'Mob';

    static animationSetName = null;

    static animationRepeats = true;

    static destroySound = 'sword-cutting-flesh';
}

export default Mob;
