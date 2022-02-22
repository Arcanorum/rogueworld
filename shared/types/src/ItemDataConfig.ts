import { ItemCategories } from './ItemCategories';

export interface ItemDataConfig {
    typeName: string;
    typeCode: string;
    hasUseEffect: boolean;
    equippable: boolean;
    categories: Array<ItemCategories>;
    translationId: string;
    iconSource: string;
    pickupSource?: string;
    pickupScaleModifier?: number;
    soundType?: string;
}
