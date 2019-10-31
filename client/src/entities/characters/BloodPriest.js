
import Character from './Character'

const Sprite = function (x, y, config) {
    Character.call(this, x, y, config);
    this.displayName.setText(dungeonz.getTextDef("Mob name: Blood priest"));

    this.baseSprite.animations.add('u',    ['blood-priest-up-1',      'blood-priest-up-2',       'blood-priest-up-1',       'blood-priest-up-3'],      10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('d',    ['blood-priest-down-1',    'blood-priest-down-2',     'blood-priest-down-1',     'blood-priest-down-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('l',    ['blood-priest-left-1',    'blood-priest-left-2',     'blood-priest-left-1',     'blood-priest-left-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('r',    ['blood-priest-right-1',   'blood-priest-right-2',    'blood-priest-right-1',    'blood-priest-right-3'],   10).onComplete.add(this.moveAnimCompleted, this);
};

Sprite.prototype = Object.create(Character.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.baseFrames = {
    u: 'blood-priest-up-1',
    d: 'blood-priest-down-1',
    l: 'blood-priest-left-1',
    r: 'blood-priest-right-1'
};

export default Sprite;