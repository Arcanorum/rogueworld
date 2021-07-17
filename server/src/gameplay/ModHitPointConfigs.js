const Damage = require("./Damage");

const { Physical, Magical, Biological } = Damage.Types;

const ModHitPointConfigs = {
    PlayerMelee: {
        damageAmount: 5,
        damageTypes: [Physical],
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
