
const Character = require('./Character');

const Sprite = function (x, y, config) {
    Character.call(this, x, y, config);

    this.displayName.setText(dungeonz.getTextDef("Mob name: Assassin"));

    this.baseSprite.animations.add('u',    ['assassin-up-1',      'assassin-up-2',       'assassin-up-1',       'assassin-up-3'],      10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('d',    ['assassin-down-1',    'assassin-down-2',     'assassin-down-1',     'assassin-down-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('l',    ['assassin-left-1',    'assassin-left-2',     'assassin-left-1',     'assassin-left-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('r',    ['assassin-right-1',   'assassin-right-2',    'assassin-right-1',    'assassin-right-3'],   10).onComplete.add(this.moveAnimCompleted, this);
};

Sprite.prototype = Object.create(Character.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.baseFrames = {
    u: 'assassin-up-1',
    d: 'assassin-down-1',
    l: 'assassin-left-1',
    r: 'assassin-right-1'
};

module.exports = Sprite;