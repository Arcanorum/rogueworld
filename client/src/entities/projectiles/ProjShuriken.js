import Projectile from "./Projectile";

class Entity extends Projectile {
    constructor(x, y, config) {
        super(x, y, config, "proj-shuriken-1");
        this.anims.play("shuriken-spin");
    }

    static setupAnimations() {
        _this.anims.create({
            key: "shuriken-spin",
            defaultTextureKey: "game-atlas",
            frames: [
                { frame: "proj-shuriken-1" },
                { frame: "proj-shuriken-2" }
            ],
            duration: 1000,
            repeat: -1
        });
    }
};

export default Entity;