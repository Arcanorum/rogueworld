import Phaser from "phaser";
import gameConfig from "../../../shared/GameConfig";
import dungeonz from "../../../shared/Global";
import { GUIState, PlayerState } from "../../../shared/state/States";
import Utils from "../../../shared/Utils";
import Container from "../Container";

class Character extends Container {
    constructor(x, y, config) {
        super(x, y, config);

        this.setScale(gameConfig.GAME_SCALE);
        this.entityId = config.id;
        this.setDirection(config.direction);
        this.moveRate = config.moveRate;
        // Can be undefined or an object with an optional "fill" and "stroke"
        // property to be set as any color string value Phaser can take.
        // Used for differentiating clan members by name color.
        this.displayNameColor = config.displayNameColor;

        let frame;
        if (config.frameName) {
            frame = config.frameName;
        }
        else if (this.baseFrames[this.direction]) {
            frame = this.baseFrames[this.direction] || this.baseFrames.down;
        }
        this.baseSprite = dungeonz.gameScene.add.sprite(0, 0, "game-atlas", frame);
        // this.baseSprite.baseFrames = baseFrames;
        this.baseSprite.setFrame(frame);
        this.baseSprite.setOrigin(0.5);
        this.add(this.baseSprite);

        this.addDisplayName(config.displayName);

        this.energyRegenEffect = this.addEffect("energy-regen-effect-1");
        this.healthRegenEffect = this.addEffect("health-regen-effect-1");
        this.curedEffect = this.addEffect("cured-effect-1");
        this.coldResistanceEffect = this.addEffect("cold-resistance-effect-1");
        this.poisonEffect = this.addEffect("poison-effect-1");
        this.burnEffect = this.addEffect("burn-effect-1");
        this.chillEffect = this.addEffect("chill-effect-1");
        this.chillEffect.setAlpha(0.5);
        this.brokenBonesEffect = this.addEffect("broken-bones-effect-1");

        this.curseEffect = this.addEffect("curse-effect-1");
        this.curseEffect.x = -6;
        this.curseEffect.y = -10;
        this.curseEffect.setScale(0.8);

        this.enchantmentEffect = this.addEffect("enchantment-effect-1");
        this.enchantmentEffect.x = 6;
        this.enchantmentEffect.y = -10;
        this.enchantmentEffect.setScale(0.8);

        this.baseSprite.on("animationcomplete", this.moveAnimCompleted, this);

        this.baseSprite.setInteractive();

        this.baseSprite.on("pointerover", this.onPointerOver, this);
        this.baseSprite.on("pointerout", this.onPointerOut, this);

        this.baseSprite.on("destroy", this.onDestroy, this);
    }

    onDestroy() {
        // Squirt a lot of juice on death.
        dungeonz.gameScene.damageParticleEmitter.emitParticleAt(
            this.x,
            this.y,
            Phaser.Math.Between(15, 25),
        );

        const { dynamics } = dungeonz.gameScene;

        const playerDynamic = dynamics[PlayerState.entityID];
        const thisDynamic = dynamics[this.entityId];

        // Check they are both still in the dynamics list.
        if (playerDynamic && thisDynamic) {
            // If they are close enough to the player, play a death splat sound.
            if (Utils.tileDistanceBetween(
                dynamics[PlayerState.entityID], dynamics[this.entityId],
            ) <= 5) {
                dungeonz.gameScene.sound.play("sword-cutting-flesh", { volume: GUIState.effectsVolume / 100 });
            }
        }
    }

    setDirection(direction) {
        switch (direction) {
        case "u":
            this.direction = "up";
            break;
        case "d":
            this.direction = "down";
            break;
        case "l":
            this.direction = "left";
            break;
        default:
            this.direction = "right";
        }
    }

    addEffect(frameName) {
        const sprite = dungeonz.gameScene.add.sprite(0, 0, "game-atlas", frameName);
        sprite.setOrigin(0.5);
        sprite.visible = false;
        this.add(sprite);
        return sprite;
    }

    moveAnimCompleted() {
        this.baseSprite.setFrame(this.baseFrames[this.direction]);
    }

