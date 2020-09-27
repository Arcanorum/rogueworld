
const ItemTypes = require('../../../src/catalogues/ItemTypes');

const moveAnimCompleted = function () {
    this.setFrame(this.clothesFrames[this.clothesName][this.parent.direction]);
};

const Sprite = function (config) {

    Phaser.GameObjects.Sprite.call(this, _this, 0, 0, 'game-atlas');

    this.direction = config.direction || 'd';

    // If clothes were specified (a character came into range already wearing something), then use those clothes.
    if (config.clothingTypeNumber !== undefined) {
        this.clothesName = ItemTypes[config.clothingTypeNumber].idName;
    }
    // No clothes, don't show the clothes sprite.
    else {
        this.visible = false;
        // Default to mage robe.
        this.clothesName = 'Mage robe';
    }

    // Set the sprite frame to use from the current texture atlas.
    this.setFrame(this.clothesFrames[this.clothesName][this.direction]);

    // this.animations.add('Plain robe-u', ['plain-robe-up-1', 'plain-robe-up-2', 'plain-robe-up-1', 'plain-robe-up-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Plain robe-d', ['plain-robe-down-1', 'plain-robe-down-2', 'plain-robe-down-1', 'plain-robe-down-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Plain robe-l', ['plain-robe-left-1', 'plain-robe-left-2', 'plain-robe-left-1', 'plain-robe-left-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Plain robe-r', ['plain-robe-right-1', 'plain-robe-right-2', 'plain-robe-right-1', 'plain-robe-right-3'], 10).onComplete.add(moveAnimCompleted, this);

    // this.animations.add('Mage robe-u', ['mage-robe-up-1', 'mage-robe-up-2', 'mage-robe-up-1', 'mage-robe-up-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Mage robe-d', ['mage-robe-down-1', 'mage-robe-down-2', 'mage-robe-down-1', 'mage-robe-down-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Mage robe-l', ['mage-robe-left-1', 'mage-robe-left-2', 'mage-robe-left-1', 'mage-robe-left-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Mage robe-r', ['mage-robe-right-1', 'mage-robe-right-2', 'mage-robe-right-1', 'mage-robe-right-3'], 10).onComplete.add(moveAnimCompleted, this);

    // this.animations.add('Necromancer robe-u', ['necromancer-robe-up-1', 'necromancer-robe-up-2', 'necromancer-robe-up-1', 'necromancer-robe-up-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Necromancer robe-d', ['necromancer-robe-down-1', 'necromancer-robe-down-2', 'necromancer-robe-down-1', 'necromancer-robe-down-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Necromancer robe-l', ['necromancer-robe-left-1', 'necromancer-robe-left-2', 'necromancer-robe-left-1', 'necromancer-robe-left-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Necromancer robe-r', ['necromancer-robe-right-1', 'necromancer-robe-right-2', 'necromancer-robe-right-1', 'necromancer-robe-right-3'], 10).onComplete.add(moveAnimCompleted, this);

    // this.animations.add('Cloak-u', ['cloak-up-1', 'cloak-up-2', 'cloak-up-1', 'cloak-up-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Cloak-d', ['cloak-down-1', 'cloak-down-2', 'cloak-down-1', 'cloak-down-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Cloak-l', ['cloak-left-1', 'cloak-left-2', 'cloak-left-1', 'cloak-left-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Cloak-r', ['cloak-right-1', 'cloak-right-2', 'cloak-right-1', 'cloak-right-3'], 10).onComplete.add(moveAnimCompleted, this);

    // this.animations.add('Ninja garb-u', ['ninja-garb-up-1', 'ninja-garb-up-2', 'ninja-garb-up-1', 'ninja-garb-up-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Ninja garb-d', ['ninja-garb-down-1', 'ninja-garb-down-2', 'ninja-garb-down-1', 'ninja-garb-down-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Ninja garb-l', ['ninja-garb-left-1', 'ninja-garb-left-2', 'ninja-garb-left-1', 'ninja-garb-left-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Ninja garb-r', ['ninja-garb-right-1', 'ninja-garb-right-2', 'ninja-garb-right-1', 'ninja-garb-right-3'], 10).onComplete.add(moveAnimCompleted, this);

    // this.animations.add('Iron armour-u', ['iron-armour-up-1', 'iron-armour-up-2', 'iron-armour-up-1', 'iron-armour-up-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Iron armour-d', ['iron-armour-down-1', 'iron-armour-down-2', 'iron-armour-down-1', 'iron-armour-down-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Iron armour-l', ['iron-armour-left-1', 'iron-armour-left-2', 'iron-armour-left-1', 'iron-armour-left-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Iron armour-r', ['iron-armour-right-1', 'iron-armour-right-2', 'iron-armour-right-1', 'iron-armour-right-3'], 10).onComplete.add(moveAnimCompleted, this);

    // this.animations.add('Dungium armour-u', ['dungium-armour-up-1', 'dungium-armour-up-2', 'dungium-armour-up-1', 'dungium-armour-up-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Dungium armour-d', ['dungium-armour-down-1', 'dungium-armour-down-2', 'dungium-armour-down-1', 'dungium-armour-down-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Dungium armour-l', ['dungium-armour-left-1', 'dungium-armour-left-2', 'dungium-armour-left-1', 'dungium-armour-left-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Dungium armour-r', ['dungium-armour-right-1', 'dungium-armour-right-2', 'dungium-armour-right-1', 'dungium-armour-right-3'], 10).onComplete.add(moveAnimCompleted, this);

    // this.animations.add('Noctis armour-u', ['noctis-armour-up-1', 'noctis-armour-up-2', 'noctis-armour-up-1', 'noctis-armour-up-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Noctis armour-d', ['noctis-armour-down-1', 'noctis-armour-down-2', 'noctis-armour-down-1', 'noctis-armour-down-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Noctis armour-l', ['noctis-armour-left-1', 'noctis-armour-left-2', 'noctis-armour-left-1', 'noctis-armour-left-3'], 10).onComplete.add(moveAnimCompleted, this);
    // this.animations.add('Noctis armour-r', ['noctis-armour-right-1', 'noctis-armour-right-2', 'noctis-armour-right-1', 'noctis-armour-right-3'], 10).onComplete.add(moveAnimCompleted, this);
};

