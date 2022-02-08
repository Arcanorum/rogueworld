import GroundTile from './GroundTile';
import * as status_effects from '../gameplay/status_effects';
import DamageTypes from '../gameplay/DamageTypes';

const { Physical } = DamageTypes;
const { Burn, Chill, HealthRegen, Poison } = status_effects;

const Empty = new GroundTile({ name: 'Empty', canBeStoodOn: false });
const Path = new GroundTile({ name: 'Path' });
const Grass = new GroundTile({ name: 'Grass', canBeBuiltOn: true });
const Dirt = new GroundTile({ name: 'Dirt', canBeBuiltOn: true });
const Snow = new GroundTile({ name: 'Snow', canBeBuiltOn: true, statusEffects: [ Chill ] });
const ShallowWater = new GroundTile({ name: 'ShallowWater', canBeBuiltOn: false });
const DeepWater = new GroundTile({ name: 'DeepWater', canBeStoodOn: false, canBeBuiltOn: false });
const Blood = new GroundTile({ name: 'Blood', canBeBuiltOn: false, statusEffects: [ HealthRegen ] });
const Lava = new GroundTile({ name: 'Lava', statusEffects: [ Burn ] });
const Sewage = new GroundTile({ name: 'Sewage', statusEffects: [ Poison ] });
const Spikes = new GroundTile({
    name: 'Spikes',
    damageConfig: {
        amount: 10,
        types: [ Physical ],
        penetration: 50,
    },
});

export {
    Empty,
    Path,
    Grass,
    Dirt,
    Snow,
    ShallowWater,
    DeepWater,
    Blood,
    Lava,
    Sewage,
    Spikes,
};
