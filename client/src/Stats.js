
class Stat {
    constructor (name, level, exp, nextLevelExpRequirement) {
        this.name = name;
        this.level = level || 1;
        this.exp = exp || 0;
        this.nextLevelExpRequirement = nextLevelExpRequirement || 0;
    }

    modExp (value) {
        this.exp = value;
        _this.GUI.statsPanel.updateSelectedStat();
    }

    levelUp (level, nextLevelExpRequirement) {
        this.level = level;
        this.nextLevelExpRequirement = nextLevelExpRequirement;
        _this.GUI.statsPanel.updateSelectedStat();
        _this.chat(undefined, dungeonz.getTextDef("Stat name: " + this.name) + " level gained!", '#73ff66');
    }
}

class Stats {
    constructor (stats) {
        this.list = {};

        this.list.Melee =       new Stat('Melee');
        this.list.Ranged =      new Stat('Ranged');
        this.list.Magic =       new Stat('Magic');
        this.list.Gathering =   new Stat('Gathering');
        this.list.Weaponry =    new Stat('Weaponry');
        this.list.Armoury =     new Stat('Armoury');
        this.list.Toolery =     new Stat('Toolery');
        this.list.Potionry =    new Stat('Potionry');
        this.list.Clanship =    new Stat('Clanship');

        // Update the stats to the correct exp/requirement values.
        for(let statName in stats){
            if(this.list.hasOwnProperty(statName) === false) continue;
            this.list[statName].level = stats[statName].level;
            this.list[statName].exp = stats[statName].exp;
            this.list[statName].nextLevelExpRequirement = stats[statName].nextLevelExpRequirement;
        }
    }
}

export default Stats;