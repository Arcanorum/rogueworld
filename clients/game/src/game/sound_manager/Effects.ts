import { getRandomElement } from '@rogueworld/utils';
import Config from '../../shared/Config';
import Global from '../../shared/Global';
import { GUIState } from '../../shared/state';
import SoundType from './SoundType';

export default class Effects {
    list: Array<SoundType>;

    sounds: {
        [key: string]: SoundType | Array<SoundType> |
        { [key: string]: SoundType | Array<SoundType> };
    };

    constructor(scene: Phaser.Scene) {
        this.list = [];

        this.sounds = {
            guiTick: this.addSound(scene.sound.add('generic-gui-tick') as SoundType),
            footsteps: [
                this.addSound(scene.sound.add('footstep-1') as SoundType),
                this.addSound(scene.sound.add('footstep-2') as SoundType),
                this.addSound(scene.sound.add('footstep-3') as SoundType),
                this.addSound(scene.sound.add('footstep-4') as SoundType),
            ],
            punch: this.addSound(scene.sound.add('punch-1') as SoundType),
            dungeonKeyGained: this.addSound(scene.sound.add('dungeon-key-gained') as SoundType),
            dropped: {
                default: this.addSound(scene.sound.add('item-dropped') as SoundType),
            },
            equipped: {
                default: this.addSound(scene.sound.add('weapon-equipped') as SoundType),
                // Add what ever kinds of sounds you want a particular item to play when equipped.
                // Should also be defined in the server item config in Items.yaml.
                'Metal weapon': this.addSound(scene.sound.add('weapon-equipped') as SoundType),
                'Metal clothing': this.addSound(scene.sound.add('clothing-equipped') as SoundType),
                'Fabric clothing': this.addSound(scene.sound.add('clothing-equipped') as SoundType),
            },
            unequipped: { },
            used: {
                // Add what ever kinds of sounds you want a particular item to play when used.
                // Should also be defined in the server item config in Items.yaml.
                Scroll: this.addSound(scene.sound.add('fast-magic-spell') as SoundType),
                // "Food": // TODO: Add food consumed sound here
                Drink: this.addSound(scene.sound.add('magical-potion-drink') as SoundType),
                Bow: [
                    this.addSound(scene.sound.add('arrow-shot-1') as SoundType),
                    this.addSound(scene.sound.add('arrow-shot-2') as SoundType),
                ],
            },
        };

        this.updateVolume();
    }

    addSound(sound: SoundType) {
        this.list.push(sound);
        return sound;
    }

    updateVolume() {
        this.list.forEach((sound) => {
            sound.setVolume(GUIState.effectsVolume / 100);
        });
    }

    playGUITick() {
        Global.gameScene.sound.play('generic-gui-tick', { volume: GUIState.effectsVolume / 100 });
    }

    playFootstep() {
        // Play a random footstep sound every time they move.
        getRandomElement(this.sounds.footsteps as Array<SoundType>).play();
    }

    playEquippedSound(itemTypeCode: string) {
        this.playSoundType(this.sounds.equipped, itemTypeCode);
    }

    playUnequippedSound(itemTypeCode: string) {
        this.playSoundType(this.sounds.unequipped, itemTypeCode);
    }

    playUsedSound(itemTypeCode: string) {
        this.playSoundType(this.sounds.used, itemTypeCode);
    }

    playDroppedSound(itemTypeCode: string) {
        this.playSoundType(this.sounds.dropped, itemTypeCode);
    }

    // eslint-disable-next-line class-methods-use-this
    playSoundType(scope: { [key: string]: any }, itemTypeCode: string) {
        const itemType = Config.ItemTypes[itemTypeCode];

        // Play the specific sound for the sound type of this item if one is defined.
        if (itemType && itemType.soundType && scope[itemType.soundType]) {
            // Play a random sound from the list if there are multiple.
            if (Array.isArray(scope[itemType.soundType])) {
                getRandomElement(scope[itemType.soundType] as Array<SoundType>).play();
            }
            else {
                scope[itemType.soundType].play();
            }
        }
        // No specific sound set. Use the generic/default one, if it is set.
        else if (scope.default) {
            scope.default.play();
        }
        // There is no specific or default sound. Don't play anything.
    }
}
