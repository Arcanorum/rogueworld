/**
 * Access to all of the dungeon manager instances, either by their ID, or dungeon name.
 */
module.exports = {
    /**
     * @example
     * // Get a dungeon manager by ID.
     * DungeonManagersList.ByID[1];
     */
    ByID: {},
    /**
     * @example
     * // Get the bandit hideout dungeon manager.
     * DungeonManagersList.ByName["bandit-hideout"];
     */
    ByName: {},
};
