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

class Hint {
    image: string;
    textDefId: string;

    constructor(image: string, textDefId: string) {
        this.image = image;
        this.textDefId = textDefId;
    }
}

const Hints = [
    new Hint(github.src, 'Open source'),
    // new Hint(bat.src, 'Night creatures'),
    new Hint(cave.src, 'Resource rarity'),
    // new Hint(banditLeader.src, 'Overworld bosses'),
    new Hint(stats.src, 'Stat level inventory weight'),
    new Hint(craftingHammer.src, 'Crafting stat bonus'),
    new Hint(discord.src, 'Join discord'),
    new Hint(bluecaps.src, 'Bluecaps location'),
    new Hint(redcaps.src, 'Redcaps location'),
    // new Hint(sharedGlory.src, 'Shared glory'),
];

export default Hints;
