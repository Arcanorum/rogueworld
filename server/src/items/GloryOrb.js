const Item = require("./Item");

class GloryOrb extends Item {
    onUsed() {
        this.owner.modGlory(1000);

        super.onUsed();
    }
}

module.exports = GloryOrb;
