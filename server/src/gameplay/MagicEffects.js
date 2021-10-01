const Damage = require("./Damage");
const ModHitPointConfigs = require("./ModHitPointConfigs");

class MagicEffect {
    /**
     * @param {Object} config
     * @param {Character} config.character - What this magic effect will affect.
     * @param {Entity} [config.source=null] - The thing that caused this magic effect.
     */
    constructor(config) {
        /** @type {Character} The character entity that this magic effect is affecting. */
        this.character = config.character;

        /** @type {Entity} The source entity that this magic effect originates from. */
        this.source = config.source || null;

        this.timeout = setTimeout(this.onTimeUp.bind(this), this.duration);
    }

    remove() {
        this.character = null;

        this.source = null;

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
    constructor(config) {
        if (config.character.curse) config.character.curse.remove();

        super(config);

        if (this.character.curse === null) {
            // The character didn't already have a curse, so tell all nearby players this now has one.
            this.character.board.emitToNearbyPlayers(
                this.character.row,
                this.character.col,
                this.character.EventsList.curse_set,
                this.character.id,
            );
        }
        this.character.curse = this;
    }

    remove() {
        this.character.curse = null;
        // TODO: this effect should have been removed already before the board is nulled on the char, but board is sometimes null already...
        // this check is just a temp hack around the problem :/
        if (this.character.board) {
            this.character.board.emitToNearbyPlayers(
                this.character.row,
                this.character.col,
                this.character.EventsList.curse_removed,
                this.character.id,
            );
        }
        super.remove();
    }
}

class Enchantment extends MagicEffect {
    constructor(config) {
        if (config.character.enchantment) config.character.enchantment.remove();

        super(config);

        if (this.character.enchantment === null) {
            // The character didn't already have an enchantment, so tell all nearby players this now has one.
            this.character.board.emitToNearbyPlayers(
                this.character.row,
                this.character.col,
                this.character.EventsList.enchantment_set,
                this.character.id,
            );
        }
        this.character.enchantment = this;
    }

    remove() {
        this.character.enchantment = null;
        if (this.character.board) {
            this.character.board.emitToNearbyPlayers(
                this.character.row,
                this.character.col,
                this.character.EventsList.enchantment_removed,
                this.character.id,
            );
        }
        super.remove();
    }
}

class Ward extends Enchantment {
    onCharacterDamaged() {
        this.remove();
        return false;
    }
}
Ward.prototype.duration = 300000; // 5 mins.

class Pacify extends Curse {
    onCharacterAttack() {
        return false;
    }

    onCharacterDamaged() {
        this.remove();
        return true;
    }
}

class Deathbind extends Curse {
    onCharacterDeath() {
        if (this.character.CorpseType !== null) {
            new this.character.CorpseType.prototype.ZombieType({
                row: this.character.row,
                col: this.character.col,
                board: this.character.board,
            }).emitToNearbyPlayers();
        }
        this.remove();
        return false;
    }
}
Deathbind.prototype.duration = 300000; // 5 mins.

class IllOmen extends Curse {
    onTimeUp() {
        this.character.damage(new Damage({
            amount: ModHitPointConfigs.IllOmen.damageAmount,
            types: ModHitPointConfigs.IllOmen.damageTypes,
            armourPiercing: ModHitPointConfigs.IllOmen.damageArmourPiercing,
        }), this.source);

        // Check the character still has this curse applied, as they might have died from the above
        // damage and thus had their curse removed.
        if (this.character && this.character.curse === this) {
            super.onTimeUp();
        }
    }
}
IllOmen.prototype.duration = 4000;

const MagicEffects = {
    Ward,
    Pacify,
    Deathbind,
    IllOmen,
};

module.exports = MagicEffects;
