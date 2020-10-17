import Character from "./Character";

class Entity extends Character {
    constructor(x, y, config){
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Master assassin"));
        this.displayName.addColor("#ff6b00", 0);
        this.baseSprite.setScale(1.2);
    }

    // this.baseSprite.animations.add('u',    ['assassin-up-1',      'assassin-up-2',       'assassin-up-1',       'assassin-up-3'],      10).onComplete.add(this.moveAnimCompleted, this);
    // this.baseSprite.animations.add('d',    ['assassin-down-1',    'assassin-down-2',     'assassin-down-1',     'assassin-down-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    // this.baseSprite.animations.add('l',    ['assassin-left-1',    'assassin-left-2',     'assassin-left-1',     'assassin-left-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    // this.baseSprite.animations.add('r',    ['assassin-right-1',   'assassin-right-2',    'assassin-right-1',    'assassin-right-3'],   10).onComplete.add(this.moveAnimCompleted, this);
};

Entity.prototype.baseFrames = {
    u: 'assassin-up-1',
    d: 'assassin-down-1',
    l: 'assassin-left-1',
    r: 'assassin-right-1'
};

export default Entity;