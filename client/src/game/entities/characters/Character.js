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
        if (this.baseFrames) {
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
        this.poisonEffect = this.addEffect("poison-effect-1");
        this.burnEffect = this.addEffect("burn-effect-1");

        this.curseIcon = dungeonz.gameScene.add.sprite(-6, -10, "game-atlas", "curse-icon");
        this.curseIcon.setOrigin(0.5);
        this.add(this.curseIcon);
        this.curseIcon.visible = false;

        this.enchantmentIcon = dungeonz.gameScene.add.sprite(6, -10, "game-atlas", "enchantment-icon");
        this.enchantmentIcon.setOrigin(0.5);
        this.add(this.enchantmentIcon);
        this.enchantmentIcon.visible = false;

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
    onMove(playMoveAnim) {
        if (playMoveAnim === true) {
            if (this.animationSetName) {
                this.baseSprite.anims.play(`${this.animationSetName}-${this.direction}`, true);
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
        dungeonz.gameScene.anims.create({
            key: "energy-regen",
            defaultTextureKey: "game-atlas",
            frames: [
                { frame: "energy-regen-effect-1" },
                { frame: "energy-regen-effect-2" },
            ],
            frameRate: 2,
            repeat: -1,
            showOnStart: true,
        });

        dungeonz.gameScene.anims.create({
            key: "health-regen",
            defaultTextureKey: "game-atlas",
            frames: [
                { frame: "health-regen-effect-1" },
                { frame: "health-regen-effect-2" },
            ],
            frameRate: 2,
            repeat: -1,
            showOnStart: true,
        });

        dungeonz.gameScene.anims.create({
            key: "cured",
            defaultTextureKey: "game-atlas",
            frames: [
                { frame: "cured-effect-1" },
                { frame: "cured-effect-2" },
            ],
            frameRate: 2,
            repeat: -1,
            showOnStart: true,
        });

        dungeonz.gameScene.anims.create({
            key: "poison",
            defaultTextureKey: "game-atlas",
            frames: [
                { frame: "poison-effect-1" },
                { frame: "poison-effect-2" },
            ],
            frameRate: 2,
            repeat: -1,
            showOnStart: true,
        });

        dungeonz.gameScene.anims.create({
            key: "burn",
            defaultTextureKey: "game-atlas",
            frames: [
                { frame: "burn-effect-1" },
                { frame: "burn-effect-2" },
            ],
            frameRate: 2,
            repeat: -1,
            showOnStart: true,
        });
    }

    /**
     * Adds a set of animations to the animation manager, one for each direction for this entity.
     * i.e. for a set name of "knight", animations called "knight-up", "knight-left", and so on, would be created.
     * Uses the 1-2-1-3 pattern for frame sequence.
     * @param {Object} config
     * @param {String} config.setName - The base name of this set of animations
     * @param {Number} [config.duration=500] - How long it should last, in ms.
     */
    static addAnimationSet() {
        const
            setName = this.prototype.animationSetName;
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

Character.prototype.baseFrames = {
};
Character.prototype.animationSetName = null;
Character.prototype.animationFrameSequence = [1, 2, 1, 3];
Character.prototype.animationRepeats = false;
Character.prototype.animationDuration = 500;

export default Character;
