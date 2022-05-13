import Config from '../../../shared/Config';
import Sprite from '../Sprite';

class Clothes extends Sprite {
    clothesName: string;

    constructor(config: {clothingTypeCode: string}) {
        super(0, 0, config);

        // If clothes were specified (a character came into range already wearing something), then use those clothes.
        if (config.clothingTypeCode !== undefined) {
            this.clothesName = Config.ItemTypes[config.clothingTypeCode].translationId;
        }
        // No clothes, don't show the clothes sprite.
        else {
            this.visible = false;
            // Default to mage robe.
            this.clothesName = 'Mage robe';
        }

        // Set the sprite frame to use from the current texture atlas.
        // this.setFrame(this.clothesFrames[this.clothesName][this.direction]);

        this.on('animationcomplete', this.moveAnimCompleted);
    }

    static setupAnimations() {
        const duration = 500;
        const defaultTextureKey = 'game-atlas';
        const directions = ['up', 'down', 'left', 'right'];
        // const generateFrames = (baseFrameName, direction) => [
        //     { frame: `${baseFrameName}-${direction}-1` },
        //     { frame: `${baseFrameName}-${direction}-2` },
        //     { frame: `${baseFrameName}-${direction}-1` },
        //     { frame: `${baseFrameName}-${direction}-3` },
        // ];
        // const addAnimationSet = (setName, baseFrameName) => {
        //     directions.forEach((direction) => {
        //         rogueworld.gameScene.anims.create({
        //             key: `${setName}-${direction}`,
        //             defaultTextureKey,
        //             frames: generateFrames(baseFrameName, direction),
        //             duration,
        //         });
        //     });
        // };

        // addAnimationSet('Plain robe', 'plain-robe');
        // addAnimationSet('Mage robe', 'mage-robe');
        // addAnimationSet('Necromancer robe', 'necromancer-robe');
        // addAnimationSet('Cloak', 'cloak');
        // addAnimationSet('Ninja garb', 'ninja-garb');
        // addAnimationSet('Iron armour', 'iron-armour');
        // addAnimationSet('Dungium armour', 'dungium-armour');
        // addAnimationSet('Agonite armour', 'agonite-armour');
        // addAnimationSet('Noctis armour', 'noctis-armour');
        // addAnimationSet('Armor of Ire', 'armor-of-ire');
        // addAnimationSet('Etherweave', 'etherweave');
    }

    moveAnimCompleted() {
        // this.setFrame(this.clothesFrames[this.clothesName][this.parentContainer.direction]);
    }

    setDirection(direction: string) {
        return;
    }
}

export default Clothes;
