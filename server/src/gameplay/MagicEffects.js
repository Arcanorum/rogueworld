class MagicEffect {
    /**
     * @param {Character} character - What this magic effect will affect.
     */
    constructor(character) {
        /** @type {Character} The character entity that this magic effect is affecting. */
        this.character = character;

        this.timeout = setTimeout(this.onTimeUp.bind(this), this.duration);
    }

    remove() {
        this.character = null;

        clearTimeout(this.timeout);
    }

    /**
     * @returns {Boolean} - Whether the caller should continue processing.
     */
    onCharacterDamaged() { }

    /**
     * @returns {Boolean} - Whether the caller should continue processing.
     */
    onCharacterDeath() { }

    /**
     * @returns {Boolean} - Whether the caller should continue processing.
     */
    onCharacterAttack() { }

    onTimeUp() {
        this.remove();
    }

}
MagicEffect.prototype.duration = 10000;

class Curse extends MagicEffect {
    constructor(character) {
        super(character);

        if (this.character.curse === null) {
            // The character didn't already have a curse, so tell all nearby players this now has one.
            this.character.board.emitToNearbyPlayers(this.character.row, this.character.col, this.character.EventsList.curse_set, this.character.id);
        }
        this.character.curse = this;
    }

    remove() {
        this.character.curse = null;
        // TODO: this effect should have been removed already before the board is nulled on the char, but board is sometimes null already...
        // this check is just a temp hack around the problem :/
        if(this.character.board){
            this.character.board.emitToNearbyPlayers(this.character.row, this.character.col, this.character.EventsList.curse_removed, this.character.id);
        }
        super.remove();
    }
}

class Enchantment extends MagicEffect {
    constructor(character) {
        super(character);

        if (this.character.enchantment === null) {
            // The character didn't already have an enchantment, so tell all nearby players this now has one.
            this.character.board.emitToNearbyPlayers(this.character.row, this.character.col, this.character.EventsList.enchantment_set, this.character.id);
        }
        this.character.enchantment = this;
    }

    remove() {
        this.character.enchantment = null;
        if(this.character.board){
            this.character.board.emitToNearbyPlayers(this.character.row, this.character.col, this.character.EventsList.enchantment_removed, this.character.id);
        }
        super.remove();
    }

}

class Ward extends Enchantment {
    constructor(character) {
        super(character);
    }

    onCharacterDamaged() {
        this.remove();
        return false;
    }
}
Ward.prototype.duration = 300000; // 5 mins.

class Pacify extends Curse {
    constructor(character) {
        super(character);
    }

    onCharacterAttack() {
        return false;
    }
}

class Deathbind extends Curse {
    constructor(character) {
        super(character);
    }

    onCharacterDeath() {
        if (this.character.CorpseType !== null) new this.character.CorpseType.prototype.ZombieType({ row: this.character.row, col: this.character.col, board: this.character.board }).emitToNearbyPlayers();
        this.remove();
        return false;
    }
}
Deathbind.prototype.duration = 300000; // 5 mins.

const MagicEffects = {
    Ward: Ward,
    Pacify: Pacify,
    Deathbind: Deathbind,
};

module.exports = MagicEffects;