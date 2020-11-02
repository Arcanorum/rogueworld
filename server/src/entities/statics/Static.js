const Entity = require("../Entity");
const Utils = require("../../Utils");

class Static extends Entity {
    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     */
    constructor(config) {
        super(config);

        config.board.addStatic(this);

        // If a tile is high blocked, then it must also be low blocked.
        if (this._highBlocked === true) {
            this._lowBlocked = true;
        }

        if (this._lowBlocked !== true && this._lowBlocked !== false) Utils.error("Low blocked is not boolean in Static.constructor:", this._lowBlocked);
        if (this._highBlocked !== true && this._highBlocked !== false) Utils.error("High blocked is not boolean in Static.constructor:", this._highBlocked);

        /** @type {Boolean} Whether this entity is currently blocking the low/high of this tile. */
        this.blocking = true;
    }

    onDestroy() {
        this.board.removeStatic(this);

        super.onDestroy();
    }

    /**
     * Whether this static currently low blocking the tile it is on.
     * @returns {Boolean}
     */
    isLowBlocked() {
        if (this.blocking === false) return false;
        return this._lowBlocked;
    }

    /**
     * Whether this static currently high blocking the tile it is on.
     * @returns {Boolean}
     */
    isHighBlocked() {
        if (this.blocking === false) return false;
        return this._highBlocked;
    }

}

/**
 * Whether this board tile can be walked over. Will it block characters.
 * If a tile is high blocked, then it must also be low blocked.
 * @type {Boolean}
 */
Static.prototype._lowBlocked = true;

/**
 * Whether this board tile can be shot over. Will it block projectiles and characters.
 * @type {Boolean}
 */
Static.prototype._highBlocked = true;

module.exports = Static;