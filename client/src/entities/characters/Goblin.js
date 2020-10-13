import Character from "./Character";

class Sprite extends Character {
    constructor(x, y, config){
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Goblin"));
    
        this.baseSprite.setScale(0.8);
    };

    // this.baseSprite.animations.add('u',    ['goblin-up-1',      'goblin-up-2',       'goblin-up-1',       'goblin-up-3'],      10).onComplete.add(this.moveAnimCompleted, this);
    // this.baseSprite.animations.add('d',    ['goblin-down-1',    'goblin-down-2',     'goblin-down-1',     'goblin-down-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    // this.baseSprite.animations.add('l',    ['goblin-left-1',    'goblin-left-2',     'goblin-left-1',     'goblin-left-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    // this.baseSprite.animations.add('r',    ['goblin-right-1',   'goblin-right-2',    'goblin-right-1',    'goblin-right-3'],   10).onComplete.add(this.moveAnimCompleted, this);
};

Sprite.prototype.baseFrames = {
    u: 'goblin-up-1',
    d: 'goblin-down-1',
    l: 'goblin-left-1',
    r: 'goblin-right-1'
};

export default Sprite;