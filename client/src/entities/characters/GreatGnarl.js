
import Character from './Character'

const Sprite = function (x, y, config) {
    Character.call(this, x, y, config);

    this.displayName.setText(dungeonz.getTextDef("Mob name: Great gnarl"));
    this.displayName.addColor("#ff6b00", 0);

    this.baseSprite.scale.setTo(1.2);

    this.baseSprite.animations.add('u',    ['gnarl-oak-up-1',     'gnarl-oak-up-2'],    3, true);
    this.baseSprite.animations.add('d',    ['gnarl-oak-down-1',   'gnarl-oak-down-2'],  3, true);
    this.baseSprite.animations.add('l',    ['gnarl-oak-left-1',   'gnarl-oak-left-2'],  3, true);
    this.baseSprite.animations.add('r',    ['gnarl-oak-right-1',  'gnarl-oak-right-2'], 3, true);

    this.baseSprite.animations.play(this.direction);
};

Sprite.prototype = Object.create(Character.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.onChangeDirection = function () {
    this.baseSprite.animations.stop();
    this.baseSprite.animations.play(this.direction);
};

Sprite.prototype.baseFrames = {
    u: 'gnarl-oak-up-1',
    d: 'gnarl-oak-down-1',
    l: 'gnarl-oak-left-1',
    r: 'gnarl-oak-right-1'
};

export default Sprite;