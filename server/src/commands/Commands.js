const EntitiesList = require("../entities/EntitiesList");
const ItemsList = require("../items/ItemsList");
const ItemConfig = require("../inventory/ItemConfig");

class Command {
    constructor(run, help) {
        this.run = run;
        this.help = help || "No help available. :L";
    }
}

const Commands = {
    help: new Command(
        (player, commandName) => {
            if (commandName) {
                if (Commands[commandName]) {
                    // Get the help for that command.
                    return Commands[commandName].help;
                }

                return `
                    Invalid command. Commands list:
                    ${Object.keys(Commands).join(" ")}
                `;
            }

            return Commands.help.help;
        },
        `
        Prints help for a command.
        Format: /help {command name}
        Example: /help teleport
        `,
    ),
    spawnitem: new Command(
        (player, typeName, size) => {
            const pickupTypeName = `Pickup${typeName}`;

            if (!EntitiesList[pickupTypeName]) return;

            new EntitiesList[pickupTypeName]({
                row: player.row,
                col: player.col,
                board: player.board,
                itemConfig: new ItemConfig({
                    ItemType: ItemsList.BY_NAME[typeName],
                    quantity: size,
                    durability: size,
                }),
            }).emitToNearbyPlayers();
        },
        `
        Spawns an item pickup on the floor at your position.
        Format: /spawnitem {item type name} {quantity/durability}
        Examples:
        - Spawn a stack of 25 items:
        /spawnitem HealthPotion 25
        - Spawn an item with 300 durability:
        /spawnitem IronSword 300
        `,
    ),
    spawnentity: new Command(
        (player, typeName, row, col) => {
            if (typeName === "Player") return "Restricted entity type.";
            if (typeName === "AbstractClasses") return "Restricted entity type.";
            if (!EntitiesList[typeName]) return "Invalid entity type name.";
            if (Object.prototype.hasOwnProperty.call(EntitiesList[typeName], "abstract")) return "Restricted entity type.";

            if (row) {
            // Use an offset from player row.
                if (row.startsWith("+") || row.startsWith("-")) {
                    row = player.row + parseInt(row, 10);
                }
                row = parseInt(row, 10);
            }
            else {
                row = player.row;
            }

            if (col) {
            // Use an offset from player column.
                if (col.startsWith("+") || col.startsWith("-")) {
                    col = player.col + parseInt(col, 10);
                }
                col = parseInt(col, 10);
            }
            else {
                col = player.col;
            }

            // Check it is a valid board tile.
            if (!player.board.getTileAt(row, col)) return "Invalid position.";

            new EntitiesList[typeName]({
                row,
                col,
                board: player.board,
            }).emitToNearbyPlayers();

            return false;
        },
        `
        Spawns an entity at the target position.
        Use +/- to specify an offset from your position.
        Format: /spawnentity {entity type name} {row} {column}
        Examples:
        - Spawn at your position
        /spawnentity Bandit
        - Spawn offset from your position
        /spawnentity Bandit +2 -5
        - Spawn at target position
        /spawnentity Bandit 123 456
        `,
    ),
    teleport: new Command(
        (player, row, col) => {
            if (!row || !col) return "Missing inputs.";

            // Use an offset from player row.
            if (row.startsWith("+") || row.startsWith("-")) {
                row = player.row + parseInt(row, 10);
            }
            else {
                row = parseInt(row, 10);
            }

            // Use an offset from player column.
            if (col.startsWith("+") || col.startsWith("-")) {
                col = player.col + parseInt(col, 10);
            }
            else {
                col = parseInt(col, 10);
            }

            // Check it is a valid board tile.
            if (!player.board.getTileAt(row, col)) return "Invalid position.";

            player.changeBoard(player.board, player.board, row, col);

            return false;
        },
        `
        Instantly moves you to the target position.
        Use +/- to specify an offset from your position.
        Format: /teleport {row} {column}
        Examples:
        - Teleport offset from your position:
        /teleport +5 -8
        - Teleport to target position:
        /teleport 123 456
        `,
    ),
};

module.exports = Commands;
