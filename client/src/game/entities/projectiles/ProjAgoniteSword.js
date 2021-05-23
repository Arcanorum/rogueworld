import Projectile from "./Projectile";

class Entity extends Projectile {
    constructor(x, y, config) {
        super(x, y, config, "proj-agonite-sword");
    }
}

export default Entity;
