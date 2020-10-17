import Character from "./Character";

class Entity extends Character {
    constructor(x, y, config){
        super(x, y, config);
        
        this.displayName.setText(dungeonz.getTextDef("Mob name: Commander"));
        this.displayName.addColor("#ff6b00", 0);
        this.baseSprite.setScale(1.2);
    }

    // this.baseSprite.animations.add('u',    ['knight-up-1',      'knight-up-2',       'knight-up-1',       'knight-up-3'],      10).onComplete.add(this.moveAnimCompleted, this);
    // this.baseSprite.animations.add('d',    ['knight-down-1',    'knight-down-2',     'knight-down-1',     'knight-down-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    // this.baseSprite.animations.add('l',    ['knight-left-1',    'knight-left-2',     'knight-left-1',     'knight-left-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    // this.baseSprite.animations.add('r',    ['knight-right-1',   'knight-right-2',    'knight-right-1',    'knight-right-3'],   10).onComplete.add(this.moveAnimCompleted, this);
};

Entity.prototype.baseFrames = {
    u: 'knight-up-1',
    d: 'knight-down-1',
    l: 'knight-left-1',
    r: 'knight-right-1'
};

export default Entity;