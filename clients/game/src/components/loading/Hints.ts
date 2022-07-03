import github from '../../assets/images/misc/hints/github.png';
// import bat from '../../assets/images/misc/hints/bat.png';
import cave from '../../assets/images/misc/hints/vampire-island-cave.png';
// import banditLeader from '../../assets/images/misc/hints/bandit-leader.png';
import stats from '../../assets/images/misc/hints/stats.png';
import craftingHammer from '../../assets/images/misc/hints/crafting-hammer.png';
import discord from '../../assets/images/misc/hints/discord.png';
import bluecaps from '../../assets/images/misc/hints/bluecaps.png';
import redcaps from '../../assets/images/misc/hints/redcaps.png';
// import sharedGlory from '../../assets/images/misc/hints/shared-glory.png';

interface Hint {
    image: string;

    textDefId: string;
}

const Hints: Array<Hint> = [
    { image: github.src, textDefId: 'Open source' },
    // {image: bat.src, textDefId: 'Night creatures'},
    { image: cave.src, textDefId: 'Resource rarity' },
    // {image: banditLeader.src, textDefId: 'Overworld bosses'},
    { image: stats.src, textDefId: 'Stat level inventory weight' },
    { image: craftingHammer.src, textDefId: 'Crafting stat bonus' },
    { image: discord.src, textDefId: 'Join discord' },
    { image: bluecaps.src, textDefId: 'Bluecaps location' },
    { image: redcaps.src, textDefId: 'Redcaps location' },
    // {image: sharedGlory.src, textDefId: 'Shared glory'},
];

export default Hints;
