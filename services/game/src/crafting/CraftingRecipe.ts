import Item from '../items/classes/Item';

interface Ingredient {
    ItemType: typeof Item;
    quantity: number;
}

interface Result {
    ItemType: typeof Item;
    baseQuantity: number;
}

interface CraftingRecipe {
    ingredients: Array<Ingredient>;
    result: Result;
    stationClasses: Array<string>;
    statNames?: Array<string>;
    expGiven?: number;
}

export default CraftingRecipe;
