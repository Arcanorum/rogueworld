import { Settings } from '@dungeonz/configs';
import { error } from '@dungeonz/utils';
import { ItemState } from '.';
import { ItemsList } from '../items';

export const list: Array<ItemState> = [];

export const populateList = () => {
    Settings.STARTER_INVENTORY_ITEMS.forEach((itemStateSetting: any) => {
        if (!ItemsList.BY_NAME[itemStateSetting.itemName]) {
            error('Item type name given in STARTER_INVENTORY_ITEMS list is not in the item types list:', itemStateSetting.itemName);
        }
        list.push(new ItemState({
            ItemType: ItemsList.BY_NAME[itemStateSetting.itemName],
            quantity: itemStateSetting.quantity,
        }));
    });
};
