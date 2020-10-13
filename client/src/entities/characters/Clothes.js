import ItemTypes from "../../../src/catalogues/ItemTypes";

const moveAnimCompleted = function () {
    this.setFrame(this.clothesFrames[this.clothesName][this.parent.direction]);
};

class Clothes extends Phaser.GameObjects.Sprite {
    constructor(config){
        super(_this, 0, 0, "game-atlas");

        _this.add.existing(this);

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
    }

    static setupAnimations() {
        const
            duration = 500,
            defaultTextureKey = "game-atlas",
            directions = ["up", "down", "left", "right"],
            generateFrames = (baseFrameName) => {
                return [
                    { frame: `${baseFrameName}-up-1`},
                    { frame: `${baseFrameName}-up-2`},
                    { frame: `${baseFrameName}-up-1`},
                    { frame: `${baseFrameName}-up-3`},
                ];
            },
            addAnimationSet = (setName, baseFrameName) => {
                directions.forEach((direction) => {
                    _this.anims.create({
                        key: `${setName}-${direction}`,
                        defaultTextureKey,
                        frames: generateFrames(baseFrameName),
                        duration
                    });
                });
            };

        addAnimationSet("Plain robe", "plain-robe");
        addAnimationSet("Mage robe", "mage-robe");
        addAnimationSet("Necromancer robe", "necromancer-robe");
        addAnimationSet("Cloak", "cloak");
        addAnimationSet("Nina garb", "ninja-garb");
        addAnimationSet("Iron armour", "iron-armour");
        addAnimationSet("Dungium armour", "dungium-armour");
        addAnimationSet("Noctis armour", "noctis-armour");

    }

};

Clothes.prototype.clothesFrames = {
    ['Plain robe']: {
        up: 'plain-robe-up-1',
        down: 'plain-robe-down-1',
        left: 'plain-robe-left-1',
        right: 'plain-robe-right-1'
    },
    ['Mage robe']: {
        up: 'mage-robe-up-1',
        down: 'mage-robe-down-1',
        left: 'mage-robe-left-1',
        right: 'mage-robe-right-1'
    },
    ['Necromancer robe']: {
        up: 'necromancer-robe-up-1',
        down: 'necromancer-robe-down-1',
        left: 'necromancer-robe-left-1',
        right: 'necromancer-robe-right-1'
    },
    ['Cloak']: {
        up: 'cloak-up-1',
        down: 'cloak-down-1',
        left: 'cloak-left-1',
        right: 'cloak-right-1'
    },
    ['Ninja garb']: {
        up: 'ninja-garb-up-1',
        down: 'ninja-garb-down-1',
        left: 'ninja-garb-left-1',
        right: 'ninja-garb-right-1'
    },
    ['Iron armour']: {
        up: 'iron-armour-up-1',
        down: 'iron-armour-down-1',
        left: 'iron-armour-left-1',
        right: 'iron-armour-right-1'
    },
    ['Dungium armour']: {
        up: 'dungium-armour-up-1',
        down: 'dungium-armour-down-1',
        left: 'dungium-armour-left-1',
        right: 'dungium-armour-right-1'
    },
    ['Noctis armour']: {
        up: 'noctis-armour-up-1',
        down: 'noctis-armour-down-1',
        left: 'noctis-armour-left-1',
        right: 'noctis-armour-right-1'
    }
};

export default Clothes;