import ItemTypes from "../catalogues/ItemTypes.json";
import dungeonz from "../shared/Global";
import { GUIState } from "../shared/state/States";
import Utils from "../shared/Utils";

class Music {
    constructor(state) {
        this.list = [];

        this.sounds = {
            deathLoop: this.addSound(state.sound.add("death-loop")),
            // Themes.
            "exploration-theme": this.addSound(state.sound.add("exploration-theme")),
            "city-theme": this.addSound(state.sound.add("city-theme")),
            "blood-halls-theme": this.addSound(state.sound.add("blood-halls-theme")),
            "desert-overworld-theme": this.addSound(state.sound.add("desert-overworld-theme")),
            "forest-maze-theme": this.addSound(state.sound.add("forest-maze-theme")),
            generic2: this.addSound(state.sound.add("generic-theme-2")),
        };

        this.currentBackgroundMusic = this.sounds.generic2;

        this.updateVolume();
    }

    addSound(sound) {
        this.list.push(sound);
        return sound;
    }

    updateVolume() {
        this.list.forEach((sound) => {
            sound.setVolume(GUIState.musicVolume / 100);
        });
    }

    changeBackgroundMusic(sound) {
        const fromMusic = this.currentBackgroundMusic;

        // Fade out the current audio.
        dungeonz.gameScene.tweens.add({
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
            ease: "Linear",
            onComplete: () => {
                fromMusic.stop();
            },
        });

        sound.play({
            loop: true,
        });

        this.currentBackgroundMusic = sound;

        // Fade playing the audio in.
        dungeonz.gameScene.tweens.add({
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
            ease: "Linear",
        });
    }
}

class Effects {
    constructor(state) {
        this.list = [];

        this.sounds = {
            guiTick: this.addSound(state.sound.add("generic-gui-tick")),
            footsteps: [
                this.addSound(state.sound.add("footstep-1")),
                this.addSound(state.sound.add("footstep-2")),
                this.addSound(state.sound.add("footstep-3")),
                this.addSound(state.sound.add("footstep-4")),
            ],
            punch: this.addSound(state.sound.add("punch-1")),
            dungeonKeyGained: this.addSound(state.sound.add("dungeon-key-gained")),
            dropped: {
                default: this.addSound(state.sound.add("item-dropped")),
            },
            equipped: {
                default: this.addSound(state.sound.add("weapon-equipped")),
                // Add what ever kinds of sounds you want a particular item to play when equipped.
                // Should also be defined in the server item config in Items.yml.
                "Metal weapon": this.addSound(state.sound.add("weapon-equipped")),
                "Metal clothing": this.addSound(state.sound.add("clothing-equipped")),
                "Fabric clothing": this.addSound(state.sound.add("clothing-equipped")),
            },
            unequipped: { },
            used: {
                // Add what ever kinds of sounds you want a particular item to play when used.
                // Should also be defined in the server item config in Items.yml.
                Scroll: this.addSound(state.sound.add("fast-magic-spell")),
                // "Food": // TODO: Add food consumed sound here
                Drink: this.addSound(state.sound.add("magical-potion-drink")),
                Bow: [
                    this.addSound(state.sound.add("arrow-shot-1")),
                    this.addSound(state.sound.add("arrow-shot-2")),
                ],
            },
        };

        this.updateVolume();
    }

    addSound(sound) {
        this.list.push(sound);
        return sound;
    }

    updateVolume() {
        this.list.forEach((sound) => {
            sound.setVolume(GUIState.effectsVolume / 100);
        });
    }

    playGUITick() {
        dungeonz.gameScene.sound.play("generic-gui-tick", { volume: GUIState.effectsVolume / 100 });
    }

    playFootstep() {
        // Play a random footstep sound every time they move.
        Utils.getRandomElement(this.sounds.footsteps).play();
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
            // Play a random sound from the list if there are multiple.
            if (Array.isArray(scope[itemType.soundType])) {
                Utils.getRandomElement(scope[itemType.soundType]).play();
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
 * i.e. for the audio files "./my-sound.mp3" and "./my-sound.ogg", simply use `state.sound.add("my-sound")`.
 */
class SoundManager {
    constructor(state) {
        // this.player = new PlayerSounds(state);
        // this.items = new ItemSounds(state);
        this.music = new Music(state);
        this.effects = new Effects(state);
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
                const end = path.split("/").pop();
                // Trim the "mp3", "ogg", or "opus" from the end of the file name.
                let fileName = "";
                if (end.slice(end.length - 4) === ".mp3") {
                    fileName = end.slice(0, -4);
                }
                else if (end.slice(end.length - 4) === ".ogg") {
                    fileName = end.slice(0, -4);
                }
                else if (end.slice(end.length - 5) === ".opus") {
                    fileName = end.slice(0, -5);
                }
                else {
                    Utils.warning("Cannot load unsupported audio file format for file:", path);
                }
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
        })(require.context("../assets/audio/", true, /.mp3|.ogg|.opus$/));
    }
}

export default SoundManager;
