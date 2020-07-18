
const Character = require('./Character');

const Sprite = function (x, y, config) {
    Character.call(this, x, y, config);

    this.displayName.setText(dungeonz.getTextDef("Mob name: Warrior"));

    this.baseSprite.animations.add('u', ['warrior-up-1', 'warrior-up-2', 'warrior-up-1', 'warrior-up-3'], 10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('d', ['warrior-down-1', 'warrior-down-2', 'warrior-down-1', 'warrior-down-3'], 10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('l', ['warrior-left-1', 'warrior-left-2', 'warrior-left-1', 'warrior-left-3'], 10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('r', ['warrior-right-1', 'warrior-right-2', 'warrior-right-1', 'warrior-right-3'], 10).onComplete.add(this.moveAnimCompleted, this);
};

Sprite.prototype = Object.create(Character.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.baseFrames = {
    u: 'warrior-up-1',
    d: 'warrior-down-1',
    l: 'warrior-left-1',
    r: 'warrior-right-1'
};

module.exports = Sprite;