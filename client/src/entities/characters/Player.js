
import Character from './Character'
import Clothes from "./Clothes";

const Sprite = function (x, y, config) {
    Character.call(this, x, y, config);

    // Give this player a clothes object.
    // Whenever the clothes change, it is just changing the frame name used of this one display object.
    this.clothes = new Clothes(config);
    this.addChild(this.clothes);
    // Bring the display name over the clothes, so the clothes don't cover it.
    this.swapChildren(this.clothes, this.displayName);

    this.baseSprite.animations.add('u',    ['human-up-1',      'human-up-2',       'human-up-1',       'human-up-3'],      10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('d',    ['human-down-1',    'human-down-2',     'human-down-1',     'human-down-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('l',    ['human-left-1',    'human-left-2',     'human-left-1',     'human-left-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    this.baseSprite.animations.add('r',    ['human-right-1',   'human-right-2',    'human-right-1',    'human-right-3'],   10).onComplete.add(this.moveAnimCompleted, this);

    // TODO: add a chat bubble above head when someone starts chatting.
};

Sprite.prototype = Object.create(Character.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.onMove = function (playMoveAnim) {
    if(playMoveAnim === true){
        if(this.baseSprite.animations.currentAnim.isPlaying === false){
            this.baseSprite.animations.play(this.direction);
            this.clothes.animations.play(this.clothes.clothesName + "-" + this.direction);
        }
    }
};

Sprite.prototype.baseFrames = {
    u: 'human-up-1',
    d: 'human-down-1',
    l: 'human-left-1',
    r: 'human-right-1'
};

export default Sprite;