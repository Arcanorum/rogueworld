class Ingredient {
    constructor(config) {
        this.ItemType = config.ItemType;

        this.quantity = config.quantity || config.ItemType.prototype.baseQuantity;
    }
}

class Result {
    constructor(config) {
        this.ItemType = config.ItemType;

        this.baseQuantity = config.baseQuantity || config.ItemType.prototype.baseQuantity;

        this.baseDurability = config.baseDurability || config.ItemType.prototype.baseDurability;
    }
}

class CraftingRecipe {
    constructor(config) {
        this.stationTypes = config.stationTypes || [];

        this.statNames = config.statNames || [];

        this.expGiven = config.expGiven || 0;

        this.ingredients = config.ingredients.map((ingredient) => new Ingredient(ingredient));

        this.result = new Result(config.result);
    }
}

module.exports = CraftingRecipe;
