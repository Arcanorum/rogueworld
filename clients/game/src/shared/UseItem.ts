import { ApplicationState } from './state';
import ItemState from './ItemState';

export default function useItem(itemState: ItemState) {
    ApplicationState.connection?.sendEvent('use_item', itemState.slotIndex);
}
