import Projectile from "./Projectile";

class Entity extends Projectile {
    constructor(x, y, config) {
        super(x, y, config, "proj-acorn-1");
        this.setScale(GAME_SCALE * 0.6);
        this.anims.play("acorn-spin");
    }

    static setupAnimations() {
        console.log("setting up proj acorn anims");
        _this.anims.create({
            key: "acorn-spin",
            defaultTextureKey: "game-atlas",
            frames: [
                { frame: "proj-acorn-1" },
                { frame: "proj-acorn-2" },
                { frame: "proj-acorn-3" },
                { frame: "proj-acorn-4" }
            ],
            duration: 1000,
            repeats: true
        });
    }
};

export default Entity;