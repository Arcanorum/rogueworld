const Item = require("./Item");

class DungiumPickaxe extends Item {
    use() {
        this.useGatheringTool();
    }
}

module.exports = DungiumPickaxe;
