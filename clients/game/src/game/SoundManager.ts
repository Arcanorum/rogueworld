import { ObjectOfStrings } from '../../../../shared/types/src';
import { getRandomElement, warning } from '../../../../shared/utils/src';
import Config from '../shared/Config';
import Global from '../shared/Global';
import { GUIState } from '../shared/state';

type SoundType = (
    Phaser.Sound.HTML5AudioSound |
    Phaser.Sound.WebAudioSound
);

class Music {
    list: Array<SoundType>;
    sounds: {[key: string]: SoundType};
    currentBackgroundMusic: SoundType;

    constructor(scene: Phaser.Scene) {
        this.list = [];

        this.sounds = {
            deathLoop: this.addSound(scene.sound.add('death-loop') as SoundType),
            // Themes.
            'exploration-theme': this.addSound(scene.sound.add('exploration-theme') as SoundType),
            'city-theme': this.addSound(scene.sound.add('city-theme') as SoundType),
            'blood-halls-theme': this.addSound(scene.sound.add('blood-halls-theme') as SoundType),
            'vampire-island-overworld-theme': this.addSound(scene.sound.add('vampire-island-overworld-theme') as SoundType),
            'desert-overworld-theme': this.addSound(scene.sound.add('desert-overworld-theme') as SoundType),
            'forest-maze-theme': this.addSound(scene.sound.add('forest-maze-theme') as SoundType),
            generic2: this.addSound(scene.sound.add('generic-theme-2') as SoundType),
        };

        this.currentBackgroundMusic = this.sounds.generic2;

        this.updateVolume();
    }

    addSound(sound: SoundType) {
        this.list.push(sound);
        return sound;
    }

    updateVolume() {
        this.list.forEach((sound) => {
            sound.setVolume(GUIState.musicVolume / 100);
        });
    }

    changeBackgroundMusic(sound: SoundType) {
        const fromMusic = this.currentBackgroundMusic;

        // Fade out the current audio.
        Global.gameScene.tweens.add({
            targets: fromMusic,
            volume: {
                getStart() {
                    return GUIState.musicVolume / 100;
                },
                getEnd() {
                    return 0;
                },
            },
            duration: 2000,
            ease: 'Linear',
            onComplete: () => {
                fromMusic.stop();
            },
        });

        sound.play({
            loop: true,
        });

        this.currentBackgroundMusic = sound;

        // Fade playing the audio in.
        Global.gameScene.tweens.add({
            targets: this.currentBackgroundMusic,
            volume: {
                getStart() {
                    return 0;
                },
                getEnd() {
                    return GUIState.musicVolume / 100;
                },
            },
            duration: 2000,
            ease: 'Linear',
        });
    }
}

class Effects {
    list: Array<SoundType>;
    sounds: {
        [key: string]: SoundType | Array<SoundType> |
        {[key: string]: SoundType | Array<SoundType>};
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
                // Should also be defined in the server item config in Items.yml.
                'Metal weapon': this.addSound(scene.sound.add('weapon-equipped') as SoundType),
                'Metal clothing': this.addSound(scene.sound.add('clothing-equipped') as SoundType),
                'Fabric clothing': this.addSound(scene.sound.add('clothing-equipped') as SoundType),
            },
            unequipped: { },
            used: {
                // Add what ever kinds of sounds you want a particular item to play when used.
                // Should also be defined in the server item config in Items.yml.
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
    playSoundType(scope: {[key: string]: any}, itemTypeCode: string) {
        const itemType = Config.ItemTypes[itemTypeCode];

        // Play the specific sound for the sound type of this item if one is defined.
        if (itemType && itemType.soundType && scope[itemType.soundType]) {
            // Play a random sound from the list if there are multiple.
            if (Array.isArray(scope[itemType.soundType])) {
                getRandomElement(scope[itemType.soundType]).play();
            }
            else {
                scope[itemType.soundType].play();
            }
        }
        else if (scope.default) { // No specific sound set. Use the generic/default one, if it is set.
            scope.default.play();
        }
        // There is no specific or default sound. Don't play anything.
    }
}

/**
 * Any sounds added here need to use the file name of the audio file, as all audio assets are loaded dynamically and stored by their file name.
 * i.e. for the audio files "./my-sound.mp3" and "./my-sound.ogg", simply use `scene.sound.add("my-sound")`.
 */
class SoundManager {
    music: Music;
    effects: Effects;

    constructor(scene: Phaser.Scene) {
        // this.player = new PlayerSounds(scene);
        // this.items = new ItemSounds(scene);
        this.music = new Music(scene);
        this.effects = new Effects(scene);
    }

    /**
     * A list of all audio assets to be loaded.
     * Created using all of the webpack resolved audio file paths for the files found in /assets/audio,
     * to avoid having a huge list of imports than need constantly updating when new stuff is added.
     * This does NOT load the audio files directly, only gets what their paths would be when output to /build/static/media.
     * The Phaser boot scene does the actual loading, using those paths.
     * The list looks like `<FILENAME>: <ARRAY>`.
     * @example
     * {
     *     "clothing-equipped": [
     *         "/static/media/clothing-equipped.mp3",
     *         "/static/media/clothing-equipped.ogg"
     *     ],
     *     "item-dropped": [
     *         "/static/media/item-dropped.mp3",
     *         "/static/media/item-dropped.ogg"
     *     ],
     *     "generic-theme-1": [
     *         "/static/media/generic-theme-1.mp3",
     *         "/static/media/generic-theme-1.ogg"
     *     ]
     * }
     * @type {Object}
     */
    static getAudioAssetPaths() {
        return ((context) => {
            const paths = context.keys();
            const values = paths.map(context) as Array<ObjectOfStrings>;
            // Add each class to the list by file name.
            return paths.reduce((list, path, index) => {
                const end = path.split('/').pop()!;
                // Trim the "mp3", "ogg", or "opus" from the end of the file name.
                let fileName = '';
                if (end.slice(end.length - 4) === '.mp3') {
                    fileName = end.slice(0, -4);
                }
                else if (end.slice(end.length - 4) === '.ogg') {
                    fileName = end.slice(0, -4);
                }
                else if (end.slice(end.length - 5) === '.opus') {
                    fileName = end.slice(0, -5);
                }
                else {
                    warning('Cannot load unsupported audio file format for file:', path);
                }
                // Need to use .default to get the resolved path for the file, or would need to actually import it.
                // Add both file types under the same file name. {"my-sound": ["../my-sound.mp3", "../my-sound.ogg"]}
                if (list[fileName]) {
                    list[fileName].push(values[index].default);
                }
                else {
                    list[fileName] = [ values[index].default ];
                }
                return list;
            }, {} as {[key: string]: Array<string>});
        })(require.context('../assets/audio/', true, /.mp3|.ogg|.opus$/));
    }
}

export default SoundManager;
