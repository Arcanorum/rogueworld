
const Character = require('./Character');

const Sprite = function (x, y, config) {
    Character.call(this, x, y, config);
    this.displayName.setText(dungeonz.getTextDef("Mob name: Mage"));

    this.baseSprite.animations.add('u',    ['mage-up-1',      'mage-up-2',       'mage-up-1',       'mage-up-3'],      10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('d',    ['mage-down-1',    'mage-down-2',     'mage-down-1',     'mage-down-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('l',    ['mage-left-1',    'mage-left-2',     'mage-left-1',     'mage-left-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('r',    ['mage-right-1',   'mage-right-2',    'mage-right-1',    'mage-right-3'],   10).onComplete.add(this.moveAnimCompleted, this);
};

Sprite.prototype = Object.create(Character.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.baseFrames = {
    u: 'mage-up-1',
    d: 'mage-down-1',
    l: 'mage-left-1',
    r: 'mage-right-1'
};

module.exports = Sprite;