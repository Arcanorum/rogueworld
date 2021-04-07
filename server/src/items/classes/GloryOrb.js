const Item = require("./Item");

class GloryOrb extends Item {
    onUsed() {
        this.owner.modGlory(500);

        super.onUsed();
    }
}

module.exports = GloryOrb;
