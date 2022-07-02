import GroundTile from './GroundTile';
import * as status_effects from '../gameplay/status_effects';
import DamageTypes from '../gameplay/DamageTypes';

export type GroundTypeName =
    'Empty' |
    'PlayerSpawn' |
    'Path' |
    'Grass' |
    'Dirt' |
    'Snow' |
    'ShallowWater' |
    'DeepWater' |
    'Blood' |
    'Lava' |
    'Sewage' |
    'Spikes';

const { Physical } = DamageTypes;
const {
    Burn, Chill, HealthRegen, Poison,
} = status_effects;

const Empty = new GroundTile();
const PlayerSpawn = new GroundTile();
const Path = new GroundTile();
const Grass = new GroundTile();
const Dirt = new GroundTile();
const Snow = new GroundTile();
const ShallowWater = new GroundTile();
const DeepWater = new GroundTile();
const Blood = new GroundTile();
const Lava = new GroundTile();
const Sewage = new GroundTile();
const Spikes = new GroundTile();

const init = () => {
    Empty.init({ name: 'Empty', canBeStoodOn: false });
    PlayerSpawn.init({ name: 'PlayerSpawn' });
    Path.init({ name: 'Path' });
    Grass.init({ name: 'Grass', canBeBuiltOn: true, gatherItemTypeName: 'Clay' });
    Dirt.init({ name: 'Dirt', canBeBuiltOn: true });
    Snow.init({ name: 'Snow', canBeBuiltOn: true, statusEffects: [Chill] });
    ShallowWater.init({ name: 'ShallowWater' });
    DeepWater.init({ name: 'DeepWater', canBeStoodOn: false });
    Blood.init({ name: 'Blood', statusEffects: [HealthRegen] });
    Lava.init({ name: 'Lava', statusEffects: [Burn] });
    Sewage.init({ name: 'Sewage', statusEffects: [Poison] });
    Spikes.init({
        name: 'Spikes',
        damageConfig: {
            amount: 10,
            types: [Physical],
            penetration: 50,
        },
    });
};

export {
    init,
    Empty,
    PlayerSpawn,
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
