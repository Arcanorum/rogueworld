
const GroundTile = require('./GroundTile');
const StatusEffects = require('./StatusEffects');
const ModHitPointValues = require('./ModHitPointValues');

const GroundTypes = {

    Empty:          new GroundTile('Empty',     0, false),

    Path:           new GroundTile('Path'),
    Grass:          new GroundTile('Grass',     0, true, true),
    Dirt:           new GroundTile('Dirt',      0, true, true),
    ShallowWater:   new GroundTile('ShallowWater', 0),
    DeepWater:      new GroundTile('DeepWater', 0, false),
    Blood:          new GroundTile('Blood',     0, true, false, StatusEffects.HealthRegen),
    Lava:           new GroundTile('Lava',      0, true, false, StatusEffects.Burn),
    Poison:         new GroundTile('Poison',    0, true, false, StatusEffects.Poison),
    Spikes:         new GroundTile('Spikes',    ModHitPointValues.Spikes),

};

module.exports = GroundTypes;