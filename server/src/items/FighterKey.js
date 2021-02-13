const Item = require("./Item");

class FighterKey extends Item {
    use() {
        this.useGatheringTool();
    }
}

module.exports = FighterKey;
