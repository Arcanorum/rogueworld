import PubSub from 'pubsub-js';
import { ApplicationState } from './state';
import { USED_ITEM } from './EventTypes';
import ItemState from './ItemState';

export default (itemState: ItemState) => {
    PubSub.publish(USED_ITEM, itemState);
    ApplicationState.connection?.sendEvent('use_item', itemState.slotIndex);
};
