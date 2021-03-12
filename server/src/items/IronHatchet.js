const Item = require("./Item");

class IronHatchet extends Item {
    use() {
        this.useGatheringTool();
    }
}

module.exports = IronHatchet;
