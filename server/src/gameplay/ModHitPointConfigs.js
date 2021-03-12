const Damage = require("./Damage");

const { Physical } = Damage.Types;
const { Magical } = Damage.Types;
const { Biological } = Damage.Types;

const ModHitPointConfigs = {
    PlayerMelee: {
        damageAmount: 10,
        damageTypes: [Physical],
    },

    ProjIronArrow: {
        damageAmount: 14,
        damageTypes: [Physical],
        damageArmourPiercing: 15,
    },
    ProjDungiumArrow: {
        damageAmount: 16,
        damageTypes: [Physical],
        damageArmourPiercing: 20,
    },
    ProjNoctisArrow: {
        damageAmount: 18,
        damageTypes: [Physical],
        damageArmourPiercing: 25,
    },

    ProjIronDagger: {
        damageAmount: 8,
        damageTypes: [Physical],
    },
    ProjDungiumDagger: {
        damageAmount: 10,
        damageTypes: [Physical],
    },
    ProjNoctisDagger: {
        damageAmount: 12,
        damageTypes: [Physical],
    },

    ProjCopperSword: {
        damageAmount: 16,
        damageTypes: [Physical],
    },
    ProjIronSword: {
        damageAmount: 20,
        damageTypes: [Physical],
    },
    ProjDungiumSword: {
        damageAmount: 24,
        damageTypes: [Physical],
    },
    ProjNoctisSword: {
        damageAmount: 28,
        damageTypes: [Physical],
    },

    ProjIronHammer: {
        damageAmount: 20,
        damageTypes: [Physical],
    },
    ProjDungiumHammer: {
        damageAmount: 24,
        damageTypes: [Physical],
    },
    ProjNoctisHammer: {
        damageAmount: 28,
        damageTypes: [Physical],
    },
    ProjHammerOfGlory: {
        damageAmount: 32,
        damageTypes: [Physical],
    },

    ProjShuriken: {
        damageAmount: 20,
        damageTypes: [Physical],
    },
    ProjSnowball: {
        damageAmount: 8,
        damageTypes: [Physical],
    },
    ProjAcorn: {
        damageAmount: 16,
        damageTypes: [Physical],
    },
    ProjVampireFang: {
        damageAmount: 20,
        damageTypes: [Physical, Biological],
    },

    ProjBloodBolt: {
        damageAmount: 20,
        damageTypes: [Magical, Biological],
        healAmount: 20,
    },
    ProjWind: {
        damageAmount: 6,
        damageTypes: [Magical],
    },
    ProjDark: {
        damageAmount: 20,
        damageTypes: [Magical],
    },

    BookOfLightHealArea: {
        healAmount: 20,
    },
    BookOfSoulsConsume: {
        healAmount: 40,
    },

    Spikes: {
        damageAmount: 10,
        damageTypes: [Physical],
        damageArmourPiercing: 50,
    },

    Burn: {
        damageAmount: 10,
        damageTypes: [Physical, Magical],
        damageArmourPiercing: 50,
    },
    Poison: {
        damageAmount: 5,
        damageTypes: [Biological],
        damageArmourPiercing: 100,
    },
    Disease: {
        damageAmount: 3,
        damageTypes: [Biological],
        damageArmourPiercing: 100,
    },
    HealthRegen: {
        healAmount: 10,
    },
};

module.exports = ModHitPointConfigs;
