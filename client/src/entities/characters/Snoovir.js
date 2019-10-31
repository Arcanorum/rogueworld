
import Character from './Character'

const Sprite = function (x, y, config) {
    Character.call(this, x, y, config);
    this.displayName.setText(dungeonz.getTextDef("Mob name: Snoovir"));

    this.baseSprite.animations.add('u',    ['snoovir-up-1',      'snoovir-up-2',       'snoovir-up-1',       'snoovir-up-3'],      10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('d',    ['snoovir-down-1',    'snoovir-down-2',     'snoovir-down-1',     'snoovir-down-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('l',    ['snoovir-left-1',    'snoovir-left-2',     'snoovir-left-1',     'snoovir-left-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('r',    ['snoovir-right-1',   'snoovir-right-2',    'snoovir-right-1',    'snoovir-right-3'],   10).onComplete.add(this.moveAnimCompleted, this);
};

Sprite.prototype = Object.create(Character.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.baseFrames = {
    u: 'snoovir-up-1',
    d: 'snoovir-down-1',
    l: 'snoovir-left-1',
    r: 'snoovir-right-1'
};

export default Sprite;