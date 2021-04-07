const Item = require("./Item");

class PitKey extends Item {
    use() {
        this.useGatheringTool();
    }
}

module.exports = PitKey;
