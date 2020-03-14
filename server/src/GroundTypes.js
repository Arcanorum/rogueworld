const GroundTile = require('./GroundTile');
const StatusEffects = require('./StatusEffects');
const ModHitPointValues = require('./ModHitPointValues');

const GroundTypes = {

    Empty:          new GroundTile({name: 'Empty', canBeStoodOn: false}),
    
    Path:           new GroundTile({name: 'Path'}),
    Grass:          new GroundTile({name: 'Grass', canBeBuiltOn: true}),
    Dirt:           new GroundTile({name: 'Dirt', canBeBuiltOn: true}),
    ShallowWater:   new GroundTile({name: 'ShallowWater', canBeBuiltOn: false}),
    DeepWater:      new GroundTile({name: 'DeepWater', canBeStoodOn: false, canBeBuiltOn: false}),
    Blood:          new GroundTile({name: 'Blood', canBeBuiltOn: false, StatusEffect: StatusEffects.HealthRegen}),
    Lava:           new GroundTile({name: 'Lava', StatusEffect: StatusEffects.Burn}),
    Poison:         new GroundTile({name: 'Poison', StatusEffect: StatusEffects.Poison}),
    Spikes:         new GroundTile({name: 'Spikes',
        damageConfig: {
            amount: ModHitPointValues.Spikes.damageAmount,
            types: ModHitPointValues.Spikes.damageTypes,
            armourPiercing: ModHitPointValues.Spikes.damageArmourPiercing
        }}),

};

module.exports = GroundTypes;