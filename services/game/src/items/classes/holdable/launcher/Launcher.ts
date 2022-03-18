import Holdable from '../Holdable';

class Bow extends Holdable {
    checkUseCriteria() {
        // Check there is some ammunition equipped.
        if (this.owner.ammunition) return false;

        return super.checkUseCriteria();
    }

    // /**
    //  * Use this bow. Typically creates a projectile.
    //  * @param {String} direction - A specific direction to use the item in. Otherwise uses the owner's direction.
    //  */
    // onUsedWhileHeld(direction) {
    //     // Use the projectile type of the equipped arrows.
    //     this.ProjectileType = this.owner.ammunition.ProjectileType;

    //     // Keep this at the bottom otherwise the item might be broken and destroyed when the durability is updated, so the above stuff will get buggy.
    //     super.onUsedWhileHeld(direction);
    // }

    // onUsed() {
    //     // The ammunition equipped is also used when the bow is.
    //     this.owner.ammunition.onUsed();

    //     super.onUsed();
    // }
}

Bow.abstract = true;

module.exports = Bow;
