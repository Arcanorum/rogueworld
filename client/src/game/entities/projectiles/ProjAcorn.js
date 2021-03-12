import gameConfig from "../../../shared/GameConfig";
import dungeonz from "../../../shared/Global";
import Projectile from "./Projectile";

class Entity extends Projectile {
    constructor(x, y, config) {
        super(x, y, config, "proj-acorn-1");
        this.setScale(gameConfig.GAME_SCALE * 0.6);
        this.anims.play("acorn-spin");
    }

    static setupAnimations() {
        dungeonz.gameScene.anims.create({
            key: "acorn-spin",
            defaultTextureKey: "game-atlas",
            frames: [
                { frame: "proj-acorn-1" },
                { frame: "proj-acorn-2" },
                { frame: "proj-acorn-3" },
                { frame: "proj-acorn-4" },
            ],
            duration: 1000,
            repeat: -1,
        });
    }
}

export default Entity;
