import Phaser from "phaser";

/**
 * A wrapper around the core Phaser container, for some common things that might be used by any entity containers.
 * Avoids having to modify the Phaser container prototype.
 */
class Container extends Phaser.GameObjects.Container {
    constructor(x, y, config) {
        super(window.gameScene, x, y);
        window.gameScene.add.existing(this);
    }

    /**
     * Show the damage marker, with the amount of damage taken.
     * @param {String|Number} amount
     */
    onHitPointsModified(amount) {
        if (amount < 0) {
            // JUICE IT! maybe change it to a particle instead?
            // and have them bounce out of entity when damaged, bounce into entity when healed.
            this.damageMarker.setColor("#ff2f00");
        } else {
            this.damageMarker.setColor("#6abe30");
            amount = `+${amount}`;
        }

        this.damageMarker.visible = true;
        this.damageMarker.setText(amount);

        // If there is already a previous damage marker waiting to be hidden,
        // stop that timer and start a new one for this damage event.
        if (this.damageMarkerDisappearTimeout !== null) {
            clearTimeout(this.damageMarkerDisappearTimeout);
        }

        const that = this;
        // Start a timeout to hide the damage marker.
        this.damageMarkerDisappearTimeout = setTimeout(() => {
            that.damageMarker.visible = false;
            that.damageMarkerDisappearTimeout = null;
        }, 800);
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
     * Add a text object to this sprite to use as the damage indicator.
     */
    addDamageMarker() {
        this.damageMarker = window.gameScene.add.text(0, 0, -99, {
            fontFamily: "'Press Start 2P'",
            fontSize: 20,
            align: "center",
            fill: "#f5f5f5",
            stroke: "#000000",
            strokeThickness: 5,
        });
        this.damageMarker.setOrigin(0.5);
        this.damageMarker.setScale(0.2);
        this.damageMarker.visible = false;
        this.add(this.damageMarker);
        this.damageMarkerDisappearTimeout = null;
    }

    /**
     * Add a text object to this sprite to use as the display name.
     * @param {String} displayName
     */
    addDisplayName(displayName) {
        // The anchor is still in the top left, so offset by half the width to center the text.
        this.displayName = window.gameScene.add.text(0, -6, displayName, {
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
