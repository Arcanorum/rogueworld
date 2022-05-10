// All types that are used across the game client, NOT across the project.
// Project-scoped types belong in the @dungeonz/types package.

import Player from '../../game/entities/characters/Player';
import Entity from '../../game/entities/Entity';

export interface WebpackRequireValue {
    default: {
        src: string;
        blurDataURL: string;
        height: number;
        width: number;
    };
}

export interface CraftingRecipeIngredient {
    id: string;
    itemTypeCode: string;
    quantity: number;
}

interface CraftingRecipeResult {
    itemTypeCode: string;
    baseQuantity: number;
}

export interface CraftingRecipe {
    id: string;
    index: string;
    stationClasses: Array<string>;
    ingredients: Array<CraftingRecipeIngredient>;
    result: CraftingRecipeResult;
}

export interface ShopItemState {
    id: string;
    index: number;
    typeCode: string;
    quantity: number;
    totalWeight: number;
}

export interface DynamicEntityData {
    id: string;
    typeNumber: number;
    row: number;
    col: number;
}

export interface DynamicEntity {
    id: string;
    row: number;
    col: number;
    spriteContainer: Entity | Player;
}

/**
 * Wrapper around Phaser text that accomodates movement tweens to make to look like it is bouncing,
 * i.e. damage numbers flying from the target.
 */
export class BouncyText extends Phaser.GameObjects.Text {
    horizontalTween?: Phaser.Tweens.Tween;
    verticalTween?: Phaser.Tweens.Tween;
}
