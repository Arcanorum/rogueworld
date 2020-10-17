import Character from "./Character";

class Entity extends Character {
    constructor(x, y, config){
        super(x, y, config);

        this.displayName.setText(dungeonz.getTextDef("Mob name: Arch mage"));
        this.displayName.addColor("#ff6b00", 0);
        this.baseSprite.setScale(1.2);
    }

    static setupAnimations() {
        // TODO: console.log("do other character setupanims");
    }

    // this.baseSprite.animations.add('u',    ['mage-up-1',      'mage-up-2',       'mage-up-1',       'mage-up-3'],      10).onComplete.add(this.moveAnimCompleted, this);
    // this.baseSprite.animations.add('d',    ['mage-down-1',    'mage-down-2',     'mage-down-1',     'mage-down-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    // this.baseSprite.animations.add('l',    ['mage-left-1',    'mage-left-2',     'mage-left-1',     'mage-left-3'],    10).onComplete.add(this.moveAnimCompleted, this);
    // this.baseSprite.animations.add('r',    ['mage-right-1',   'mage-right-2',    'mage-right-1',    'mage-right-3'],   10).onComplete.add(this.moveAnimCompleted, this);
};

Entity.prototype.baseFrames = {
    u: 'mage-up-1',
    d: 'mage-down-1',
    l: 'mage-left-1',
    r: 'mage-right-1'
};

export default Entity;