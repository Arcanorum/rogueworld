import Phaser from "phaser";
import dungeonz from "../../shared/Global";
import Utils from "../../shared/Utils";

/**
 * A wrapper around the core Phaser container, for some common things that might be used by any entity containers.
 * Avoids having to modify the Phaser container prototype.
 */
class Container extends Phaser.GameObjects.Container {
    constructor(x, y) {
        super(dungeonz.gameScene, x, y);
        dungeonz.gameScene.add.existing(this);
    }

    /**
     * Show the damage marker, with the amount of damage/healing taken.
     * @param {String|Number} amount
     */
    onHitPointsModified(amount) {
        if (amount < 0) {
            const damageParticle = dungeonz.gameScene.add.text(0, 0, amount, {
                fontFamily: "'Press Start 2P'",
                fontSize: 16,
                align: "center",
                fill: "#ff2f00",
                stroke: "#000000",
                strokeThickness: 5,
            });
            damageParticle.setOrigin(0.5, 1);
            damageParticle.setScale(0.25);

            const xOffset = Utils.getRandomIntInclusive(-50, 50);

            damageParticle.rightTween = dungeonz.gameScene.tweens.add({
                targets: damageParticle,
                x: `+=${xOffset}`,
                duration: 1000,
                alpha: 0,
                ease: "Linear",
            });
            damageParticle.upTween = dungeonz.gameScene.tweens.add({
                targets: damageParticle,
                y: "-=10",
                duration: 1000,
                ease: "Back.easeOut",
                onComplete: function cb() {
                    this.targets[0].destroy();
                },
            });

            this.add(damageParticle);
        }
        else {
            amount = `+${amount}`;

            const damageParticle = dungeonz.gameScene.add.text(0, 0, amount, {
                fontFamily: "'Press Start 2P'",
                fontSize: 16,
                align: "center",
                fill: "#6abe30",
                stroke: "#000000",
                strokeThickness: 5,
            });
            damageParticle.setOrigin(0.5, 1);
            damageParticle.setScale(0.25);

            const xOffset = Utils.getRandomIntInclusive(-20, 20);

            damageParticle.rightTween = dungeonz.gameScene.tweens.add({
                targets: damageParticle,
                x: `+=${xOffset}`,
                duration: 1000,
                alpha: 0,
                ease: "Linear",
            });
            damageParticle.upTween = dungeonz.gameScene.tweens.add({
                targets: damageParticle,
                y: "-=20",
                duration: 1000,
                ease: "Back.easeOut",
                onComplete: function cb() {
                    this.targets[0].destroy();
                },
            });

            this.add(damageParticle);
        }
    }

    /**
     * Show the display name of this entity when it is hovered over.
     */
    onPointerOver() {
        this.displayName.visible = true;
    }

    /**
     * Hide the display name when it isn't being hovered over any more.
     */
    onPointerOut() {
        this.displayName.visible = false;
    }

    /**
     * Add a text object to this sprite to use as the display name.
     * @param {String} displayName
     */
    addDisplayName(displayName) {
        // The anchor is still in the top left, so offset by half the width to center the text.
        this.displayName = dungeonz.gameScene.add.text(0, -6, displayName, {
            fontFamily: "'Press Start 2P'",
            fontSize: 20,
            align: "center",
            fill: "#f5f5f5",
            stroke: "#000000",
            strokeThickness: 5,
        });
        this.displayName.setOrigin(0.5, 1);
        this.displayName.setScale(0.25);
        this.displayName.visible = false;
        this.add(this.displayName);
    }
}

export default Container;
