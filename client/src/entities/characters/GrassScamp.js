const Character = require('./Character');

const Sprite = function (x, y, config) {
    Character.call(this, x, y, config);
    this.displayName.setText(dungeonz.getTextDef("Mob name: Grass scamp"));

    this.baseSprite.setScale(0.8);

    // this.baseSprite.animations.add('u',    ['grass-scamp-up-1',      'grass-scamp-up-2',       'grass-scamp-up-1',       'grass-scamp-up-3'],      10).onComplete.add(this.moveAnimCompleted, this);
    // this.baseSprite.animations.add('d',    ['grass-scamp-down-1',    'grass-scamp-down-2',     'grass-scamp-down-1',     'grass-scamp-down-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    // this.baseSprite.animations.add('l',    ['grass-scamp-left-1',    'grass-scamp-left-2',     'grass-scamp-left-1',     'grass-scamp-left-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    // this.baseSprite.animations.add('r',    ['grass-scamp-right-1',   'grass-scamp-right-2',    'grass-scamp-right-1',    'grass-scamp-right-3'],   10).onComplete.add(this.moveAnimCompleted, this);
};

Sprite.prototype = Object.create(Character.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.baseFrames = {
    u: 'grass-scamp-up-1',
    d: 'grass-scamp-down-1',
    l: 'grass-scamp-left-1',
    r: 'grass-scamp-right-1'
};

module.exports = Sprite;