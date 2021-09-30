const EntitiesList = require("../entities/EntitiesList");

const explosion = ({
    range, row, col, board, source,
}) => {
    const diameter = (range * 2) + 1;
    const ignoredTile = 0;

    // Set up the grid.
    const blastGrid = [];
    for (let rowIndex = 0; rowIndex < diameter; rowIndex += 1) {
        const newRow = [];
        newRow.length = diameter;
        newRow.fill(ignoredTile);
        blastGrid[rowIndex] = newRow;
    }

    const blast = (targetRow, targetCol, force) => {
        const gridRow = targetRow - row + range;
        const gridCol = targetCol - col + range;
        const target = blastGrid[gridRow][gridCol];
        const boardTile = board.getTileAt(targetRow, targetCol);

        // Check the tile is valid.
        if (!boardTile) return;

        // Don't blast on blocked tiles.
        if (boardTile.isHighBlocked()) return;

        if (!target) {
            blastGrid[gridRow][gridCol] = force;
        }
        else if (force > target) {
            blastGrid[gridRow][gridCol] = force;
        }

        // Blast the adjacent tiles.
        if (force > 0) {
            const nextForce = force - 1;
            blast(targetRow - 1, targetCol, nextForce);
            blast(targetRow + 1, targetCol, nextForce);
            blast(targetRow, targetCol - 1, nextForce);
            blast(targetRow, targetCol + 1, nextForce);
        }
    };

    // Start the chain reaction.
    blast(row, col, range);

    // Got the map of where to do the blast effect at. Now use it to do the blast.
    blastGrid.forEach((eachRow, rowIndex) => {
        eachRow.forEach((eachCol, colIndex) => {
            if (eachCol === ignoredTile) return;

            // Do the effect.
            new EntitiesList.FireBlast({
                row: row + rowIndex - range,
                col: col + colIndex - range,
                board,
                lifespan: 600,
                source,
            }).emitToNearbyPlayers();
        });
    });
};

module.exports = explosion;
