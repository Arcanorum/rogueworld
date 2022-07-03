import { warning } from '@rogueworld/utils';
import Effects from './Effects';
import Music from './Music';

/**
 * Any sounds added here need to use the file name of the audio file, as all audio assets are
 * loaded dynamically and stored by their file name.
 * i.e. for the audio files "./my-sound.mp3" and "./my-sound.ogg", simply
 * use `scene.sound.add("my-sound")`.
 */
export default class SoundManager {
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
     * Created using all of the webpack resolved audio file paths for the files found
     * in /assets/audio,
     * to avoid having a huge list of imports than need constantly updating when new stuff is added.
     * This does NOT load the audio files directly, only gets what their paths would be when output
     * to /build/static/media.
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
            const values = paths.map(context) as Array<string>;
            // Add each class to the list by file name.
            return paths.reduce((list, path, index) => {
                const end = path.split('/').pop();
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
                // Add both file types under the same file name.
                // {"my-sound": ["../my-sound.mp3", "../my-sound.ogg"]}
                if (list[fileName]) {
                    list[fileName].push(values[index]);
                }
                else {
                    list[fileName] = [values[index]];
                }
                return list;
            }, {} as { [key: string]: Array<string> });
        })(require.context('../../assets/audio/', true, /.mp3|.ogg|.opus$/));
    }
}
