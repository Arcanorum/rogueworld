
import Character from './Character'

const Sprite = function (x, y, config) {
    Character.call(this, x, y, config);
    this.displayName.setText(dungeonz.getTextDef("Mob name: Vampire"));

    this.baseSprite.animations.add('u',    ['vampire-up-1',      'vampire-up-2',       'vampire-up-1',       'vampire-up-3'],      10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('d',    ['vampire-down-1',    'vampire-down-2',     'vampire-down-1',     'vampire-down-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('l',    ['vampire-left-1',    'vampire-left-2',     'vampire-left-1',     'vampire-left-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('r',    ['vampire-right-1',   'vampire-right-2',    'vampire-right-1',    'vampire-right-3'],   10).onComplete.add(this.moveAnimCompleted, this);
};

Sprite.prototype = Object.create(Character.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.baseFrames = {
    u: 'vampire-up-1',
    d: 'vampire-down-1',
    l: 'vampire-left-1',
    r: 'vampire-right-1'
};

export default Sprite;