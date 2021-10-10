import github from "../../assets/images/misc/hints/github.png";
import bat from "../../assets/images/misc/hints/bat.png";
import cave from "../../assets/images/misc/hints/vampire-island-cave.png";
import dungeonPortal from "../../assets/images/misc/hints/dungeon-portal.png";
import banditLeader from "../../assets/images/misc/hints/bandit-leader.png";
import stats from "../../assets/images/misc/hints/stats.png";
import craftingHammer from "../../assets/images/misc/hints/crafting-hammer.png";
import discord from "../../assets/images/misc/hints/discord.png";
import dungeonDoor from "../../assets/images/misc/hints/dungeon-door.png";
import bluecaps from "../../assets/images/misc/hints/bluecaps.png";
import redcaps from "../../assets/images/misc/hints/redcaps.png";
import sharedGlory from "../../assets/images/misc/hints/shared-glory.png";

class Hint {
    constructor(image, textDefId) {
        this.image = image;
        this.textDefId = textDefId;
    }
}

const Hints = [
    new Hint(github, "Open source"),
    new Hint(bat, "Night creatures"),
    new Hint(cave, "Resource rarity"),
    new Hint(dungeonPortal, "Dungeon portals"),
    new Hint(banditLeader, "Overworld bosses"),
    new Hint(stats, "Stat level inventory weight"),
    new Hint(craftingHammer, "Crafting stat bonus"),
    new Hint(discord, "Join discord"),
    new Hint(dungeonDoor, "Dungeon doors"),
    new Hint(bluecaps, "Bluecaps location"),
    new Hint(redcaps, "Redcaps location"),
    new Hint(sharedGlory, "Shared glory"),
];

export default Hints;
