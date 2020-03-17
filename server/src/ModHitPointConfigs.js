const Damage = require('./Damage');

const Physical = Damage.Types.Physical;
const Magical = Damage.Types.Magical;
const Biological = Damage.Types.Biological;

const ModHitPointConfigs = {

    ProjIronArrow: {
        damageAmount: 6,
        damageTypes: [Physical],
        damageArmourPiercing: 15
    },
    ProjDungiumArrow: {
        damageAmount: 7,
        damageTypes: [Physical],
        damageArmourPiercing: 20
    },
    ProjNoctisArrow: {
        damageAmount: 9,
        damageTypes: [Physical],
        damageArmourPiercing: 25
    },

    ProjIronDagger: {
        damageAmount: 4,
        damageTypes: [Physical]
    },
    ProjDungiumDagger: {
        damageAmount: 5,
        damageTypes: [Physical]
    },
    ProjNoctisDagger: {
        damageAmount: 6,
        damageTypes: [Physical]
    },

    ProjIronSword: {
        damageAmount: 10,
        damageTypes: [Physical]
    },
    ProjDungiumSword: {
        damageAmount: 12,
        damageTypes: [Physical]
    },
    ProjNoctisSword: {
        damageAmount: 15,
        damageTypes: [Physical]
    },

    ProjIronHammer: {
        damageAmount: 10,
        damageTypes: [Physical]
    },
    ProjDungiumHammer: {
        damageAmount: 12,
        damageTypes: [Physical]
    },
    ProjNoctisHammer: {
        damageAmount: 15,
        damageTypes: [Physical]
    },

    ProjShuriken: {
        damageAmount: 10,
        damageTypes: [Physical]
    },
    ProjSnowball: {
        damageAmount: 4,
        damageTypes: [Physical]
    },
    ProjAcorn: {
        damageAmount: 8,
        damageTypes: [Physical]
    },
    ProjVampireFang: {
        damageAmount: 10,
        damageTypes: [Physical, Biological]
    },

    ProjBloodBolt: {
        damageAmount: 15,
        damageTypes: [Magical, Biological],
        healAmount: 10
    },
    ProjWind: {
        damageAmount: 5,
        damageTypes: [Magical]
    },

    BookOfLightHealArea: {
        healAmount: 20
    },
    BookOfSoulsConsume: {
        healAmount: 40
    },

    Spikes: {
        damageAmount: 10,
        damageTypes: [Physical],
        damageArmourPiercing: 50
    },

    Burn: {
        damageAmount: 10,
        damageTypes: [Physical, Magical]
    },
    Poison: {
        damageAmount: 5,
        damageTypes: [Biological]
    },
    Disease: {
        damageAmount: 3,
        damageTypes: [Biological]
    },
    HealthRegen: {
        healAmount: 5
    }

};

module.exports = ModHitPointConfigs;