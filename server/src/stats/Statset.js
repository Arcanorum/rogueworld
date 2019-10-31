
const Stat = require('./Stat.js');

class Statset {

    /**
     * A new set of stats. One of each.
     * @param {Player} owner
     */
    constructor (owner) {
        // If adding anything else here that ISN'T an actual stat, check
        // how it affects the account saving/loading in account manager.
        //this.owner = owner;

        this.Melee =        new Stat(owner, this.StatNames.Melee);
        this.Ranged =       new Stat(owner, this.StatNames.Ranged);
        this.Magic =        new Stat(owner, this.StatNames.Magic);
        this.Gathering =    new Stat(owner, this.StatNames.Gathering);
        this.Weaponry =     new Stat(owner, this.StatNames.Weaponry);
        this.Armoury =      new Stat(owner, this.StatNames.Armoury);
        this.Toolery =      new Stat(owner, this.StatNames.Toolery);
        this.Potionry =     new Stat(owner, this.StatNames.Potionry);
        this.Clanship =     new Stat(owner, this.StatNames.Clanship);
    }

    getEmittableStats () {
        const emittableStats = {};

        for(let statName in this.StatNames){
            if(this.StatNames.hasOwnProperty(statName) === false) continue;
            // Check the stat name is an actual stat on the stat set.
            // Might be in the stat name list but not be an existing stat with that name.
            if(this[statName]){
                emittableStats[statName] = {
                    level: this[statName].level,
                    exp: this[statName].exp,
                    nextLevelExpRequirement: this[statName].nextLevelExpRequirement
                };
            }
        }

        return emittableStats;
    }

}

Statset.prototype.StatNames = {
    Melee:      'Melee',
    Ranged:     'Ranged',
    Magic:      'Magic',
    Gathering:  'Gathering',
    Weaponry:   'Weaponry',
    Armoury:    'Armoury',
    Toolery:    'Toolery',
    Potionry:   'Potionry',
    Clanship:   'Clanship'
};

module.exports = Statset;