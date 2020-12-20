import ItemTypes from "./catalogues/ItemTypes";
import Utils from "./Utils";

class Music {
    constructor(state) {
        this.sounds = {
            location: {
                generic1: state.sound.add("generic-theme-1"),
                generic2: state.sound.add("generic-theme-2"),
            }
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
        _this.tweens.add({
            targets: this.currentBackgroundMusic,
            volume: {
                getStart: function () {
                    return 0;
                },
                getEnd: function () {
                    return 1;
                }
            },
            duration: 2000,
            ease: "Linear",
        });
    }
}

class PlayerSounds {
    constructor (state) {
        this.sounds = {
            deathLoop: state.sound.add("player-death-loop"),
            footsteps: [
                state.sound.add("footstep-1"),
                state.sound.add("footstep-2"),
                state.sound.add("footstep-3"),
                state.sound.add("footstep-4"),
            ],
        }
    }

    playFootstep () {
        // Play a random footstep sound every time they move.
        Utils.getRandomElement(this.sounds.footsteps).play();
    }
}

class ItemSounds {
    constructor(state) {
        this.sounds = {
            dropped: {
                default: state.sound.add("item-dropped")
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
            }
        }
    }

    playEquippedSound(itemTypeNumber) {
        this.playSoundType(this.sounds.equipped, itemTypeNumber);
    }

    playUnequippedSound(itemTypeNumber) {
        this.playSoundType(this.sounds.unequipped, itemTypeNumber);
    }

    playUsedSound(itemTypeNumber) {
        this.playSoundType(this.sounds.used, itemTypeNumber);
    }

    playDroppedSound(itemTypeNumber) {
        this.playSoundType(this.sounds.dropped, itemTypeNumber);
    }

    playSoundType (scope, itemTypeNumber) {
        const itemType = ItemTypes[itemTypeNumber];

        // Play the specific sound for the sound type of this item if one is defined.
        if (itemType && itemType.soundType && scope[itemType.soundType]) {
            scope[itemType.soundType].play();
        }
        // No specific sound set. Use the generic/default one, if it is set.
        else if(scope.default) {
            scope.default.play();
        }
        // There is no specific or default sound. Don't play anything.
    }
}

class SoundManager {
    constructor (state) {
        this.player = new PlayerSounds(state);
        this.items = new ItemSounds(state);
        this.music = new Music(state);

        // Generic/miscellaneous sounds can live on the top level manager.
        this.sounds = {
            dungeonKeyGained: state.sound.add("dungeon-key-gained"),
        };
    }
}

export default SoundManager;