import Pickup from "./Pickup";

/**
 * Creates a generic class for a pickup based on the Pickup class.
 * @param {Object} config
 * @param {String} config.frameName - The name of the texture (in the game atlas) to use for this sprite.
 * @param {Number} [config.scaleModifier=1] - A multiplier to scale the sprite by, after also being scaled to GAME_SCALE.
 */
const makeClass = (config) => {
    class GenericPickup extends Pickup { }
    GenericPickup.prototype.frameName = "pickup-" + config.frameName;
    GenericPickup.prototype.scaleModifier = config.scaleModifier;
    return GenericPickup;
};

/**
 * A list of pickup items that have their class created on startup, instead of being in a dedicated class file.
 * Avoids having many class files that are exactly the same (apart from specifying the texture frame).
 * A pickup type can still have it's own class file if it needs to do something special.
 * Just make a JS file for it in /entities/pickups (it must be prefixed with "Pickup", i.e. "PickupIronSword") and extend the Pickup class in it.
 */
export default {
    Anvil: makeClass({ frameName: "anvil" }),
    ArmorOfIre: makeClass({ frameName: "dungium-armour" }),
    BankChest: makeClass({ frameName: "bank-chest" }),
    BloodGem: makeClass({ frameName: "blood-gem" }),
    BloodStaff: makeClass({ frameName: "blood-staff" }),
    Bluecap: makeClass({ frameName: "bluecap" }),
    BookOfLight: makeClass({ frameName: "book-of-light" }),
    BookOfSouls: makeClass({ frameName: "book-of-souls" }),
    Charter: makeClass({ frameName: "charter" }),
    Cloak: makeClass({ frameName: "cloak" }),
    CopperSword: makeClass({ frameName: "copper-sword" }),
    Cotton: makeClass({ frameName: "cotton" }),
    CurePotion: makeClass({ frameName: "cure-potion" }),
    DungiumArmour: makeClass({ frameName: "dungium-armour" }),
    DungiumArrows: makeClass({ frameName: "dungium-arrows" }),
    DungiumBar: makeClass({ frameName: "dungium-bar" }),
    DungiumDagger: makeClass({ frameName: "dungium-dagger" }),
    DungiumHammer: makeClass({ frameName: "dungium-hammer" }),
    DungiumHatchet: makeClass({ frameName: "dungium-hatchet" }),
    DungiumOre: makeClass({ frameName: "dungium-ore" }),
    DungiumPickaxe: makeClass({ frameName: "dungium-pickaxe" }),
    DungiumRod: makeClass({ frameName: "dungium-rod" }),
    DungiumSheet: makeClass({ frameName: "dungium-sheet" }),
    DungiumSword: makeClass({ frameName: "dungium-sword" }),
    EnergyPotion: makeClass({ frameName: "energy-potion" }),
    EternalFlame: makeClass({ frameName: "super-fire-staff" }), // TODO: rename to inferno?
    ExpOrbArmoury: makeClass({ frameName: "exp-orb" }),
    ExpOrbGathering: makeClass({ frameName: "exp-orb" }),
    ExpOrbMagic: makeClass({ frameName: "exp-orb" }),
    ExpOrbMelee: makeClass({ frameName: "exp-orb" }),
    ExpOrbPotionry: makeClass({ frameName: "exp-orb" }),
    ExpOrbRanged: makeClass({ frameName: "exp-orb" }),
    ExpOrbToolery: makeClass({ frameName: "exp-orb" }),
    ExpOrbWeaponry: makeClass({ frameName: "exp-orb" }),
    Fabric: makeClass({ frameName: "fabric", scaleModifier: 0.8 }),
    Feathers: makeClass({ frameName: "feathers", scaleModifier: 0.8 }),
    FighterKey: makeClass({ frameName: "fighter-key" }),
    FirBow: makeClass({ frameName: "oak-bow" }),
    FireGem: makeClass({ frameName: "fire-gem" }),
    FireStaff: makeClass({ frameName: "fire-staff" }),
    Furnace: makeClass({ frameName: "furnace" }),
    Generator: makeClass({ frameName: "generator" }),
    Greencap: makeClass({ frameName: "greencap" }),
    HammerOfGlory: makeClass({ frameName: "noctis-hammer" }),
    HealthPotion: makeClass({ frameName: "health-potion" }),
    IronArmour: makeClass({ frameName: "iron-armour" }),
    IronArrows: makeClass({ frameName: "iron-arrows" }),
    IronBar: makeClass({ frameName: "iron-bar" }),
    IronDagger: makeClass({ frameName: "iron-dagger" }),
    IronHammer: makeClass({ frameName: "iron-hammer" }),
    IronHatchet: makeClass({ frameName: "iron-hatchet" }),
    IronOre: makeClass({ frameName: "iron-ore" }),
    IronPickaxe: makeClass({ frameName: "iron-pickaxe" }),
    IronRod: makeClass({ frameName: "iron-rod" }),
    IronSheet: makeClass({ frameName: "iron-sheet" }),
    IronSword: makeClass({ frameName: "iron-sword" }),
    MageRobe: makeClass({ frameName: "mage-robe" }),
    NecromancerRobe: makeClass({ frameName: "necromancer-robe" }),
    NinjaGarb: makeClass({ frameName: "ninja-garb" }),
    NoctisArmour: makeClass({ frameName: "noctis-armour" }),
    NoctisArrows: makeClass({ frameName: "noctis-arrows" }),
    NoctisBar: makeClass({ frameName: "noctis-bar" }),
    NoctisDagger: makeClass({ frameName: "noctis-dagger" }),
    NoctisHammer: makeClass({ frameName: "noctis-hammer" }),
    NoctisHatchet: makeClass({ frameName: "noctis-hatchet" }),
    NoctisOre: makeClass({ frameName: "noctis-ore" }),
    NoctisPickaxe: makeClass({ frameName: "noctis-pickaxe" }),
    NoctisRod: makeClass({ frameName: "noctis-rod" }),
    NoctisSheet: makeClass({ frameName: "noctis-sheet" }),
    NoctisSword: makeClass({ frameName: "noctis-sword" }),
    OakBow: makeClass({ frameName: "oak-bow" }),
    OakLogs: makeClass({ frameName: "oak-logs" }),
    PitKey: makeClass({ frameName: "pit-key" }),
    PlainRobe: makeClass({ frameName: "plain-robe" }),
    Redcap: makeClass({ frameName: "redcap" }),
    Shuriken: makeClass({ frameName: "shuriken" }),
    Stormcaller: makeClass({ frameName: "super-wind-staff" }), // TODO: rename to tempest?
    String: makeClass({ frameName: "string" }),
    SuperBloodStaff: makeClass({ frameName: "super-blood-staff" }),
    SuperFireStaff: makeClass({ frameName: "super-fire-staff" }),
    SuperWindStaff: makeClass({ frameName: "super-wind-staff" }),
    VampireFang: makeClass({ frameName: "vampire-fang" }),
    WindGem: makeClass({ frameName: "wind-gem" }),
    WindStaff: makeClass({ frameName: "wind-staff" }),
    WoodDoor: makeClass({ frameName: "wood-door" }),
    WoodPlank: makeClass({ frameName: "wood-plank", scaleModifier: 0.8 }),
    WoodWall: makeClass({ frameName: "wood-wall" }),
    Workbench: makeClass({ frameName: "workbench" }),
};