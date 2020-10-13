// import TextMetrics from "./TextMetrics";

/**
 * Starts this sprite doing a bobbing in-out effect, mostly for pickups.
 */
Phaser.GameObjects.Container.prototype.tweenPickupFromCenter = function () {
    this.anchor.setTo(0.5);
    this.x += dungeonz.CENTER_OFFSET;
    this.y += dungeonz.CENTER_OFFSET;
    _this.add.tween(this.scale).to({ x: this.scale.x * 0.8, y: this.scale.y * 0.8 }, 1000, "Linear", true, 0, -1, true);
};

Phaser.GameObjects.Sprite.prototype.onChangeDirection = function () {
};

/**
 * Show the damage marker, with the amount of damage taken.
 * @param {String|Number} amount
 */
Phaser.GameObjects.Container.prototype.onHitPointsModified = (amount) => {
    if (amount < 0) {
        this.damageMarker.addColor('#ff2f00', 0);
    }
    else {
        this.damageMarker.addColor('#6abe30', 0);
        amount = '+' + amount;
    }

    this.damageMarker.visible = true;
    this.damageMarker.text = amount;

    // If there is already a previous damage marker waiting to be hidden,
    // stop that timer and start a new one for this damage event.
    if (this.damageMarkerDisappearTimeout !== null) {
        clearTimeout(this.damageMarkerDisappearTimeout);
    }

    var that = this;
    // Start a timeout to hide the damage marker.
    this.damageMarkerDisappearTimeout = setTimeout(function () {
        that.damageMarker.visible = false;
        that.damageMarkerDisappearTimeout = null;
    }, 800);
};

Phaser.GameObjects.Container.prototype.onInputOver = function () {
    this.displayName.visible = true;
};

Phaser.GameObjects.Container.prototype.onInputOut = function () {
    this.displayName.visible = false;
};

/*Phaser.GameObjects.Sprite.prototype.onInputDown = function() {
    console.log("default oninputdown");
};*/

/**
 * Add a text object to this sprite to use as the damage indicator.
 */
Phaser.GameObjects.Container.prototype.addDamageMarker = function () {
    this.damageMarker = _this.add.text(dungeonz.TILE_SIZE / 2, dungeonz.TILE_SIZE / 2, -99, {
        font: "20px Press Start 2P",
        align: "center",
        fill: "#f5f5f5",
        stroke: "#000000",
        strokeThickness: 5
    });
    this.damageMarker.setOrigin(0.5);
    this.damageMarker.setScale(0.2);
    //this.damageMarker.visible = false;
    this.add(this.damageMarker);
    this.damageMarkerDisappearTimeout = null;
};

/**
 * Add a text object to this sprite to use as the display name.
 * @param {String} displayName
 */
Phaser.GameObjects.Container.prototype.addDisplayName = function (displayName) {
    // The anchor is still in the top left, so offset by half the width to center the text.
    this.displayName = _this.add.text(dungeonz.TILE_SIZE / 2, 4, displayName, {
        font: "20px Press Start 2P",
        align: "center",
        fill: "#f5f5f5",
        stroke: "#000000",
        strokeThickness: 5
    });
    this.displayName.setOrigin(0.5, 1);
    this.displayName.setScale(0.25);
    this.add(this.displayName);
    //this.displayName.visible = false;
};

/**
 * A list of all client display entities that can be created.
 * @type {Object}
 */
export default (ctx => {
    let keys = ctx.keys();
    let values = keys.map(ctx);
    return keys.reduce((object, key, index) => {
        key = key.split("/").pop().slice(0, -3);
        object[key] = values[index].default;
        return object;
    }, {});
})(require.context('./entities/', true, /.js$/));