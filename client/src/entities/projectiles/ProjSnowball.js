import Projectile from "./Projectile";

class Entity extends Projectile {
    constructor(x, y, config) {
        super(x, y, config, "proj-snowball-1");
        this.anims.play("snowball-spin");
    }

    static setupAnimations() {
        _this.anims.create({
            key: "snowball-spin",
            defaultTextureKey: "game-atlas",
            frames: [
                { frame: "proj-snowball-1" },
                { frame: "proj-snowball-2" }
            ],
            duration: 1000,
            repeat: -1
        });
    }
};

export default Entity;