const Boss = require("./Boss");
const EntitiesList = require("../../../../../EntitiesList");
const Projectile = require("../../projectiles/Projectile");
const MagicEffects = require("../../../../../../gameplay/MagicEffects");
const Heal = require("../../../../../../gameplay/Heal");
const { rowColOffsetToDirection, Directions } = require("../../../../../../gameplay/Directions");

const specAttack1Rate = 5000;
const specAttack2Rate = 10000;
const specAttack3Rate = 3000;

class ArchMage extends Boss {
    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     */
    constructor(config) {
        super(config);

        this.specialAttack1Timeout = setInterval(this.specialAttack1.bind(this), specAttack1Rate);
        this.specialAttack2Timeout = setInterval(this.specialAttack2.bind(this), specAttack2Rate);
        this.specialAttack3Timeout = setInterval(this.specialAttack3.bind(this), specAttack3Rate);
    }

    onDestroy() {
        clearTimeout(this.specialAttack1Timeout);
        clearTimeout(this.specialAttack2Timeout);
        clearTimeout(this.specialAttack3Timeout);

        super.onDestroy();
    }

    /**
     * Shoot Pacify.
     */
    specialAttack1() {
        // Don't bother if no target.
        if (this.target !== null) {
            // Check the target is alive.
            if (this.target.hitPoints < 1) {
                this.target = null;
                return;
            }

            const targetDirection = rowColOffsetToDirection(
                this.target.row - this.row, this.target.col - this.col,
            );

            // Shoot a pacify projectile at the target.
            new EntitiesList.ProjPacify({
                row: this.row,
                col: this.col,
                board: this.board,
                direction: targetDirection,
                source: this,
            }).emitToNearbyPlayers();
        }
    }

    /**
     * Ward and heal self.
     */
    specialAttack2() {
        // Heal if damaged.
        if (this.hitPoints < this.maxHitPoints) {
            this.heal(
                new Heal(20),
            );
        }

        // Cast ward on self.
        new MagicEffects.Ward({ character: this });
    }

    /**
     * Check for projectiles to reflect.
     */
    specialAttack3() {
        const
            { board } = this;
        const checkRange = 5;
        const checkRangePlusOne = checkRange + 1;
        let tile;

        // Up and down.
        for (let i = -checkRange; i < checkRangePlusOne; i += 1) {
            tile = board.getTileAt(this.row + i, this.col);
            // eslint-disable-next-line no-continue
            if (!tile) continue;

            const { destroyables } = tile;

            // eslint-disable-next-line no-restricted-syntax
            for (const key in destroyables) {
                if (destroyables[key] instanceof Projectile) {
                    // Ignore own projectiles.
                    // eslint-disable-next-line no-continue
                    if (destroyables[key].source === this) continue;
                    // Up.
                    if (i < 0) {
                        new EntitiesList.ProjWind({
                            row: this.row,
                            col: this.col,
                            board: this.board,
                            direction: Directions.UP,
                            source: this,
                        }).emitToNearbyPlayers();
                    }
                    // Down.
                    else if (i > 0) {
                        new EntitiesList.ProjWind({
                            row: this.row,
                            col: this.col,
                            board: this.board,
                            direction: Directions.DOWN,
                            source: this,
                        }).emitToNearbyPlayers();
                    }
                }
            }
        }

        // Left and right.
        for (let i = -checkRange; i < checkRangePlusOne; i += 1) {
            tile = board.getTileAt(this.row, this.col + i);
            // eslint-disable-next-line no-continue
            if (!tile) continue;

            const { destroyables } = tile;

            // eslint-disable-next-line no-restricted-syntax
            for (const key in destroyables) {
                if (destroyables[key] instanceof Projectile) {
                    // Left.
                    if (i < 0) {
                        new EntitiesList.ProjWind({
                            row: this.row,
                            col: this.col,
                            board: this.board,
                            direction: Directions.LEFT,
                            source: this,
                        }).emitToNearbyPlayers();
                    }
                    // Right.
                    else if (i > 0) {
                        new EntitiesList.ProjWind({
                            row: this.row,
                            col: this.col,
                            board: this.board,
                            direction: Directions.RIGHT,
                            source: this,
                        }).emitToNearbyPlayers();
                    }
                }
            }
        }
    }
}
module.exports = ArchMage;
