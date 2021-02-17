import ItemTypes from "../catalogues/ItemTypes.json";
import Utils from "../shared/Utils";

class Music {
    constructor(state) {
        this.sounds = {
            location: {
                generic1: state.sound.add("generic-theme-1"),
                generic2: state.sound.add("generic-theme-2"),
            },
        };

        this.currentBackgroundMusic = this.sounds.location.generic1;
    }

    changeBackgroundMusic(sound) {
        this.currentBackgroundMusic.stop();

        sound.play({
            loop: true,
        });

        this.currentBackgroundMusic = sound;

        // Fade playing the audio in.
        window.gameScene.tweens.add({
            targets: this.currentBackgroundMusic,
            volume: {
                getStart() {
                    return 0;
                },
                getEnd() {
                    return 1;
                },
            },
            duration: 2000,
            ease: "Linear",
        });
    }
}

class PlayerSounds {
    constructor(state) {
        this.sounds = {
            deathLoop: state.sound.add("death-loop"),
            footsteps: [
                state.sound.add("footstep-1"),
                state.sound.add("footstep-2"),
                state.sound.add("footstep-3"),
                state.sound.add("footstep-4"),
            ],
        };
    }

    playFootstep() {
        // Play a random footstep sound every time they move.
        Utils.getRandomElement(this.sounds.footsteps).play();
    }
}

class ItemSounds {
    constructor(state) {
        this.sounds = {
            dropped: {
                default: state.sound.add("item-dropped"),
            },
            equipped: {
                default: state.sound.add("weapon-equipped"),
                // Add what ever kinds of sounds you want a particular item to play when equipped.
                // Should also be defined in the server item config in ItemValues.yml.
                "Metal weapon": state.sound.add("weapon-equipped"),
                "Metal clothing": state.sound.add("clothing-equipped"),
                "Fabric clothing": state.sound.add("weapon-equipped"),
            },
            unequipped: { },
            used: {
                // Add what ever kinds of sounds you want a particular item to play when used.
                // Should also be defined in the server item config in ItemValues.yml.
                // "Food": // TODO: Add food consumed sound here
                // "Drink": // TODO: Add drink consumed sound here
            },
        };
    }

    playEquippedSound(itemTypeCode) {
        this.playSoundType(this.sounds.equipped, itemTypeCode);
    }

    playUnequippedSound(itemTypeCode) {
        this.playSoundType(this.sounds.unequipped, itemTypeCode);
    }

    playUsedSound(itemTypeCode) {
        this.playSoundType(this.sounds.used, itemTypeCode);
    }

    playDroppedSound(itemTypeCode) {
        this.playSoundType(this.sounds.dropped, itemTypeCode);
    }

    // eslint-disable-next-line class-methods-use-this
    playSoundType(scope, itemTypeCode) {
        const itemType = ItemTypes[itemTypeCode];

        // Play the specific sound for the sound type of this item if one is defined.
        if (itemType && itemType.soundType && scope[itemType.soundType]) {
            scope[itemType.soundType].play();
        }
        else if (scope.default) { // No specific sound set. Use the generic/default one, if it is set.
            scope.default.play();
        }
        // There is no specific or default sound. Don't play anything.
    }
}

/**
 * Any sounds added here need to use the file name of the audio file, as all audio assets are loaded dynamically and stored by their file name.
 * i.e. for the audio files "./my-sound.mp3" and "./my-sound.ogg", simply use `state.sound.add("my-sound")`.
 */
class SoundManager {
    constructor(state) {
        this.player = new PlayerSounds(state);
        this.items = new ItemSounds(state);
        this.music = new Music(state);

        // Generic/miscellaneous sounds can live on the top level manager.
        this.sounds = {
            dungeonKeyGained: state.sound.add("dungeon-key-gained"),
        };
    }

    /**
     * A list of all audio assets to be loaded.
     * Created using all of the webpack resolved audio file paths for the files found in /assets/audio,
     * to avoid having a huge list of imports than need constantly updating when new stuff is added.
     * This does NOT load the audio files directly, only gets what their paths would be when output to /build/static/media.
     * The Phaser boot state does the actual loading, using those paths.
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
            const values = paths.map(context);
            // Add each class to the list by file name.
            return paths.reduce((list, path, index) => {
                // Trim the ".mp3" or ".ogg" from the end of the file name.
                const fileName = path.split("/").pop().slice(0, -4);
                // Need to use .default to get the resolved path for the file, or would need to actually import it.
                // Add both file types under the same file name. {"my-sound": ["../my-sound.mp3", "../my-sound.ogg"]}
                if (list[fileName]) {
                    list[fileName].push(values[index].default);
                }
                else {
                    list[fileName] = [values[index].default];
                }
                return list;
            }, {});
        })(require.context("../assets/audio/", true, /.mp3|.ogg$/));
    }
}

export default SoundManager;
