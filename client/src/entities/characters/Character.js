import Container from "../Container";

class Character extends Container {
    constructor (x, y, config) {
        super(x, y, config);

        this.setScale(GAME_SCALE);
        this.entityId = config.id;
        this.setDirection(config.direction);
        this.moveRate = config.moveRate;
        // Can be undefined or an object with an optional 'fill' and 'stroke'
        // property to be set as any color string value Phaser can take.
        // Used for differentiating clan members by name color.
        this.displayNameColor = config.displayNameColor;
        let frame = undefined;
        if (this.baseFrames !== undefined) {
            frame = this.baseFrames[this.direction] || this.baseFrames.d;
        }
        this.baseSprite = _this.add.sprite(0, 0, "game-atlas", frame);
        //this.baseSprite.baseFrames = baseFrames;
        this.baseSprite.setFrame(frame);
        this.baseSprite.setOrigin(0.5);
        this.add(this.baseSprite);

        this.addDisplayName(config.displayName);

        this.energyRegenEffect = this.addEffect("energy-regen-effect-1");
        this.healthRegenEffect = this.addEffect("health-regen-effect-1");
        this.curedEffect = this.addEffect("cured-effect-1");
        this.poisonEffect = this.addEffect("poison-effect-1");
        this.burnEffect = this.addEffect("burn-effect-1");

        this.curseIcon = _this.add.sprite(dungeonz.TILE_SIZE / 2 - 6, -6, 'game-atlas', 'curse-icon');
        this.curseIcon.setOrigin(0.5);
        this.add(this.curseIcon);
        this.curseIcon.visible = false;

        this.enchantmentIcon = _this.add.sprite(dungeonz.TILE_SIZE / 2 + 6, -6, 'game-atlas', 'enchantment-icon');
        this.enchantmentIcon.setOrigin(0.5);
        this.add(this.enchantmentIcon);
        this.enchantmentIcon.visible = false;

        this.addDamageMarker();

        this.baseSprite.on("animationcomplete", () => {
            this.baseSprite.setFrame(this.baseFrames[this.direction]);
        });

        this.baseSprite.setInteractive();

        this.baseSprite.on('pointerover', this.onPointerOver, this);
        this.baseSprite.on('pointerout', this.onPointerOut, this);
    };

    setDirection(direction){
        switch(direction){
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
        const sprite = _this.add.sprite(dungeonz.TILE_SIZE / 2, dungeonz.TILE_SIZE / 2, "game-atlas", frameName);
        sprite.setOrigin(0.5);
        sprite.visible = false;
        this.add(sprite);
        return sprite;
    }

    moveAnimCompleted() {
        this.baseSprite.setFrame(this.baseFrames[this.direction]);
    };

    /**
     * Should be called when the entity for this sprite moves.
     * Move can be a normal move (like a running), or from a manual reposition (teleport/map change).
     * @param {Boolean} playMoveAnim Whether the move animation should be played. Don't play on 
     *      reposition as it looks weird when they teleport but still do a move animation.
     */
    onMove(playMoveAnim) {
        if (playMoveAnim === true) {
            // if (this.baseSprite.anims.isPlaying === false) {
                if(this.constructor.animationBaseName){
                    this.baseSprite.anims.play(this.constructor.animationBaseName + "-" + this.direction, true);
                }
            // }
        }
    };

    onChangeDirection() {
        this.baseSprite.anims.stop();
    };

    static setupAnimations() {

        _this.anims.create({
            key: "energy-regen",
            frames: ['energy-regen-effect-1', 'energy-regen-effect-2'],
            frameRate: 2,
            showOnStart: true,
            hideOnComplete: true
        });

        _this.anims.create({
            key: "health-regen",
            frames: ['health-regen-effect-1', 'health-regen-effect-2'],
            frameRate: 2,
            showOnStart: true,
            hideOnComplete: true
        });

        _this.anims.create({
            key: "cured",
            frames: ['cured-effect-1', 'cured-effect-2'],
            frameRate: 2,
            showOnStart: true,
            hideOnComplete: true
        });

        _this.anims.create({
            key: "poison",
            frames: ['poison-effect-1', 'poison-effect-2'],
            frameRate: 2,
            showOnStart: true,
            hideOnComplete: true
        });

        _this.anims.create({
            key: "burn",
            frames: ['burn-effect-1', 'burn-effect-2'],
            frameRate: 2,
            showOnStart: true,
            hideOnComplete: true
        });

    }

    static addAnimationSet() {
        
    }
}

export default Character;