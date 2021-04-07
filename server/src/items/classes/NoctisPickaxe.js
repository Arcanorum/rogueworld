const Item = require("./Item");

class NoctisPickaxe extends Item {
    use() {
        this.useGatheringTool();
    }
}

module.exports = NoctisPickaxe;
