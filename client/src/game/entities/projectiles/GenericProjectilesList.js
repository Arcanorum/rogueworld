import EntityTypes from "../../../catalogues/EntityTypes.json";
import Projectile from "./Projectile";

/**
 * Creates a generic class for a projectile based on the Projectile class.
 * @param {Object} config
 * @param {String} config.frameName - The name of the texture (in the game atlas) to use for this sprite.
 * @param {Number} [config.scaleModifier=1] - A multiplier to scale the sprite by, after also being scaled to GAME_SCALE.
 */
const makeClass = (config) => {
    class GenericProjectile extends Projectile { }
    GenericProjectile.prototype.frameName = `proj-${config.frameName}`;
    if (config.spinDuration) GenericProjectile.prototype.spinDuration = config.spinDuration;
    if (config.scaleModifier) GenericProjectile.prototype.scaleModifier = config.scaleModifier;
    return GenericProjectile;
};

/**
 * A list of projectiles that have their class created on startup, instead of being in a dedicated class file.
 * Avoids having many class files that are exactly the same (apart from specifying the texture frame).
 * A projectile type can still have it's own class file if it needs to do something special.
 * Just make a JS file for it in /entities/projectiles (it must be prefixed with "Proj", i.e. "ProjIronSword")
 * and then extend the Projectile class in it.
 */
export default Object.values(EntityTypes).reduce((accumulator, entityType) => {
    if (!entityType.typeName.startsWith("Proj")) return accumulator;

    if (!entityType.textureFrames) return accumulator;

    accumulator[entityType.typeName] = makeClass({
        frameName: entityType.textureFrames,
        spinDuration: entityType.spinDuration,
        scaleModifier: entityType.scaleModifier,
    });

    return accumulator;
}, {});
