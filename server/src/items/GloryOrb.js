const Item = require("./Item");

class GloryOrb extends Item {
    onUsed() {
        this.owner.modGlory(1000);

        super.onUsed();
    }
}

GloryOrb.translationID = "Glory orb";
GloryOrb.iconSource = "icon-glory-orb";
GloryOrb.prototype.baseDurability = 1;
GloryOrb.prototype.useDurabilityCost = 1;

module.exports = GloryOrb;
