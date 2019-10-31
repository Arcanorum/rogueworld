
import Character from './Character'

const Sprite = function (x, y, config) {
    Character.call(this, x, y, config);
    this.displayName.setText(dungeonz.getTextDef("Mob name: Prisoner"));

    this.baseSprite.animations.add('u',    ['prisoner-up-1',      'prisoner-up-2',       'prisoner-up-1',       'prisoner-up-3'],      10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('d',    ['prisoner-down-1',    'prisoner-down-2',     'prisoner-down-1',     'prisoner-down-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('l',    ['prisoner-left-1',    'prisoner-left-2',     'prisoner-left-1',     'prisoner-left-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('r',    ['prisoner-right-1',   'prisoner-right-2',    'prisoner-right-1',    'prisoner-right-3'],   10).onComplete.add(this.moveAnimCompleted, this);
};

Sprite.prototype = Object.create(Character.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.baseFrames = {
    u: 'prisoner-up-1',
    d: 'prisoner-down-1',
    l: 'prisoner-left-1',
    r: 'prisoner-right-1'
};

export default Sprite;