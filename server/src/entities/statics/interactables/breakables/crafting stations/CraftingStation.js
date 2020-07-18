const Interactable = require('../../Interactable');

class CraftingStation extends Interactable {

    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     * @param {Number} [config.activeState = true] - Whether this entity is already active when created.
     */
    constructor(config) {
        super(config);
    }

}
module.exports = CraftingStation;