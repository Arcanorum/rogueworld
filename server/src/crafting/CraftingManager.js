
const CraftingManager = {

    StationRecipes: {},

    /**
     *
     * @param {Object} config
     * @param {Function} config.result
     * @param {String} config.craftingStat
     * @param {Function} config.stationType
     * @param {Function} config.comp1
     * @param {Function} [config.comp2]
     * @param {Function} [config.comp3]
     * @param {Function} [config.comp4]
     * @param {Function} [config.comp5]
     * @param {Number} [config.statXPGiven] - A specific amount of XP given for crafting this item. Default will use the sum of the craftingExpValues of each component.
     * @param {TaskType} [config.taskCrafted] - What task will crafting this item give progress towards.
     */
    addRecipe: function (config) {
        if(config.comp1 === undefined) return;

        let recipeCode = config.comp1.prototype.typeNumber + '-';
        let statXPGiven = config.comp1.prototype.craftingExpValue;
        if(config.comp2 !== undefined){ recipeCode += config.comp2.prototype.typeNumber + '-'; statXPGiven += config.comp2.prototype.craftingExpValue }
        if(config.comp3 !== undefined){ recipeCode += config.comp3.prototype.typeNumber + '-'; statXPGiven += config.comp3.prototype.craftingExpValue }
        if(config.comp4 !== undefined){ recipeCode += config.comp4.prototype.typeNumber + '-'; statXPGiven += config.comp4.prototype.craftingExpValue }
        if(config.comp5 !== undefined){ recipeCode += config.comp5.prototype.typeNumber + '-'; statXPGiven += config.comp5.prototype.craftingExpValue }

        if(config.statXPGiven !== undefined) statXPGiven = config.statXPGiven;

        const stationTypeNumber = config.stationType.prototype.typeNumber;

        if(this.StationRecipes[stationTypeNumber] === undefined){
            this.StationRecipes[stationTypeNumber] = {};
        }

        let taskIDCrafted;
        if(config.taskCrafted === undefined || config.taskCrafted.taskID === undefined){
            taskIDCrafted = null;
        }
        else {
            taskIDCrafted = config.taskCrafted.taskID;
        }

        this.StationRecipes[stationTypeNumber][recipeCode] = {
            /** @type {Function} */
            result: config.result,
            /** @type {String} */
            craftingStat: config.craftingStat,
            /** @type {Number} */
            statXPGiven: statXPGiven,
            /** @type {Number} */
            stationTypeNumber: config.stationType.prototype.typeNumber,
            /** @type {String} */
            taskIDCrafted: taskIDCrafted
        };
    },

    /**
     *
     * @param {Player} crafter
     * @param {Number} stationTypeNumber
     * @param {Array} inventorySlotKeys
     * @returns {*}
     */
    craft: function (crafter, stationTypeNumber, inventorySlotKeys) {
        if(Array.isArray(inventorySlotKeys) === false) return;
        // Check for any duplicate values in the components.
        // Someone might try to use the same inventory item for multiple components.
        if((new Set(inventorySlotKeys)).size !== inventorySlotKeys.length) return;
        // Check the station type number is valid. Might have been invalid input.
        if(this.StationRecipes[stationTypeNumber] === undefined) return;

        let recipeCode = '';
        // How many of the components have a durability.
        let durabilityCount = 0;
        let totalPercentRemaining = 0;
        let totalPercentImproved = 0;

        let item;
        const inventory = crafter.inventory;
        for(let i=0; i<inventorySlotKeys.length; i+=1){
            // Only string names of each slot to use should be in the components.
            if(typeof inventorySlotKeys[i] !== 'string') return;

            item = inventory[inventorySlotKeys[i]];
            if(item === undefined) continue;
            if(item === null) continue;
            recipeCode += item.typeNumber + '-';
            if(item.durability !== null){
                durabilityCount += 1;
                totalPercentRemaining += item.durability / item.maxDurability;
                totalPercentImproved += item.maxDurability / item.baseDurability;
            }
        }

        let recipe = this.StationRecipes[stationTypeNumber][recipeCode];

        if(recipe === undefined) return;

        // Check the player is stood next to the correct type of crafting station.
        if(crafter.isAdjacentToStaticType(stationTypeNumber) === false){
            return;
        }

        let resultDurability = null;
        let resultMaxDurability = null;
        // If the item to be crafted has a durability, it is affected by some crafting stat of the crafter.
        if(recipe.result.prototype.baseDurability !== null){
            if(durabilityCount > 0){
                const maxDurabilityPercentImproved = totalPercentImproved / durabilityCount;
                const durabilityPercentRemaining = totalPercentRemaining / durabilityCount;
                resultMaxDurability = Math.trunc(recipe.result.prototype.baseDurability * maxDurabilityPercentImproved * (1 + (crafter.stats[recipe.craftingStat].level / 20)));
                resultDurability = Math.trunc(resultMaxDurability * durabilityPercentRemaining);
            }
            // None of the ingredients have a durability, so don't need to worry about the average percent remaining on the
            // resulting item (it will be 100% of base max durability), but still need to factor in the stat level improvement.
            else {
                resultMaxDurability = Math.trunc(recipe.result.prototype.baseDurability * (1 + (crafter.stats[recipe.craftingStat].level / 20)));
                resultDurability = Math.trunc(resultMaxDurability);
            }
        }

        crafter.stats[recipe.craftingStat].gainExp(recipe.statXPGiven * 0.5);

        // Remove the items from the crafter that were used in the recipe.
        for(let i=0; i<inventorySlotKeys.length; i+=1){
            item = inventory[inventorySlotKeys[i]];
            if(item === undefined) continue;
            if(item === null) continue;
            item.destroy();
        }

        crafter.addToInventory(new recipe.result({durability: resultDurability, maxDurability: resultMaxDurability}));

        crafter.modGlory(recipe.statXPGiven);

        crafter.tasks.progressTask(recipe.taskIDCrafted);
    }

};

module.exports = CraftingManager;

// Run the crafting recipes file to init the recipes.
require('./CraftingRecipes');