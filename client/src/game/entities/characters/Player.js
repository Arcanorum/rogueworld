import dungeonz from "../../../shared/Global";
import Utils from "../../../shared/Utils";
import Character from "./Character";
import Clothes from "./Clothes";

class Entity extends Character {
    constructor(x, y, config) {
        super(x, y, config);

        // Give this player a clothes object.
        // Whenever the clothes change, it is just changing the frame name used of this one display object.
        this.clothes = new Clothes(config);
        this.add(this.clothes);
        // Bring the display name and damage/heal marker over the clothes, so the clothes don't cover them.
        this.bringToTop(this.curseIcon);
        this.bringToTop(this.enchantmentIcon);
        this.bringToTop(this.displayName);

        // TODO: add a chat bubble above head when someone starts chatting.
    }

    onMove(playMoveAnim) {
        if (playMoveAnim === true) {
            this.clothes.anims.play(`${this.clothes.clothesName}-${this.direction}`);
        }
        super.onMove(playMoveAnim);
    }

    /**
     * Show how much glory was gained/lost.
     * @param {String|Number} amount
     */
    onGloryModified(amount) {
        const icon = dungeonz.gameScene.add.sprite(0, -1, "game-atlas", "glory-icon");
        icon.setOrigin(0.5, 1);
        icon.setScale(0.25);

        icon.upTween = dungeonz.gameScene.tweens.add({
            targets: icon,
            y: "-=20",
            duration: 1500,
            ease: "Back.easeOut",
            onComplete: function cb() {
                this.targets[0].destroy();
            },
        });

        this.add(icon);

        if (amount > 0) {
            amount = `+${amount}`;
        }

        const text = dungeonz.gameScene.add.text(0, 0, amount, {
            fontFamily: "'Press Start 2P'",
            fontSize: 16,
            align: "center",
            fill: "#76428a",
            stroke: "#000000",
            strokeThickness: 5,
        });
        text.setOrigin(0.5, 0);
        text.setScale(0.25);

        text.upTween = dungeonz.gameScene.tweens.add({
            targets: text,
            y: "-=20",
            duration: 1500,
            ease: "Back.easeOut",
            onComplete: function cb() {
                this.targets[0].destroy();
            },
        });

        this.add(text);
    }
}

Entity.prototype.animationSetName = "human";

export default Entity;
