import { ApplicationState } from './state';
import ItemState from './ItemState';

export default (itemState: ItemState) => {
    ApplicationState.connection?.sendEvent('use_item', itemState.slotIndex);
};
