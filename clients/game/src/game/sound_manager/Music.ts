import Global from '../../shared/Global';
import { GUIState } from '../../shared/state';
import SoundType from './SoundType';

export default class Music {
    list: Array<SoundType>;

    sounds: { [key: string]: SoundType };

    currentBackgroundMusic: SoundType;

    constructor(scene: Phaser.Scene) {
        this.list = [];

        this.sounds = {
            deathLoop: this.addSound(scene.sound.add('death-loop') as SoundType),
            // Themes.
            'exploration-theme': this.addSound(scene.sound.add('exploration-theme') as SoundType),
        };

        this.currentBackgroundMusic = this.sounds['exploration-theme'];

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

    startMusic(sound: SoundType) {
        this.currentBackgroundMusic = sound;

        this.currentBackgroundMusic.fadeTween?.stop();

        sound.play({
            loop: true,
        });

        // Fade playing the audio in.
        this.currentBackgroundMusic.fadeTween = Global.gameScene.tweens.add({
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

    changeBackgroundMusic(sound: SoundType) {
        // Don't bother if it is already playing.
        if (sound === this.currentBackgroundMusic) return;

        const fromMusic = this.currentBackgroundMusic;

        fromMusic.fadeTween?.stop();

        // Fade out the current audio.
        fromMusic.fadeTween = Global.gameScene.tweens.add({
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

        this.startMusic(sound);
    }
}
