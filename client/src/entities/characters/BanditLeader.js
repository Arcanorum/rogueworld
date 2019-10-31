
import Character from './Character'

const Sprite = function (x, y, config) {
    Character.call(this, x, y, config);
    this.displayName.setText(dungeonz.getTextDef("Mob name: Bandit leader"));
    this.displayName.addColor("#ff6b00", 0);
    this.baseSprite.scale.setTo(1.2);

    this.baseSprite.animations.add('u',    ['bandit-up-1',      'bandit-up-2',       'bandit-up-1',       'bandit-up-3'],      10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('d',    ['bandit-down-1',    'bandit-down-2',     'bandit-down-1',     'bandit-down-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('l',    ['bandit-left-1',    'bandit-left-2',     'bandit-left-1',     'bandit-left-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('r',    ['bandit-right-1',   'bandit-right-2',    'bandit-right-1',    'bandit-right-3'],   10).onComplete.add(this.moveAnimCompleted, this);
};

Sprite.prototype = Object.create(Character.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.baseFrames = {
    u: 'bandit-up-1',
    d: 'bandit-down-1',
    l: 'bandit-left-1',
    r: 'bandit-right-1'
};

export default Sprite;