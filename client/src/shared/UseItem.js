import PubSub from "pubsub-js";
import { ApplicationState } from "./state/States";
import { USED_ITEM } from "./EventTypes";

export default (itemConfig) => {
    PubSub.publish(USED_ITEM, itemConfig);
    ApplicationState.connection.sendEvent("use_item", itemConfig.slotIndex);
};
