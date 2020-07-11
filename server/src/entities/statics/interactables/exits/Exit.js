const Interactable = require('../Interactable');

class Exit extends Interactable {
    /**
     * @param {Object} config
     * @param {Number} config.row
     * @param {Number} config.col
     * @param {Board} config.board
     * @param {Board} config.targetBoard
     * @param {String} config.targetEntranceName
     */
    constructor(config) {
        super(config);

        /**
         * The board that this exit leads to.
         * @type {Board}
         */
        this.targetBoard = config.targetBoard;

        /**
         * The entrance bounds that any characters will be moved within.
         * @type {Entrance}
         */
        this.targetEntrance = config.targetEntranceName;

        // If the board that this exit links to already exists, then link to it.
        // Otherwise the link will be set up after all boards have been created.
        if (config.targetBoard.entrances !== undefined) {
            this.targetEntrance = config.targetBoard.entrances[config.targetEntranceName];
        }
    }

    /**
     * @param {Player} interactedBy - Only players can use exits (including dungeon portals).
     * @return {Boolean} Whether this entity was interacted with or not.
     */
    interaction(interactedBy) {
        if (interactedBy instanceof Player === false) return;

        // Reposition them to somewhere within the entrance bounds.
        let position = this.targetEntrance.getRandomPosition();

        // Move the character to the board that this exit leads to.
        interactedBy.changeBoard(this.board, this.targetBoard, position.row, position.col);
    }

}
module.exports = Exit;

const Player = require('../../../destroyables/movables/characters/Player');

Exit.prototype.registerEntityType();