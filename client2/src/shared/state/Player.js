import PubSub from "pubsub-js";
import { HITPOINTS_VALUE, ENERGY_VALUE, GLORY_VALUE } from "../EventTypes";

class Player {
    hitPoints = 50;

    maxHitPoints = 100;

    energy = 0;

    maxEnergy = 0;

    glory = 0;

    setHitPoints(value) {
        const old = this.hitPoints;
        this.hitPoints = value;
        PubSub.publish(HITPOINTS_VALUE, { old, new: value });
    }

    setEnergy(value) {
        const old = this.energy;
        this.energy = value;
        PubSub.publish(ENERGY_VALUE, { old, new: value });
    }

    setGlory(value) {
        const old = this.glory;
        this.glory = value;
        PubSub.publish(GLORY_VALUE, { old, new: value });
    }
}

export default Player;