    /**
     * Should be called when the entity for this sprite moves.
     * Move can be a normal move (like a running), or from a manual reposition (teleport/map change).
     * @param {Boolean} playMoveAnim Whether the move animation should be played. Don't play on
     *      reposition as it looks weird when they teleport but still do a move animation.
     */
    onMove(playMoveAnim, moveAnimDuration) {
        // Don't bother is this is a looping animation. An animation should already been running.
        if (this.animationRepeats) return;

        if (playMoveAnim === true) {
            if (this.animationSetName) {
                if (!this.baseSprite.anims.isPlaying) {
                    this.baseSprite.play({
                        key: `${this.animationSetName}-${this.direction}`,
                        // An animation should play in full over 2 move steps, and also in full
                        // over just 1 (so it looks like a winddown).
                        // If the animation were to run in full for every move step, it would look
                        // very fast, so slow it down artificially so it appears more natural when
                        // played over a longer distance (i.e. over 2 tiles, instead of just 1).
                        // x2 the move duration (i.e. half the frame rate), and don't start a new
                        // animation for any incoming move events while this animation is still
                        // playing, so for the first step it plays the first half of the animation,
                        // but it will keep running, so when a second move event happens, the
                        // previous animation should still be running, on it's second half, thus
                        // completing the full move animation over 2 move steps.
                        // x2 might be too precice, so use 1.9 to give some margin for timing
                        // weirdness like lag, low FPS, etc.
                        duration: moveAnimDuration * 1.9 || 4000,
                        frameRate: null, // Need to provide this or the duration won't take effect. Phaser 3.55.2 bug.
                    });
                }
            }
        }
    }

    onChangeDirection() {
        // Keep playing if the animation loops.
        if (this.animationRepeats) {
            this.baseSprite.anims.play(`${this.animationSetName}-${this.direction}`, true);
        }
        else {
            this.baseSprite.anims.stop();
        }
    }

    static setupAnimations() {
        function createTwoFrameAnim(key) {
            dungeonz.gameScene.anims.create({
                key,
                defaultTextureKey: "game-atlas",
                frames: [
                    { frame: `${key}-effect-1` },
                    { frame: `${key}-effect-2` },
                ],
                frameRate: 2,
                repeat: -1,
                showOnStart: true,
            });
        }

        createTwoFrameAnim("health-regen");
        createTwoFrameAnim("energy-regen");
        createTwoFrameAnim("cured");
        createTwoFrameAnim("cold-resistance");
        createTwoFrameAnim("poison");
        createTwoFrameAnim("burn");
        createTwoFrameAnim("chill");
        createTwoFrameAnim("broken-bones");
        createTwoFrameAnim("curse");
        createTwoFrameAnim("enchantment");
    }

    /**
     * Adds a set of animations to the animation manager, one for each direction for this entity.
     * i.e. for a set name of "knight", animations called "knight-up", "knight-left", and so on, would be created.
     * Uses the 1-2-1-3 pattern for frame sequence.
     */
    static addAnimationSet() {
        const setName = this.prototype.animationSetName;
        const frameSequence = this.prototype.animationFrameSequence;
        const repeats = this.prototype.animationRepeats;
        const duration = this.prototype.animationDuration;
        const defaultTextureKey = "game-atlas";
        const directions = ["up", "down", "left", "right"];
        const generateFrames = (direction) => {
            const frames = [];
            frameSequence.forEach((frameNumber) => {
                frames.push({ frame: `${setName}-${direction}-${frameNumber}` });
            });
            return frames;
        };

        if (!setName) {
            // Skip the Character class itself. It has no animation set of it's own to add.
            if (setName !== null) {
                Utils.warning("Adding animation set. Missing set name on class prototype somewhere. Skipping.");
            }
            return;
        }

        directions.forEach((direction) => {
            dungeonz.gameScene.anims.create({
                // i.e. "knight-up"
                key: `${setName}-${direction}`,
                defaultTextureKey,
                frames: generateFrames(direction),
                duration,
                repeat: repeats ? -1 : undefined,
            });
        });

        // Give them some default base frames, for when they are just standing still.
        this.prototype.baseFrames = {
            up: `${setName}-up-1`,
            down: `${setName}-down-1`,
            left: `${setName}-left-1`,
            right: `${setName}-right-1`,
        };
    }
}

/** @type {String} Frames of the animation set to use when this character is idle. */
Character.prototype.baseFrames = {};
/** @type {String} The base name of this set of animations. */
Character.prototype.animationSetName = null;
/** @type {Array.<Number>} The numbers of the frames to play, and the order to play them in. */
Character.prototype.animationFrameSequence = [1, 2, 1, 3];
/** @type {Boolean} Whether the animation should loop. i.e. for things that always look moving, such as bats. */
Character.prototype.animationRepeats = false;
/** @type {Number} How long the animation should last, in ms. */
Character.prototype.animationDuration = 500;

export default Character;
