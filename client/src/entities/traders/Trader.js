import Container from "../Container";
import NPCShopTypes from "./../../catalogues/NPCShopTypes.json";

class Trader extends Container {
    constructor(x, y, config) {
        super(x, y, config);

        this.setScale(GAME_SCALE);
        this.entityId = config.id;
        this.npcShopType = NPCShopTypes.Arena;

        this.baseSprite = _this.add.sprite(0, 0, 'game-atlas', 'trader-basic-1');
        this.baseSprite.setOrigin(0.5);
        this.add(this.baseSprite);
        
        this.addDisplayName();

        this.baseSprite.setInteractive();

        this.baseSprite.on('pointerdown', this.onPointerDown, this);
        this.baseSprite.on('pointerover', this.onPointerOver, this);
        this.baseSprite.on('pointerout', this.onPointerOut, this);
    }

    static setupAnimations() {
        // this.baseSprite.animations.add('idle', ['trader-basic-1', 'trader-basic-2'], 2, true);
        // this.baseSprite.animations.play('idle');
    }

    onPointerDown() {
        // Check they are within trading range.
        const player = _this.player;
        const entity = _this.dynamics[this.entityId];
        const rowDist = Math.abs(player.row - entity.row);
        const colDist = Math.abs(player.col - entity.col);
        if ((rowDist + colDist) < 3) {
            _this.GUI.shopPanel.show(this.entityId, this.displayName.text, this.npcShopType);
        }
    };
}

export default Trader;