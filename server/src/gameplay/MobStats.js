const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const Utils = require("../Utils");
const Factions = require("./Factions");
const Behaviours = require("./Behaviours");
const Drop = require("./Drop");
const Damage = require("./Damage");
const EntitiesList = require("../entities/EntitiesList");

let defaultMobStats;

/**
 * Gets the value to use for a mob for a given property.
 * Uses the value from the config object if found and passes a validity check.
 * Otherwise uses the generic mob default if not found.
 * @param {Object} config A group of raw mob properties.
 * @param {String} valueName The value to look for in the config.
 * @param {Function} typeCheckFunc What to expect the value to be.
 */
function getValue(config, valueName, typeCheckFunc) {
    if (config[valueName] === undefined) {
        return defaultMobStats[valueName];
    }

    if (typeCheckFunc(config[valueName]) === false) {
        Utils.error(`${valueName} is incorrect type: ${typeof config[valueName]}`);
    }

    return config[valueName];
}

class MobStats {
    constructor(config) {
        // Simple values that can be taken from the config as they are:

        this.gloryValue = getValue(config, "gloryValue", Number.isInteger);
        this.maxHitPoints = getValue(config, "maxHitPoints", Number.isInteger);
        this.defence = getValue(config, "defence", Number.isInteger);
        this.viewRange = getValue(config, "viewRange", Number.isInteger);
        this.moveRate = getValue(config, "moveRate", Number.isInteger);
        this.wanderRate = getValue(config, "wanderRate", Number.isInteger);
        this.targetSearchRate = getValue(config, "targetSearchRate", Number.isInteger);
        this.attackRate = getValue(config, "attackRate", Number.isInteger);
        this.meleeDamageAmount = getValue(config, "meleeDamageAmount", Number.isInteger);
        this.meleeDamageArmourPiercing = getValue(config, "meleeDamageArmourPiercing", Number.isInteger);

        // More complex config values that need some validity checks
        // first, or that need to reference certain existing values:

        if (config.meleeDamageTypes === undefined) {
            this.meleeDamageTypes = defaultMobStats.meleeDamageTypes;
        }
        else {
            this.meleeDamageTypes = [];
            config.meleeDamageTypes.forEach((typeName) => {
                // Check the name of the damage type in the config is valid.
                if (Damage.Types[typeName] === undefined) Utils.error("Invalid melee damage type list given. Damage type does not exist:", typeName);

                this.meleeDamageTypes.push(Damage.Types[typeName]);
            });
        }

        this.projectileAttackType = null;
        // If a projectile attack type is defined, use it.
        if (config.projectileAttackType !== undefined) {
            // Get the projectile type by the given name.
            this.projectileAttackType = EntitiesList[`Proj${config.projectileAttackType}`];
        }

        // Use the default faction if undefined.
        if (config.faction === undefined) this.faction = defaultMobStats.faction;
        else {
            // Check the faction is valid.
            if (Factions[config.faction] === undefined) Utils.error(`Invalid faction given: ${config.faction}`);
            this.faction = Factions[config.faction];
        }

        // Use the default behaviour if undefined.
        if (config.behaviour === undefined) this.behaviour = defaultMobStats.behaviour;
        else {
            if (Behaviours[config.behaviour] === undefined) Utils.error(`Invalid behaviour given: ${config.behaviour}`);
            this.behaviour = Behaviours[config.behaviour];
        }

        // Use null corpse type if undefined. Use null directly, otherwise this might be for the default mob stats itself.
        if (config.corpseType === undefined || config.corpseType === null) this.corpseType = null;
        else {
            if (fs.existsSync(`./src/entities/classes/destroyables/corpses/Corpse${config.corpseType}.js`) === false) {
                Utils.error(`Invalid corpse type given: ${config.corpseType}`);
            }

            this.corpseType = EntitiesList[`Corpse${config.corpseType}`];
        }

        if (config.dropList === undefined) this.dropList = defaultMobStats.dropList;
        else {
            if (Array.isArray(config.dropList) === false) Utils.error("Invalid drop list given. Must be an array:", config.dropList);

            this.dropList = [];
            config.dropList.forEach((dropConfig) => {
                this.dropList.push(new Drop(dropConfig));
            });
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

try {
    const configs = yaml.safeLoad(
        fs.readFileSync(
            path.resolve("./src/configs/Mobs.yml"), "utf8",
        ),
    );

    configs.forEach((rawConfig) => {
        const config = {};

        Object.entries(rawConfig).forEach(([key, value]) => {
            config[key] = value;
        });

        if (rawConfig.name === "Default") {
            defaultMobStats = new MobStats(config);
        }
        else {
            if (!EntitiesList[rawConfig.name]) {
                Utils.error("Invalid mob config. Entity type of name not found in entities list:", rawConfig.name);
            }

            MobStatsList[config.name] = new MobStats(config);
        }
    });
}
catch (error) {
    Utils.error(error);
}

module.exports = MobStatsList;
