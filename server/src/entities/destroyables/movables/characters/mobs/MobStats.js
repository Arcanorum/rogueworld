
const Utils = require('./../../../../../Utils');
//const XLSX = require('xlsx');
const fs = require('fs');
const Factions = require('../../../../../Factions');
const Behaviours = require('../../../../../Behaviours');

function getValue (config, valueName, propName, typeCheckFunc) {

    if(config[valueName] === undefined) return defaultMobStats[propName];

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

        this.gloryValue =       getValue(config, "Glory value",         "gloryValue",       Number.isInteger);
        this.maxHitPoints =     getValue(config, "Max hitpoints",       "maxHitPoints",     Number.isInteger);
        this.defence =          getValue(config, "Defence",             "defence",          Number.isInteger) / 100; // Convert to a percentage.
        this.viewRange =        getValue(config, "View range",          "viewRange",        Number.isInteger);
        this.moveRate =         getValue(config, "Move rate",           "moveRate",         Number.isInteger);
        this.wanderRate =       getValue(config, "Wander rate",         "wanderRate",       Number.isInteger);
        this.targetSearchRate = getValue(config, "Target search rate",  "targetSearchRate", Number.isInteger);
        this.attackRate =       getValue(config, "Attack rate",         "attackRate",       Number.isInteger);
        this.meleeAttackPower = getValue(config, "Melee attack power",  "meleeAttackPower", Number.isInteger);

        this.projectileAttackType = null;
        // If a projectile attack type is defined, use it.
        if(config["Projectile attack type"] !== undefined){
            // Check a projectile file exists by the given name. Can't do a direct reference to it here, as it isn't defined yet.
            if(fs.existsSync('./src/entities/destroyables/movables/projectiles/Proj' + config["Projectile attack type"] + '.js') === true){
                this.projectileAttackType = 'projectiles/Proj' + config["Projectile attack type"];
            }
        }

        // Use the default faction if undefined.
        if(config["Faction"] === undefined) this.faction = defaultMobStats["faction"];
        else {
            // Check the faction is valid.
            if(Factions[config["Faction"]] === undefined) Utils.error("Invalid faction given: " + config["Faction"]);
            this.faction = Factions[config["Faction"]];
        }

        // Use the default behaviour if undefined.
        if(config["Behaviour"] === undefined) this.behaviour = defaultMobStats["behaviour"];
        else {
            if(Behaviours[config["Behaviour"]] === undefined) Utils.error("Invalid behaviour given: " + config["Behaviour"]);
            this.behaviour = Behaviours[config["Behaviour"]];
        }

        this.dropAmount =       getValue(config, "Drop amount",     "dropAmount",   Number.isInteger);

        this.dropList = [];
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

// Get the 

const MobValues = require('../../../../../MobValues.json');
console.log("loaded mob values:", MobValues);




// const workbook = XLSX.readFile('Dungeonz.io mob values.xlsx');

// const firstSheetName = workbook.SheetNames[0];
// // Get the worksheet.
// const worksheet = workbook.Sheets[firstSheetName];

// //console.log("worksheet:", worksheet);

// // Some characters to loop though, to go across the columns.
// const columnChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'];

// // The column that the entity type names are on.
// const entityNameCol = 'A';
// // The row that the value names are on. "Glory value", "Defence", etc.
// const valueNamesRow = 1;
// // The row that the default values are on.
// const defaultValuesRow = 2;

// let defaultMobStats;

// const config = {};

// // Go through all of the columns. Start at 1 to skip 'A' for entity name, as don't need the name.
// for(let i=1; i<columnChars.length; i+=1){
//     // Check if the end of the list of value names has been reached.
//     if(worksheet[columnChars[i] + valueNamesRow] === undefined) break;
//     // Check there is a default value defined.
//     if(worksheet[columnChars[i] + defaultValuesRow] === undefined) Utils.error("Parsing mob values, default value missing for value name:" + worksheet[columnChars[i] + valueNamesRow].v);

//     const valueName = worksheet[columnChars[i] + valueNamesRow].v;
//     const value = worksheet[columnChars[i] + defaultValuesRow].v;

//     config[valueName] = value;
// }

// defaultMobStats = new MobStats(config);

// // Where the adder is currently up to, how far down it has gone, what entity type it is adding.
// // Start at 3, as 2 is default.
// let currentValuesRow = 3;

// while(true){
//     if(worksheet[entityNameCol + currentValuesRow] === undefined) break;

//     const config = {};

//     // Go through all of the columns. Start at 1 to skip 'A' for entity name, as don't need the name.
//     for(let i=1; i<columnChars.length; i+=1){
//         // Check if the end of the list of value names has been reached.
//         if(worksheet[columnChars[i] + valueNamesRow] === undefined) break;
//         //console.log("looped, current values row:", currentValuesRow, ", col:", columnChars[i]);

//         const valueName = worksheet[columnChars[i] + valueNamesRow].v;
//         const value = worksheet[columnChars[i] + currentValuesRow] ? worksheet[columnChars[i] + currentValuesRow].v : undefined;

//         config[valueName] = value;
//     }

//     MobStatsList[worksheet[entityNameCol + currentValuesRow].v] = new MobStats(config);

//     currentValuesRow += 1;
// }

module.exports = MobStatsList;