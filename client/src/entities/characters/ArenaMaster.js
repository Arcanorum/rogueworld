const NPCShopTypes = require('./../../catalogues/NPCShopTypes');

const Sprite = function (x, y, config) {
    Phaser.GameObjects.Container.call(this, _this, x, y, undefined, undefined);
    this.setScale(GAME_SCALE);

    this.entityId = config.id;

    this.baseSprite = _this.add.sprite(dungeonz.TILE_SIZE / 2, dungeonz.TILE_SIZE / 2, 'game-atlas', 'trader-basic-1');
    this.baseSprite.setOrigin(0.5);
    this.add(this.baseSprite);

    // this.baseSprite.animations.add('idle', ['trader-basic-1', 'trader-basic-2'], 2, true);
    // this.baseSprite.animations.play('idle');

    this.addDisplayName(dungeonz.getTextDef("Mob name: Arena master"));
};

Sprite.prototype = Object.create(Phaser.GameObjects.Container.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.onInputDown = function () {
    // Check they are within trading range.
    const player = _this.player;
    const entity = _this.dynamics[this.entityId];
    const rowDist = Math.abs(player.row - entity.row);
    const colDist = Math.abs(player.col - entity.col);
    if ((rowDist + colDist) < 3) {
        _this.GUI.shopPanel.show(this.entityId, this.displayName.text, NPCShopTypes.Arena);
    }
};

export default Sprite;