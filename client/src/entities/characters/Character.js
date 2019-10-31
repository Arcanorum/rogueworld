
const Sprite = function (x, y, config) {

    Phaser.Sprite.call(this, _this.game, x, y, undefined, undefined);

    //this.anchor.set(0.5);
    this.scale.setTo(GAME_SCALE);

    this.entityId = config.id;
    this.direction = config.direction;
    this.displayNameColor = config.displayNameColor;//can be undefined or an object with an optional 'fill' and 'stroke' property 
                                                    //    to be set as any color string value Phaser can take 
    let frame = undefined;
    if(this.baseFrames !== undefined){
        frame = this.baseFrames[config.direction] || this.baseFrames.d;
    }
    this.baseSprite = _this.add.sprite(dungeonz.TILE_SIZE / 2, dungeonz.TILE_SIZE / 2, 'game-atlas', frame);
    //this.baseSprite.baseFrames = baseFrames;
    //this.baseSprite.frameName = frame;
    this.baseSprite.anchor.set(0.5);
    this.addChild(this.baseSprite);

    this.addDisplayName(config.displayName);

    //this.chatTexts = [];

    this.energyRegenEffect = _this.add.sprite(dungeonz.TILE_SIZE / 2, dungeonz.TILE_SIZE / 2, 'game-atlas', 'energy-regen-effect-1');
    this.energyRegenEffect.animations.add('effect', ['energy-regen-effect-1', 'energy-regen-effect-2'], 2, true);
    this.energyRegenEffect.anchor.set(0.5);
    this.addChild(this.energyRegenEffect);
    this.energyRegenEffect.visible = false;

    this.healthRegenEffect = _this.add.sprite(dungeonz.TILE_SIZE / 2, dungeonz.TILE_SIZE / 2, 'game-atlas', 'health-regen-effect-1');
    this.healthRegenEffect.animations.add('effect', ['health-regen-effect-1', 'health-regen-effect-2'], 2, true);
    this.healthRegenEffect.anchor.set(0.5);
    this.addChild(this.healthRegenEffect);
    this.healthRegenEffect.visible = false;

    this.curedEffect = _this.add.sprite(dungeonz.TILE_SIZE / 2, dungeonz.TILE_SIZE / 2, 'game-atlas', 'cured-effect-1');
    this.curedEffect.animations.add('effect', ['cured-effect-1', 'cured-effect-2'], 2, true);
    this.curedEffect.anchor.set(0.5);
    this.addChild(this.curedEffect);
    this.curedEffect.visible = false;

    this.poisonEffect = _this.add.sprite(dungeonz.TILE_SIZE / 2, dungeonz.TILE_SIZE / 2, 'game-atlas', 'poison-effect-1');
    this.poisonEffect.animations.add('effect', ['poison-effect-1', 'poison-effect-2'], 2, true);
    this.poisonEffect.anchor.set(0.5);
    this.addChild(this.poisonEffect);
    this.poisonEffect.visible = false;

    this.burnEffect = _this.add.sprite(dungeonz.TILE_SIZE / 2, dungeonz.TILE_SIZE / 2, 'game-atlas', 'burn-effect-1');
    this.burnEffect.animations.add('effect', ['burn-effect-1', 'burn-effect-2'], 2, true);
    this.burnEffect.anchor.set(0.5);
    this.addChild(this.burnEffect);
    this.burnEffect.visible = false;

    this.curseIcon = _this.add.sprite(dungeonz.TILE_SIZE / 2 - 6, -6, 'game-atlas', 'curse-icon');
    this.curseIcon.anchor.set(0.5);
    this.addChild(this.curseIcon);
    this.curseIcon.visible = false;

    this.enchantmentIcon = _this.add.sprite(dungeonz.TILE_SIZE / 2 + 6, -6, 'game-atlas', 'enchantment-icon');
    this.enchantmentIcon.anchor.set(0.5);
    this.addChild(this.enchantmentIcon);
    this.enchantmentIcon.visible = false;

    this.addDamageMarker();
};

Sprite.prototype = Object.create(Phaser.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.moveAnimCompleted = function () {
    this.baseSprite.frameName = this.baseFrames[this.direction];
};

Sprite.prototype.onMove = function (playMoveAnim) {
    if(playMoveAnim === true){
        if(this.baseSprite.animations.currentAnim.isPlaying === false){
            this.baseSprite.animations.play(this.direction);
        }
    }
};

Sprite.prototype.onChangeDirection = function () {
    this.baseSprite.animations.stop();
};

Sprite.prototype.onBurnStart = function () {
    this.burnEffect.visible = true;
    this.burnEffect.animations.play('effect');
};

Sprite.prototype.onBurnStop = function () {
    this.burnEffect.visible = false;
    this.burnEffect.animations.stop(null, true);
};

Sprite.prototype.onPoisonStart = function () {
    this.poisonEffect.visible = true;
    this.poisonEffect.animations.play('effect');
};

Sprite.prototype.onPoisonStop = function () {
    this.poisonEffect.visible = false;
    this.poisonEffect.animations.stop(null, true);
};

Sprite.prototype.onHealthRegenStart = function () {
    this.healthRegenEffect.visible = true;
    this.healthRegenEffect.animations.play('effect');
};

Sprite.prototype.onHealthRegenStop = function () {
    this.healthRegenEffect.visible = false;
    this.healthRegenEffect.animations.stop(null, true);
};

Sprite.prototype.onEnergyRegenStart = function () {
    this.energyRegenEffect.visible = true;
    this.energyRegenEffect.animations.play('effect');
};

Sprite.prototype.onEnergyRegenStop = function () {
    this.energyRegenEffect.visible = false;
    this.energyRegenEffect.animations.stop(null, true);
};

Sprite.prototype.onCuredStart = function () {
    this.curedEffect.visible = true;
    this.curedEffect.animations.play('effect');
};

Sprite.prototype.onCuredStop = function () {
    this.curedEffect.visible = false;
    this.curedEffect.animations.stop(null, true);
};


export default Sprite;