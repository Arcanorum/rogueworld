
const Weapon = require('../Weapon');

class Bow extends Weapon {

    /**
     * Use this weapon. Typically creates a projectile.
     * @param {String} direction - A specific direction to use the item in. Otherwise uses the owner's direction.
     */
    useWhileHeld (direction) {
        // Check there is some ammunition equipped.
        if(this.owner.ammunition === null) return;

        // Use the projectile type of the equipped arrows.
        this.ProjectileType = this.owner.ammunition.ProjectileType;

        // Keep this at the bottom otherwise the item might be broken and destroyed when the durability is updated, so the above stuff will get buggy.
        super.useWhileHeld(direction);
    }

    onUsed () {
        // The ammunition equipped is also used when the bow is.
        this.owner.ammunition.onUsed();

        super.onUsed();
    }

}

module.exports = Bow;