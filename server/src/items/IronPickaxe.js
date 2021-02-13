const Item = require("./Item");

class IronPickaxe extends Item {
    use() {
        this.useGatheringTool();
    }
}

module.exports = IronPickaxe;
