const Item = require("./Item");

class Bomb extends Item {
    checkUseCriteria() {
        const boardTile = this.owner.getBoardTile();

        // Check the tile is something that the bomb can be placed on.
        if (boardTile.static || !boardTile.groundType.canBeStoodOn) return false;

        // Only allow one bomb per tile, so they can't be stacked for insta-kills.
        const alreadyHasBomb = Object
            .values(boardTile.destroyables)
            .some((destroyable) => destroyable instanceof this.EntitiesList.Bomb);

        if (alreadyHasBomb) return false;

        return super.checkUseCriteria();
    }

    onUsed() {
        new this.EntitiesList.Bomb({
            row: this.owner.row,
            col: this.owner.col,
            board: this.owner.board,
            lifespan: 2000,
            source: this.owner,
        }).emitToNearbyPlayers();

        super.onUsed();
    }
}

module.exports = Bomb;
