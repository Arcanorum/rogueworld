import gameConfig from "../../../shared/GameConfig";
import dungeonz from "../../../shared/Global";
import Sprite from "../Sprite";

class GalestormPower extends Sprite {
    constructor(x, y, config) {
        super(x, y, config);

        this.setScale(gameConfig.GAME_SCALE);

        this.play({
            key: "galestorm-power",
            duration: 500,
            frameRate: null, // Need to provide this or the duration won't take effect. Phaser 3.55.2 bug.
        });
    }

    static setupAnimations() {
        const key = "galestorm-power";

        dungeonz.gameScene.anims.create({
            key,
            defaultTextureKey: "game-atlas",
            frames: [
                { frame: `${key}-1` },
                { frame: `${key}-2` },
            ],
            frameRate: 2,
            repeat: -1,
            showOnStart: true,
        });
    }
}

export default GalestormPower;
