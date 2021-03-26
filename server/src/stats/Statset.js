const Stat = require("./Stat.js");

class Statset {
    /**
     * A new set of stats. One of each.
     * @param {Player} owner
     */
    constructor(owner) {
        // If adding anything else here that ISN'T an actual stat, check
        // how it affects the account saving/loading in account manager.
        // this.owner = owner;

        this.Melee = new Stat(owner, this.StatNames.Melee);
        this.Ranged = new Stat(owner, this.StatNames.Ranged);
        this.Magic = new Stat(owner, this.StatNames.Magic);
        this.Gathering = new Stat(owner, this.StatNames.Gathering);
        this.Weaponry = new Stat(owner, this.StatNames.Weaponry);
        this.Armoury = new Stat(owner, this.StatNames.Armoury);
        this.Toolery = new Stat(owner, this.StatNames.Toolery);
        this.Potionry = new Stat(owner, this.StatNames.Potionry);
        this.Clanship = new Stat(owner, this.StatNames.Clanship);
    }

    getEmittableStats() {
        const emittableStats = {};

        Object.values(this.StatNames).forEach((statName) => {
            // Check the stat name is an actual stat on the stat set.
            // Might be in the stat name list but not be an existing stat with that name.
            if (this[statName]) {
                emittableStats[statName] = {
                    level: this[statName].level,
                    exp: this[statName].exp,
                    nextLevelExpRequirement: this[statName].nextLevelExpRequirement,
                };
            }
        });

        return emittableStats;
    }

    loadData(account) {
        Object.entries(this).forEach(([statKey, stat]) => {
            // Check the account has exp data on that stat. A new stat might have been added to
            // the stat set since this player last logged in, so they won't have an entry for it.
            // Allow 0.
            if (!Number.isFinite(account.stats[statKey])) return;
            // Get the exp for each stat that this account has data on.
            stat.exp = account.stats[statKey];
            stat.calculateCurrentLevel();
        });
    }

    getGainedLevels() {
        return Object.values(this).reduce((accumulator, stat) => (
            // -1 to not count the default level. Only care about the ones after level 1.
            accumulator + (stat.level - 1)
        ), 0);
    }
}

Statset.prototype.StatNames = {
    Melee: "Melee",
    Ranged: "Ranged",
    Magic: "Magic",
    Gathering: "Gathering",
    Weaponry: "Weaponry",
    Armoury: "Armoury",
    Toolery: "Toolery",
    Potionry: "Potionry",
    Clanship: "Clanship",
};

module.exports = Statset;
