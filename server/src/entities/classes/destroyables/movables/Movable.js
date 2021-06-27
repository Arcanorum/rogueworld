const { Directions, rowColOffsetToDirection } = require("../../../../gameplay/Directions");
const Destroyable = require("../Destroyable");

class Movable extends Destroyable {
    /**
     * Moves this entity along the board relative to its current position. To directly change the position of an entity, use Entity.reposition.
     * @param {Number} byRows - How many rows to move along by. +1 to move down, -1 to move up.
     * @param {Number} byCols - How many cols to move along by. +1 to move right, -1 to move left.
     */
    move(byRows, byCols) {
        const origRow = this.row;
        const origCol = this.col;

        // Only let an entity move along a row OR a col, not both at the same time or they can move diagonally through things.
        if (byRows) this.reposition(this.row + byRows, this.col);
        else if (byCols) this.reposition(this.row, this.col + byCols);

        // Tell the players in this zone that this dynamic has moved.
        this.board.emitToNearbyPlayers(
            origRow,
            origCol,
            this.EventsList.moved,
            {
                id: this.id,
                row: this.row,
                col: this.col,
                moveRate: this.getMoveRate(),
            },
        );

        // Only the players that can already see this dynamic will move it, but for ones that this has just come in range of, they will
        // need to be told to add this entity, so tell any players at the edge of the view range in the direction this entity moved.
        this.board.emitToPlayersAtViewRange(
            this.row,
            this.col,
            rowColOffsetToDirection(byRows, byCols),
            this.EventsList.add_entity,
            this.getEmittableProperties({}),
        );
        // Thought about making a similar, but separate, function to emitToPlayersAtViewRange that only calls getEmittableProperties
        // if any other players have been found, as the current way calls it for every move, even if there is nobody else seeing it,
        // but it doesn't seem like it would make much difference, as it would still need to get the props for every tile that another
        // player is found on, instead of just once and use it if needed.

        this.postMove();
    }

    /**
     * Can be overridden in a subclass to run any extra functionality after this entity has successfully moved.
     */
    postMove() { }

    /**
     * Changes the position of this entity on the board it is on.
     * @param {Number} toRow - The board grid row to reposition the entity to.
     * @param {Number} toCol - The board grid col to reposition the entity to.
     */
    reposition(toRow, toCol) {
        // Remove this entity from the tile it currently occupies on the board.
        this.board.removeDestroyable(this);

        this.row = toRow;
        this.col = toCol;

        // Add the entity to the tile it is now over on the board.
        this.board.addDestroyable(this);
    }

    /**
     * Changes the position of this entity on the board it is on.
     * Also emits the movement to players that could already see
     * it, and tells all players around the target position to
     * add this entity, in case they couldn't already see it.
     * @param {Number} toRow - The board grid row to reposition the entity to.
     * @param {Number} toCol - The board grid col to reposition the entity to.
     */
    repositionAndEmitToNearbyPlayers(toRow, toCol) {
        // Tell the players in this zone that this dynamic has moved.
        this.board.emitToNearbyPlayers(
            this.row,
            this.col,
            this.EventsList.moved,
            { id: this.id, row: toRow, col: toCol },
        );

        // Do the movement.
        this.reposition(toRow, toCol);

        // Only the players that can already see this dynamic will move it, but for ones that this has just
        // come in range of, they will need to be told to add this entity, so tell any nearby players.
        this.board.emitToNearbyPlayers(
            this.row,
            this.col,
            this.EventsList.add_entity,
            this.getEmittableProperties({}),
        );
    }

    /**
     * Move this entity from the current board to another one.
     * @param {Board} fromBoard - The board the entity is being moved from.
     * @param {Board} toBoard - The board to move the entity to.
     * @param {Number} toRow - The board grid row to reposition the entity to.
     * @param {Number} toCol - The board grid col to reposition the entity to.
     */
    changeBoard(fromBoard, toBoard, toRow, toCol) {
        // Need to check if there is a board, as the board will be nulled if the entity dies, but might be revivable (i.e. players).
        if (fromBoard) {
            // Tell players around this entity on the previous board to remove it.
            fromBoard.emitToNearbyPlayers(
                this.row,
                this.col,
                this.EventsList.remove_entity,
                this.id,
            );

            // Remove this entity from the board it is currently in before adding to the next board.
            // Don't use Movable.reposition as that would only move it around on the same board, not between boards.
            fromBoard.removeDestroyable(this);
        }

        this.board = toBoard;
        this.row = toRow;
        this.col = toCol;

        this.board.addDestroyable(this);

        // Tell players around this entity on the new board to add it.
        this.board.emitToNearbyPlayers(
            this.row,
            this.col,
            this.EventsList.add_entity,
            this.getEmittableProperties({}),
        );
    }

    /**
     * Sets this entity's direction, and tells nearby players.
     * @param {String} direction
     */
    modDirection(direction) {
        this.direction = direction;
        this.board.emitToNearbyPlayers(
            this.row,
            this.col,
            this.EventsList.change_direction,
            { id: this.id, direction: this.direction },
        );
    }

    /**
     * Returns the effective move rate of this entity.
     * i.e. apply environmental effects that slow down, enchantments that speed up.
     * Can be overridden to apply move rate modifiers within different subclasses.
     * If overridden, should still be chained from the overrider up to this.
     * @param {number} [chainedMoveRate] If this method has been overridden, a value can be passed
     *      in here for what the value so far is.
     * @returns {number} The effective move rate.
     */
    getMoveRate(chainedMoveRate) {
        if (chainedMoveRate) return chainedMoveRate;

        return this.moveRate;
    }
}

Movable.abstract = true;

Movable.prototype.direction = Directions.DOWN;

/**
 * How often this entity moves, in ms.
 * @type {Number}
 */
Movable.prototype.moveRate = 1000;

module.exports = Movable;
