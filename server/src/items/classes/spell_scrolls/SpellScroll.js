const Item = require("../Item");

class SpellScroll extends Item {
    onUsed() {
        console.log("SpellScroll used")
        super.onUsed();
    }
}


SpellScroll.abstract = true;
// Give all spell scrolls easy access to the list of magic effects.
SpellScroll.prototype.MagicEffects = require("../../../gameplay/MagicEffects");

module.exports = SpellScroll;
