const Utils = require("../../../Utils");
const Holdable = require("../Holdable");

class SpellBook extends Holdable {
    constructor(config) {
        super(config);

        /**
         * The function to be called when a spell is cast.
         * @type {Function}
         */
        this.currentSpell = this.spell1;
    }

    equip() {
        super.equip();

        if (this.owner.holding === this) {
            // Tell the player a spell book was equipped, so they should show the button to open the spell book panel.
            this.owner.socket.sendEvent(this.owner.EventsList.activate_spell_book, [this.slotKey, this.spellBookTypeNumber]);
        }
    }

    useWhileHeld(direction) {
        const { owner } = this;

        if (owner.energy < this.useEnergyCost) {
            return;
        }

        const front = owner.board.getRowColInFront(direction || owner.direction, owner.row, owner.col);

        // Cast the current spell, giving it a config object.
        this.currentSpell({
            row: front.row, col: front.col, board: owner.board, direction: direction || owner.direction, source: this.owner,
        });

        owner.modEnergy(-this.useEnergyCost);

        // Keep this at the bottom otherwise the item might be broken and destroyed when the durability is updated, so the above stuff will get buggy.
        super.useWhileHeld(direction || owner.direction);
    }

    /**
     * Change the active selected spell.
     * @param {String|Number} spellNumber - The 1-4 number of the spell to change to.
     */
    changeSpell(spellNumber) {
        // Check the spell exists. Might be invalid input.
        if (this[`spell${spellNumber}`] === undefined) return;

        this.currentSpell = this[`spell${spellNumber}`];
    }

    spell1() { }

    spell2() { }

    spell3() { }

    spell4() { }
}

SpellBook.abstract = true;

// Give all spell books easy access to the list of magic effects.
SpellBook.prototype.MagicEffects = require("../../../gameplay/MagicEffects");

/**
 * The ID of this spell in the language text definitions file.
 * Just the spell name itself, which is added onto the "Spell name: " prefix to get the actual ID.
 * @type {String}
 */
SpellBook.prototype.spell1IdName = "Spell 1 ID name not set.";
SpellBook.prototype.spell2IdName = "Spell 2 ID name not set.";
SpellBook.prototype.spell3IdName = "Spell 3 ID name not set.";
SpellBook.prototype.spell4IdName = "Spell 4 ID name not set.";

SpellBook.prototype.spell1IconSource = "Spell 1 icon source not set.";
SpellBook.prototype.spell2IconSource = "Spell 2 icon source not set.";
SpellBook.prototype.spell3IconSource = "Spell 3 icon source not set.";
SpellBook.prototype.spell4IconSource = "Spell 4 icon source not set.";

SpellBook.prototype.useEnergyCost = 3;

let spellBookTypeNumberCounter = 1;
// A type number is an ID for this kind of book, so the client knows which icons and info to add to the spell book panel.
// Used to send a number to get the spell book name from the spell book type catalogue, instead of a lengthy string of the item name.
// All spell books that appear on the client must be registered with SpellBook.prototype.registerSpellBookType().
SpellBook.prototype.spellBookTypeNumber = "Spell book type not registered.";

SpellBook.prototype.registerSpellBookType = function () {
    this.spellBookTypeNumber = spellBookTypeNumberCounter;

    spellBookTypeNumberCounter += 1;

    // Utils.message("Registering spell book type: ", this);
};

module.exports = SpellBook;
