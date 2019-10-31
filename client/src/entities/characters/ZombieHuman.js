
import Character from './Character'

const Sprite = function (x, y, config) {
    Character.call(this, x, y, config);
    this.displayName.setText(dungeonz.getTextDef("Mob name: Zombie"));

    this.baseSprite.animations.add('u',    ['human-zombie-up-1',      'human-zombie-up-2',       'human-zombie-up-1',       'human-zombie-up-3'],      10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('d',    ['human-zombie-down-1',    'human-zombie-down-2',     'human-zombie-down-1',     'human-zombie-down-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('l',    ['human-zombie-left-1',    'human-zombie-left-2',     'human-zombie-left-1',     'human-zombie-left-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('r',    ['human-zombie-right-1',   'human-zombie-right-2',    'human-zombie-right-1',    'human-zombie-right-3'],   10).onComplete.add(this.moveAnimCompleted, this);
};

Sprite.prototype = Object.create(Character.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.baseFrames = {
    u: 'human-zombie-up-1',
    d: 'human-zombie-down-1',
    l: 'human-zombie-left-1',
    r: 'human-zombie-right-1'
};

export default Sprite;