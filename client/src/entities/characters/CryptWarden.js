
import Character from './Character'

const Sprite = function (x, y, config) {
    Character.call(this, x, y, config);
    this.displayName.setText(dungeonz.getTextDef("Mob name: Crypt warden"));

    this.baseSprite.animations.add('u',    ['crypt-warden-up-1',      'crypt-warden-up-2',       'crypt-warden-up-1',       'crypt-warden-up-3'],      10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('d',    ['crypt-warden-down-1',    'crypt-warden-down-2',     'crypt-warden-down-1',     'crypt-warden-down-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('l',    ['crypt-warden-left-1',    'crypt-warden-left-2',     'crypt-warden-left-1',     'crypt-warden-left-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('r',    ['crypt-warden-right-1',   'crypt-warden-right-2',    'crypt-warden-right-1',    'crypt-warden-right-3'],   10).onComplete.add(this.moveAnimCompleted, this);
};

Sprite.prototype = Object.create(Character.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.baseFrames = {
    u: 'crypt-warden-up-1',
    d: 'crypt-warden-down-1',
    l: 'crypt-warden-left-1',
    r: 'crypt-warden-right-1'
};

export default Sprite;