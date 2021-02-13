const Item = require("./Item");

class Bluecap extends Item {
    onUsed() {
        this.owner.modEnergy(1);

        super.onUsed();
    }
}

module.exports = Bluecap;
