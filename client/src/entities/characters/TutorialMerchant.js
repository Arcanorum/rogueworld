
import NPCShopTypes from './../../catalogues/NPCShopTypes'

const Sprite = function (x, y, config) {
    Phaser.Sprite.call(this, _this.game, x, y, undefined, undefined);
    this.scale.setTo(GAME_SCALE);

    this.entityId = config.id;

    this.baseSprite = _this.add.sprite(dungeonz.TILE_SIZE / 2, dungeonz.TILE_SIZE / 2, 'game-atlas', 'tutorial-trader-basic-1');
    this.baseSprite.anchor.set(0.5);
    this.addChild(this.baseSprite);

    this.baseSprite.animations.add('idle',    ['tutorial-trader-basic-1', 'tutorial-trader-basic-2', 'tutorial-trader-basic-1', 'tutorial-trader-basic-3'],   4, true);
    this.baseSprite.animations.play('idle');

    this.addDisplayName(dungeonz.getTextDef("Mob name: Merchant"));
};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.onInputDown = function () {
    //console.log("trader innkeeper oninputdown, npc shop types:", NPCShopTypes);
    // Check they are within trading range.
    const player = _this.player;
    const entity = _this.dynamics[this.entityId];
    const rowDist = Math.abs(player.row - entity.row);
    const colDist = Math.abs(player.col - entity.col);
    if((rowDist + colDist) < 3){
        _this.GUI.shopPanel.show(this.entityId, this.displayName.text, NPCShopTypes.Tutorial);
    }
};

export default Sprite;