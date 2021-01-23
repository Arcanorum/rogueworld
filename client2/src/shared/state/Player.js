import PubSub from "pubsub-js";
import {
    HITPOINTS_VALUE,
    MAX_HITPOINTS_VALUE,
    ENERGY_VALUE,
    MAX_ENERGY_VALUE,
    GLORY_VALUE,
    DEFENCE_VALUE,
    STATS_VALUE,
    TASKS_VALUE,
} from "../EventTypes";
import Utils from "../Utils";

class Player {
    hitPoints = 0;

    maxHitPoints = 0;

    energy = 0;

    maxEnergy = 0;

    glory = 0;

    defence = 0;

    stats = {
        Melee: {
            textDefID: "Melee", level: 0, exp: 0, nextLevelExpRequirement: 0,
        },
        Ranged: {
            textDefID: "Ranged", level: 0, exp: 0, nextLevelExpRequirement: 0,
        },
        Magic: {
            textDefID: "Magic", level: 0, exp: 0, nextLevelExpRequirement: 0,
        },
        Gathering: {
            textDefID: "Gathering", level: 0, exp: 0, nextLevelExpRequirement: 0,
        },
        Weaponry: {
            textDefID: "Weaponry", level: 0, exp: 0, nextLevelExpRequirement: 0,
        },
        Armoury: {
            textDefID: "Armoury", level: 0, exp: 0, nextLevelExpRequirement: 0,
        },
        Toolery: {
            textDefID: "Toolery", level: 0, exp: 0, nextLevelExpRequirement: 0,
        },
        Potionry: {
            textDefID: "Potionry", level: 0, exp: 0, nextLevelExpRequirement: 0,
        },
    }

    tasks = [];

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

    setStats(stats) {
        // Update the stats to the correct values.
        Object.entries(stats).forEach(([statName, data]) => {
            if (!this.stats[statName]) {
                // A new stat might not have been added to the client yet.
                Utils.warning(`setStats: No stat defined for stat name "${statName}".`);
                return;
            }
            this.stats[statName].level = data.level;
            this.stats[statName].exp = data.exp;
            this.stats[statName].nextLevelExpRequirement = data.nextLevelExpRequirement;
        });

        PubSub.publish(STATS_VALUE, { new: this.stats });
    }

    setStatExp(statName, exp) {
        if (!this.stats[statName]) Utils.warning(`setStatExp: Invalid stat name "${statName}"`);
        this.stats[statName].exp = exp;
        PubSub.publish(STATS_VALUE, { new: this.stats });
    }

    setStatLevel(statName, level, nextLevelExpRequirement) {
        this.stats[statName].level = level;
        this.stats[statName].nextLevelExpRequirement = nextLevelExpRequirement;
        // _this.GUI.statsPanel.updateSelectedStat();
        // _this.chat(undefined, `${dungeonz.getTextDef(`Stat name: ${this.name}`)} level gained!`, "#73ff66");

        PubSub.publish(STATS_VALUE, { new: this.stats });
    }

    setTasks(tasks) {
        this.tasks = tasks;
        PubSub.publish(TASKS_VALUE, { new: this.tasks });
    }
}

export default Player;
