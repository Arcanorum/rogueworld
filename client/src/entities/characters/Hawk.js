
import Character from './Character'

const Sprite = function (x, y, config) {
    Character.call(this, x, y, config);

    this.baseSprite.scale.setTo(1);

    this.displayName.setText(dungeonz.getTextDef("Mob name: Hawk"));

    this.baseSprite.animations.add('u',    ['hawk-up-1',     'hawk-up-2',     'hawk-up-3'],    5, true);
    this.baseSprite.animations.add('d',    ['hawk-down-1',   'hawk-down-2',   'hawk-down-3'],  5, true);
    this.baseSprite.animations.add('l',    ['hawk-left-1',   'hawk-left-2',   'hawk-left-3'],  5, true);
    this.baseSprite.animations.add('r',    ['hawk-right-1',  'hawk-right-2',  'hawk-right-3'], 5, true);

    this.baseSprite.animations.play(this.direction);
};

Sprite.prototype = Object.create(Character.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.onChangeDirection = function () {
    this.baseSprite.animations.stop();
    this.baseSprite.animations.play(this.direction);
};

Sprite.prototype.baseFrames = {
    u: 'hawk-up-1',
    d: 'hawk-down-1',
    l: 'hawk-left-1',
    r: 'hawk-right-1'
};

export default Sprite;