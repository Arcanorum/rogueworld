import dungeonz from "../../../shared/Global";
import Projectile from "./Projectile";

class Entity extends Projectile {
    constructor(x, y, config) {
        super(x, y, config, "proj-dark-1");
        this.anims.play("dark-spin");
    }

    static setupAnimations() {
        dungeonz.gameScene.anims.create({
            key: "dark-spin",
            defaultTextureKey: "game-atlas",
            frames: [
                { frame: "proj-dark-1" },
                { frame: "proj-dark-2" },
            ],
            duration: 250,
            repeat: -1,
        });
    }
}

export default Entity;
