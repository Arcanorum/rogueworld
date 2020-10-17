import Character from "./Character";

class Entity extends Character {
    constructor(x, y, config){
        super(x, y, config);
    
        this.baseSprite.setScale(1);
    
        this.displayName.setText(dungeonz.getTextDef("Mob name: Hawk"));
    }

    // this.baseSprite.animations.add('u',    ['hawk-up-1',     'hawk-up-2',     'hawk-up-3'],    5, true);
    // this.baseSprite.animations.add('d',    ['hawk-down-1',   'hawk-down-2',   'hawk-down-3'],  5, true);
    // this.baseSprite.animations.add('l',    ['hawk-left-1',   'hawk-left-2',   'hawk-left-3'],  5, true);
    // this.baseSprite.animations.add('r',    ['hawk-right-1',  'hawk-right-2',  'hawk-right-3'], 5, true);

    // this.baseSprite.animations.play(this.direction);
};

Entity.prototype.baseFrames = {
    u: 'hawk-up-1',
    d: 'hawk-down-1',
    l: 'hawk-left-1',
    r: 'hawk-right-1'
};

export default Entity;