import Character from "./Character";

class Entity extends Character {
    constructor(x, y, config){
        super(x, y, config);
    
        this.baseSprite.setScale(0.5);
    
        this.displayName.setText(dungeonz.getTextDef("Mob name: Rat"));
    
        // this.baseSprite.animations.add('u',    ['rat-up-1',      'rat-up-2',       'rat-up-1',       'rat-up-3'],      5, true);
        // this.baseSprite.animations.add('d',    ['rat-down-1',    'rat-down-2',     'rat-down-1',     'rat-down-3'],    5, true);
        // this.baseSprite.animations.add('l',    ['rat-left-1',    'rat-left-2',     'rat-left-1',     'rat-left-3'],    5, true);
        // this.baseSprite.animations.add('r',    ['rat-right-1',   'rat-right-2',    'rat-right-1',    'rat-right-3'],   5, true);

    }
};

Entity.prototype.baseFrames = {
    u: 'rat-up-1',
    d: 'rat-down-1',
    l: 'rat-left-1',
    r: 'rat-right-1'
};

export default Entity;