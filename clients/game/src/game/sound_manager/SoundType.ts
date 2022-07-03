interface HTML5AudioSound extends Phaser.Sound.HTML5AudioSound {
    fadeTween?: Phaser.Tweens.Tween;
}

interface WebAudioSound extends Phaser.Sound.WebAudioSound {
    fadeTween?: Phaser.Tweens.Tween;
}

type SoundType = (
    HTML5AudioSound |
    WebAudioSound
);

export default SoundType;
