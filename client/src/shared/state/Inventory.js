import PubSub from "pubsub-js";
import { } from "../EventTypes";

class Inventory {
    items = [];

    hotBar = [];

    weight = 0;

    maxWeight = 0;

    addToInventory() {

    }

    addToHotBar() {

    }

    setWeight(value) {
        this.weight = value;
    }

    setMaxWeight(value) {
        this.maxWeight = value;
    }
}

export default Inventory;
