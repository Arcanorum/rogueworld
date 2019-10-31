
import Character from './Character'

const Sprite = function (x, y, config) {
    Character.call(this, x, y, config);
    this.displayName.setText(dungeonz.getTextDef("Mob name: Blood lord"));
    this.displayName.addColor("#ff6b00", 0);
    this.baseSprite.scale.setTo(1.2);

    this.baseSprite.animations.add('u',    ['blood-lord-up-1',      'blood-lord-up-2',       'blood-lord-up-1',       'blood-lord-up-3'],      10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('d',    ['blood-lord-down-1',    'blood-lord-down-2',     'blood-lord-down-1',     'blood-lord-down-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('l',    ['blood-lord-left-1',    'blood-lord-left-2',     'blood-lord-left-1',     'blood-lord-left-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('r',    ['blood-lord-right-1',   'blood-lord-right-2',    'blood-lord-right-1',    'blood-lord-right-3'],   10).onComplete.add(this.moveAnimCompleted, this);
};

Sprite.prototype = Object.create(Character.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.baseFrames = {
    u: 'blood-lord-up-1',
    d: 'blood-lord-down-1',
    l: 'blood-lord-left-1',
    r: 'blood-lord-right-1'
};

export default Sprite;