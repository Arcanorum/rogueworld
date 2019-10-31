
import Character from './Character'

const Sprite = function (x, y, config) {
    Character.call(this, x, y, config);
    this.displayName.setText(dungeonz.getTextDef("Mob name: Pharaoh"));
    this.displayName.addColor("#ff6b00", 0);
    this.baseSprite.scale.setTo(1.2);

    this.baseSprite.animations.add('u',    ['pharaoh-up-1',      'pharaoh-up-2',       'pharaoh-up-1',       'pharaoh-up-3'],      10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('d',    ['pharaoh-down-1',    'pharaoh-down-2',     'pharaoh-down-1',     'pharaoh-down-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('l',    ['pharaoh-left-1',    'pharaoh-left-2',     'pharaoh-left-1',     'pharaoh-left-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('r',    ['pharaoh-right-1',   'pharaoh-right-2',    'pharaoh-right-1',    'pharaoh-right-3'],   10).onComplete.add(this.moveAnimCompleted, this);
};

Sprite.prototype = Object.create(Character.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.baseFrames = {
    u: 'pharaoh-up-1',
    d: 'pharaoh-down-1',
    l: 'pharaoh-left-1',
    r: 'pharaoh-right-1'
};

export default Sprite;