Sprite.prototype = Object.create(Phaser.GameObjects.Sprite.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.clothesFrames = {
    ['Plain robe']: {
        u: 'plain-robe-up-1',
        d: 'plain-robe-down-1',
        l: 'plain-robe-left-1',
        r: 'plain-robe-right-1'
    },
    ['Mage robe']: {
        u: 'mage-robe-up-1',
        d: 'mage-robe-down-1',
        l: 'mage-robe-left-1',
        r: 'mage-robe-right-1'
    },
    ['Necromancer robe']: {
        u: 'necromancer-robe-up-1',
        d: 'necromancer-robe-down-1',
        l: 'necromancer-robe-left-1',
        r: 'necromancer-robe-right-1'
    },
    ['Cloak']: {
        u: 'cloak-up-1',
        d: 'cloak-down-1',
        l: 'cloak-left-1',
        r: 'cloak-right-1'
    },
    ['Ninja garb']: {
        u: 'ninja-garb-up-1',
        d: 'ninja-garb-down-1',
        l: 'ninja-garb-left-1',
        r: 'ninja-garb-right-1'
    },
    ['Iron armour']: {
        u: 'iron-armour-up-1',
        d: 'iron-armour-down-1',
        l: 'iron-armour-left-1',
        r: 'iron-armour-right-1'
    },
    ['Dungium armour']: {
        u: 'dungium-armour-up-1',
        d: 'dungium-armour-down-1',
        l: 'dungium-armour-left-1',
        r: 'dungium-armour-right-1'
    },
    ['Noctis armour']: {
        u: 'noctis-armour-up-1',
        d: 'noctis-armour-down-1',
        l: 'noctis-armour-left-1',
        r: 'noctis-armour-right-1'
    }
};

module.exports = Sprite;