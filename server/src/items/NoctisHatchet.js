const Item = require("./Item");

class NoctisHatchet extends Item {
    use() {
        this.useGatheringTool();
    }
}

module.exports = NoctisHatchet;
