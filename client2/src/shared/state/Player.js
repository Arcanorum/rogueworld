import PubSub from "pubsub-js";
import {
    HITPOINTS_VALUE,
    MAX_HITPOINTS_VALUE,
    ENERGY_VALUE,
    MAX_ENERGY_VALUE,
    GLORY_VALUE,
    DEFENCE_VALUE,
} from "../EventTypes";

class Player {
    hitPoints = 0;

    maxHitPoints = 0;

    energy = 0;

    maxEnergy = 0;

    glory = 0;

    defence = 0;

    setHitPoints(value) {
        const old = this.hitPoints;
        this.hitPoints = value;
        PubSub.publish(HITPOINTS_VALUE, { old, new: value });
    }

    setMaxHitPoints(value) {
        const old = this.maxHitPoints;
        this.maxHitPoints = value;
        PubSub.publish(MAX_HITPOINTS_VALUE, { old, new: value });
    }

    setEnergy(value) {
        const old = this.energy;
        this.energy = value;
        PubSub.publish(ENERGY_VALUE, { old, new: value });
    }

    setMaxEnergy(value) {
        const old = this.maxEnergy;
        this.maxEnergy = value;
        PubSub.publish(MAX_ENERGY_VALUE, { old, new: value });
    }

    setGlory(value) {
        const old = this.glory;
        this.glory = value;
        PubSub.publish(GLORY_VALUE, { old, new: value });
    }

    setDefence(value) {
        const old = this.defence;
        this.defence = value;
        PubSub.publish(DEFENCE_VALUE, { old, new: value });
    }
}

export default Player;
