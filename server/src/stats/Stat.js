const EventsList = require('./../EventsList');

class Stat {
    /**
     * @param {Player} player - The entity of the player that owns the stat set that this stat is a part of.
     * @param {String} name - The name of this stat, such as "Melee", "Mining", "Stamina".
     */
    constructor (player, name) {
        /**
         * The owner of this stat.
         * @type {Player}
         */
        this.player = player;

        this.name = name || 'Unnamed stat';

        /**
         * Their proficiency in this stat.
         * @type {number}
         */
        this.level = 1;

        /**
         * The highest the level can go.
         * @type {number}
         */
        this.maxLevel = 50;

        this.levelModifier = 0;

        /**
         * How much exp this player has in this stat.
         * @type {Number}
         */
        this.exp = 0;

        /**
         * How much exp this player needs to get to level up this stat.
         * @type {Number}
         */
        this.nextLevelExpRequirement = 100;

        /**
         * How much to increase the next level exp requirement by each time this stat is levelled up.
         * @type {Number}
         */
        this.expRequirementIncreaseMultiplier = 1.2;

        /**
         * How much to increase the next level exp requirement by when this stat is levelled up.
         * @type {Number}
         */
        this.expRequirementIncreaseAmount = 100;

        //this.calculateCurrentLevel(); DONE IN ACCOUNT MANAGER
    }

    calculateCurrentLevel () {
        // Keep increasing their level as long as they have enough exp for the next level.
        while((this.exp >= this.nextLevelExpRequirement) && (this.level < this.maxLevel)){
            this.levelUp();
        }
    }

    gainExp (amount) {
        this.exp += amount;

        this.player.socket.sendEvent(EventsList.exp_gained, {statName: this.name, exp: this.exp});

        if(this.level < this.maxLevel){
            if(this.exp >= this.nextLevelExpRequirement){
                this.levelUp();

                this.player.socket.sendEvent(EventsList.stat_levelled, {statName: this.name, level: this.level, nextLevelExpRequirement: this.nextLevelExpRequirement});
            }
        }
    }

    levelUp () {
        this.level += 1;

        this.expRequirementIncreaseAmount = this.expRequirementIncreaseAmount * this.expRequirementIncreaseMultiplier;

        this.nextLevelExpRequirement += Math.floor(this.expRequirementIncreaseAmount);
    }

}

module.exports = Stat;