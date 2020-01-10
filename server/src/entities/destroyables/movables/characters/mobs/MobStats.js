
const Utils = require('./../../../../../Utils');
//const XLSX = require('xlsx');
const fs = require('fs');
const Factions = require('../../../../../Factions');
const Behaviours = require('../../../../../Behaviours');

/**
 * Gets the value to use for a mob for a given property.
 * Uses the value from the config object if found and passes a validity check.
 * Otherwise uses the generic mob default if not found.
 * @param {Object} config A group of raw mob properties.
 * @param {String} valueName The value to look for in the config.
 * @param {Function} typeCheckFunc What to expect the value to be.
 */
function getValue (config, valueName, typeCheckFunc) {

    if(config[valueName] === undefined) return defaultMobStats[valueName];

    else if(typeCheckFunc(config[valueName]) === false) Utils.error(valueName + " is incorrect type: " + typeof config[valueName]);

    else return config[valueName];
}

class Drop {
    constructor (config) {
        /**
         * The item pickup entity to be created when this item is dropped.
         * @type {Function}
         */
        this.pickupType = EntitiesList["Pickup" + config.itemName];

        if(this.pickupType instanceof Pickup === false) Utils.error("Mob item drop name is not a valid item. Check there is a pickup entity with this item name. Config:" + config);

        /**
         * How many separate chances to get the item.
         * @type {Number}
         */
        this.rolls = 1;
        // Use config if set.
        if(config.rolls !== undefined){
            // Check it is valid.
            if(Number.isInteger(config.rolls) === false) Utils.error("Mob item drop rolls must be an integer. Config:" + config);
            if(config.rolls > 1) Utils.error("Mob item drop rolls must be greater than 1. Config:", config);

            this.rolls = config.rolls;
        }
        
        /**
         * The chance of getting the item on each roll.
         * @type {Numnber}
         */
        this.dropRate = 0.2;
        // Use config if set.
        if(config.dropRate !== undefined){
            // Check it is valid.
            if(config.dropRate <= 0 || config.dropRate > 100) Utils.error("Mob item drop rate must be greater than 0, up to 100, i.e. 40 => 40% chance. Config:" + config);

            this.rolls = config.rolls;
        }
        // Otherwise use the item pickup default drop rate.
        else if(true) {

        }
    }
}

class MobStats {
    constructor (config) {
        console.log("new mobstats, config:", config);

        // Simple values that can be taken from the config as they are:

        this.gloryValue =       getValue(config, "gloryValue",          Number.isInteger);
        this.maxHitPoints =     getValue(config, "maxHitPoints",        Number.isInteger);
        this.defence =          getValue(config, "defence",             Number.isInteger) / 100; // Convert to a percentage.
        this.viewRange =        getValue(config, "viewRange",           Number.isInteger);
        this.moveRate =         getValue(config, "moveRate",            Number.isInteger);
        this.wanderRate =       getValue(config, "wanderRate",          Number.isInteger);
        this.targetSearchRate = getValue(config, "targetSearchRate",    Number.isInteger);
        this.attackRate =       getValue(config, "attackRate",          Number.isInteger);
        this.meleeAttackPower = getValue(config, "meleeAttackPower",    Number.isInteger);
        this.dropList =         getValue(config, "dropList",            Array.isArray);

        // More complex config values that need some validify checks
        // first, or that need to reference certain existing values:

        this.projectileAttackType = null;
        // If a projectile attack type is defined, use it.
        if(config["projectileAttackType"] !== undefined){
            // Check a projectile file exists by the given name. Can't do a direct reference to it here, as it isn't defined yet.
            if(fs.existsSync('./src/entities/destroyables/movables/projectiles/Proj' + config["projectileAttackType"] + '.js') === true){
                this.projectileAttackType = 'projectiles/Proj' + config["projectileAttackType"];
            }
        }

        // Use the default faction if undefined.
        if(config["faction"] === undefined) this.faction = defaultMobStats["faction"];
        else {
            // Check the faction is valid.
            if(Factions[config["faction"]] === undefined) Utils.error("Invalid faction given: " + config["faction"]);
            this.faction = Factions[config["faction"]];
        }

        // Use the default behaviour if undefined.
        if(config["behaviour"] === undefined) this.behaviour = defaultMobStats["behaviour"];
        else {
            if(Behaviours[config["behaviour"]] === undefined) Utils.error("Invalid behaviour given: " + config["behaviour"]);
            this.behaviour = Behaviours[config["behaviour"]];
        }

    }
}

/**
 *  {
 *      "citizen": {
 *          gloryValue: 10,
 *          defence: 0
 *      },
 *      "bandit": {
 *          gloryValue: 50,
 *          defence: 0.2
 *      }
 *  }
 * @type {Object.<MobStats>}
 */
const MobStatsList = {};

const MobValues = require('../../../../../MobValues.json');

let defaultMobStats;

MobValues.forEach((rawConfig) => {
    if(rawConfig.name === "Default"){
        const config = {};
        for(const [key, value] of Object.entries(rawConfig)){
            config[key] = value;
        }
        defaultMobStats = new MobStats(config);
    }
    else {
        const config = {};
        for(const [key, value] of Object.entries(rawConfig)){
            config[key] = value;
        }
        MobStatsList[config.name] = new MobStats(config);
    }
});

console.log("mobstats list:", MobStatsList);

module.exports = MobStatsList;