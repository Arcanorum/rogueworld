const Item = require("./Item");

class DungiumHatchet extends Item {
    use() {
        this.useGatheringTool();
    }
}

module.exports = DungiumHatchet;
