
import Character from './Character'

const Sprite = function (x, y, config) {
    Character.call(this, x, y, config);
    this.displayName.setText(dungeonz.getTextDef("Mob name: Mummy"));

    this.baseSprite.animations.add('u',    ['mummy-up-1',      'mummy-up-2',       'mummy-up-1',       'mummy-up-3'],      10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('d',    ['mummy-down-1',    'mummy-down-2',     'mummy-down-1',     'mummy-down-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('l',    ['mummy-left-1',    'mummy-left-2',     'mummy-left-1',     'mummy-left-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('r',    ['mummy-right-1',   'mummy-right-2',    'mummy-right-1',    'mummy-right-3'],   10).onComplete.add(this.moveAnimCompleted, this);
};

Sprite.prototype = Object.create(Character.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.baseFrames = {
    u: 'mummy-up-1',
    d: 'mummy-down-1',
    l: 'mummy-left-1',
    r: 'mummy-right-1'
};

export default Sprite;