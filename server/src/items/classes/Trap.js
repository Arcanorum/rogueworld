const Item = require("./Item");
const EntitiesList = require("../../entities/EntitiesList");

class Trap extends Item {
    checkUseCriteria() {
        const boardTile = this.owner.getBoardTile();

        // Check the tile is something that the trap can be placed on.
        if (boardTile.static || !boardTile.groundType.canBeStoodOn) return false;

        // Only allow one trap per tile, so they can't be stacked for insta-kills.
        const alreadyHasTrap = Object
            .values(boardTile.destroyables)
            .some((destroyable) => destroyable instanceof EntitiesList.Trap);

        if (alreadyHasTrap) return false;

        return super.checkUseCriteria();
    }

    onUsed() {
        new EntitiesList.Trap({
            row: this.owner.row,
            col: this.owner.col,
            board: this.owner.board,
            lifespan: 60000 * 2, // 2 mins.
        }).emitToNearbyPlayers();

        super.onUsed();
    }
}

module.exports = Trap;
