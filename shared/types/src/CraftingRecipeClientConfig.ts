export interface CraftingRecipeClientConfig {
    id: string;
    index: number;
    stationClasses: Array<string>;
    ingredients: Array<{
        id: string;
        itemTypeCode: string;
        quantity: number;
    }>;
    result: {
        itemTypeCode: string;
        baseQuantity: number;
    };
}
