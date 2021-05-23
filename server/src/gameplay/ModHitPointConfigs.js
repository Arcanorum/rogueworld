const Damage = require("./Damage");

const { Physical } = Damage.Types;
const { Magical } = Damage.Types;
const { Biological } = Damage.Types;

const ModHitPointConfigs = {
    PlayerMelee: {
        damageAmount: 5,
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
    ProjAgoniteArrow: {
        damageAmount: 18,
        damageTypes: [Physical],
        damageArmourPiercing: 25,
    },
    ProjNoctisArrow: {
        damageAmount: 20,
        damageTypes: [Physical],
        damageArmourPiercing: 30,
    },

    ProjWoodenClub: {
        damageAmount: 8,
        damageTypes: [Physical],
    },

    ProjIronDagger: {
        damageAmount: 8,
        damageTypes: [Physical],
    },
    ProjDungiumDagger: {
        damageAmount: 9,
        damageTypes: [Physical],
    },
    ProjAgoniteDagger: {
        damageAmount: 10,
        damageTypes: [Physical],
    },
    ProjNoctisDagger: {
        damageAmount: 11,
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
    ProjAgoniteSword: {
        damageAmount: 28,
        damageTypes: [Physical],
    },
    ProjNoctisSword: {
        damageAmount: 32,
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
    ProjAgoniteHammer: {
        damageAmount: 28,
        damageTypes: [Physical],
    },
    ProjNoctisHammer: {
        damageAmount: 32,
        damageTypes: [Physical],
    },
    ProjHammerOfGlory: {
        damageAmount: 32,
        damageTypes: [Physical],
    },

    ProjBoneHatchet: {
        damageAmount: 6,
        damageTypes: [Physical],
    },
    ProjIronHatchet: {
        damageAmount: 8,
        damageTypes: [Physical],
    },
    ProjDungiumHatchet: {
        damageAmount: 9,
        damageTypes: [Physical],
    },
    ProjAgoniteHatchet: {
        damageAmount: 10,
        damageTypes: [Physical],
    },
    ProjNoctisHatchet: {
        damageAmount: 11,
        damageTypes: [Physical],
    },
    ProjBonePickaxe: {
        damageAmount: 6,
        damageTypes: [Physical],
    },
    ProjIronPickaxe: {
        damageAmount: 8,
        damageTypes: [Physical],
    },
    ProjDungiumPickaxe: {
        damageAmount: 9,
        damageTypes: [Physical],
    },
    ProjAgonitePickaxe: {
        damageAmount: 10,
        damageTypes: [Physical],
    },
    ProjNoctisPickaxe: {
        damageAmount: 11,
        damageTypes: [Physical],
    },
    ProjIronSickle: {
        damageAmount: 8,
        damageTypes: [Physical],
    },
    ProjDungiumSickle: {
        damageAmount: 9,
        damageTypes: [Physical],
    },
    ProjAgoniteSickle: {
        damageAmount: 10,
        damageTypes: [Physical],
    },
    ProjNoctisSickle: {
        damageAmount: 11,
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

    SpellScrollHealArea: {
        healAmount: 20,
    },
    ConsumeSpellScroll: {
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
