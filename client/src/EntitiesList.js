
/**
 * Starts this sprite doing a bobbing in-out effect, mostly for pickups.
 */
Phaser.Sprite.prototype.tweenPickupFromCenter = function () {
    this.anchor.setTo(0.5);
    this.x += dungeonz.CENTER_OFFSET;
    this.y += dungeonz.CENTER_OFFSET;
    _this.add.tween(this.scale).to({x: this.scale.x * 0.8, y: this.scale.y * 0.8}, 1000, "Linear", true, 0, -1, true);
};

Phaser.Sprite.prototype.onChangeDirection = function () {
};

/**
 * Show the damage marker, with the amount of damage taken.
 * @param {String|Number} amount
 */
Phaser.Sprite.prototype.onHitPointsModified = function (amount) {
    if(amount < 0){
        this.damageMarker.addColor('#ff2f00', 0);
    }
    else {
        this.damageMarker.addColor('#6abe30', 0);
        amount = '+' + amount;
    }

    this.damageMarker.visible = true;
    this.damageMarker.text = amount;

    // If there is already a previous damage marker waiting to be hidden,
    // stop that timer and start a new one for this damage event.
    if(this.damageMarkerDisappearTimeout !== null){
        clearTimeout(this.damageMarkerDisappearTimeout);
    }

    var that = this;
    // Start a timeout to hide the damage marker.
    this.damageMarkerDisappearTimeout = setTimeout(function () {
        that.damageMarker.visible = false;
        that.damageMarkerDisappearTimeout = null;
    }, 800);
};

Phaser.Sprite.prototype.onInputOver = function () {
    this.displayName.visible = true;
};

Phaser.Sprite.prototype.onInputOut = function () {
    this.displayName.visible = false;
};

/*Phaser.Sprite.prototype.onInputDown = function () {
    console.log("default oninputdown");
};*/

/**
 * Add a text object to this sprite to use as the damage indicator.
 */
Phaser.Sprite.prototype.addDamageMarker = function () {
    this.damageMarker = _this.add.text(dungeonz.TILE_SIZE / 2, dungeonz.TILE_SIZE / 2, -99, {
        font: "20px Press Start 2P",
        align: "center",
        fill: "#f5f5f5",
        stroke: "#000000",
        strokeThickness: 5
    });
    this.damageMarker.anchor.set(0.5);
    this.damageMarker.scale.set(0.2);
    this.damageMarker.visible = false;
    this.addChild(this.damageMarker);
    this.damageMarkerDisappearTimeout = null;
};

/**
 * Add a text object to this sprite to use as the display name.
 * @param {String} displayName
 */
Phaser.Sprite.prototype.addDisplayName = function (displayName) {
    // The anchor is still in the top left, so offset by half the width to center the text.
    this.displayName = _this.add.text(dungeonz.TILE_SIZE / 2, 4, displayName, {
        font: "20px Press Start 2P",
        align: "center",
        fill: (this.displayNameColor&&this.displayNameColor.fill)?this.displayNameColor.fill:"#f5f5f5",
        stroke: (this.displayNameColor&&this.displayNameColor.stroke)?this.displayNameColor.stroke:"#000000",
        strokeThickness: (this.displayNameColor&&this.displayNameColor.strokeThickness)?this.displayNameColor.strokeThickness:5
    });
    this.displayName.anchor.set(0.5, 1);
    this.displayName.scale.set(0.25);
    this.addChild(this.displayName);
    this.displayName.visible = false;
};

// function requireAll(r) {
//     try {
//         console.log("required:", r);
//         const keys = r.keys();
//         console.log("  keys:", keys);
//         keys.forEach((key) => {

//              require.context('./', true, /\.js$/)
            
//         });
//     }
//     catch(err){
//         console.log(err);
//     }
    
// }

console.log("before require all");

const allFiles = (ctx => {
    let keys = ctx.keys();
    let values = keys.map(ctx);
    console.log("vals:", values);
    return keys.reduce((object, key, index) => {
        key = key.split("/").pop().slice(0, -3);
        object[key] = values[index];
        return object;
    }, {});
})(require.context('./entities/', true, /.js$/));

//requireAll();
//console.log("after require all, all:", allFiles);



/*import Player                   from './characters/Player'

import ArenaMaster              from './characters/ArenaMaster'
import Assassin                 from './characters/Assassin'
import Bandit                   from './characters/Bandit'
import BanditLeader             from './characters/BanditLeader'
import Bat                      from './characters/Bat'
import BloodLord                from './characters/BloodLord'
import BloodPriest              from './characters/BloodPriest'
import Citizen                  from './characters/Citizen'
import Commander                from './characters/Commander'
import CryptWarden              from './characters/CryptWarden'
import DwarfWeaponMerchant      from './characters/DwarfWeaponMerchant'
import GnarlOak                 from './characters/GnarlOak'
import Goblin                   from './characters/Goblin'
import GrassScamp               from './characters/GrassScamp'
import GreatGnarl               from './characters/GreatGnarl'
import Hawk                     from './characters/Hawk'
import Innkeeper                from './characters/Innkeeper'
import Knight                   from './characters/Knight'
import MagicMerchant            from './characters/MagicMerchant'
import MasterAssassin           from './characters/MasterAssassin'
import MeleeMerchant            from './characters/MeleeMerchant'
import Mummy                    from './characters/Mummy'
import OmniMerchant             from './characters/OmniMerchant'
import Pharaoh                  from './characters/Pharaoh'
import PriestMerchant           from './characters/PriestMerchant'
import Prisoner                 from './characters/Prisoner'
import RangedMerchant           from './characters/RangedMerchant'
import Rat                      from './characters/Rat'
import Ruler                    from './characters/Ruler'
import SandScamp                from './characters/SandScamp'
import Snoovir                  from './characters/Snoovir'
import ToolMerchant             from './characters/ToolMerchant'
import TutorialMerchant         from './characters/TutorialMerchant'
import Vampire                  from './characters/Vampire'
import Warrior                  from './characters/Warrior'
import ZombieHuman              from './characters/ZombieHuman'

import CorpseHuman              from './corpses/CorpseHuman'

//import Anvil                    from './interactables/Anvil'
//import BankChest                from './interactables/BankChest'
//import Charter                  from './interactables/Charter'
//import WoodWall                 from './interactables/WoodWall'
//import Furnace                  from './interactables/Furnace'
//import Generator                from './interactables/Generator'
//import Workbench                from './interactables/Workbench'
//import CottonPlant              from './interactables/CottonPlant'
//import DungiumOre               from './interactables/DungiumOre'
//import IronOre                  from './interactables/IronOre'
//import OakTree                  from './interactables/OakTree'
//import WoodDoor                 from './interactables/WoodDoor'
//import WoodDoorLockedBlue       from './interactables/WoodDoorLockedBlue'
//import WoodDoorLockedGreen      from './interactables/WoodDoorLockedGreen'
//import WoodDoorLockedRed        from './interactables/WoodDoorLockedRed'
//import WoodDoorLockedYellow     from './interactables/WoodDoorLockedYellow'
//import SmallIronCandle          from './interactables/SmallIronCandle'
//import Exit                     from './interactables/Exit'
//import DungeonPortal            from './interactables/DungeonPortal'
//import OverworldPortal          from './interactables/OverworldPortal'

import PickupAnvil              from './pickups/PickupAnvil'
import PickupBankChest          from './pickups/PickupBankChest'
import PickupBloodGem           from './pickups/PickupBloodGem'
import PickupBloodStaff         from './pickups/PickupBloodStaff'
import PickupBluecap            from './pickups/PickupBluecap'
import PickupBlueKey            from './pickups/PickupBlueKey'
import PickupBookOfLight        from './pickups/PickupBookOfLight'
import PickupBookOfSouls        from './pickups/PickupBookOfSouls'
import PickupCharter            from './pickups/PickupCharter'
import PickupCloak              from './pickups/PickupCloak'
import PickupCotton             from './pickups/PickupCotton'
import PickupCurePotion         from './pickups/PickupCurePotion'
import PickupDungiumArmour      from './pickups/PickupDungiumArmour'
import PickupDungiumArrows      from './pickups/PickupDungiumArrows'
import PickupDungiumBar         from './pickups/PickupDungiumBar'
import PickupDungiumDagger      from './pickups/PickupDungiumDagger'
import PickupDungiumHammer      from './pickups/PickupDungiumHammer'
import PickupDungiumHatchet     from './pickups/PickupDungiumHatchet'
import PickupDungiumOre         from './pickups/PickupDungiumOre'
import PickupDungiumPickaxe     from './pickups/PickupDungiumPickaxe'
import PickupDungiumRod         from './pickups/PickupDungiumRod'
import PickupDungiumSheet       from './pickups/PickupDungiumSheet'
import PickupDungiumSword       from './pickups/PickupDungiumSword'
import PickupEnergyPotion       from './pickups/PickupEnergyPotion'
import PickupExpOrbArmoury      from './pickups/PickupExpOrbArmoury'
import PickupExpOrbGathering    from './pickups/PickupExpOrbGathering'
import PickupExpOrbMagic        from './pickups/PickupExpOrbMagic'
import PickupExpOrbMelee        from './pickups/PickupExpOrbMelee'
import PickupExpOrbPotionry     from './pickups/PickupExpOrbPotionry'
import PickupExpOrbRanged       from './pickups/PickupExpOrbRanged'
import PickupExpOrbToolery      from './pickups/PickupExpOrbToolery'
import PickupExpOrbWeaponry     from './pickups/PickupExpOrbWeaponry'
import PickupFabric             from './pickups/PickupFabric'
import PickupFeathers           from './pickups/PickupFeathers'
import PickupFighterKey         from './pickups/PickupFighterKey'
import PickupFireGem            from './pickups/PickupFireGem'
import PickupFireStaff          from './pickups/PickupFireStaff'
import PickupFurnace            from './pickups/PickupFurnace'
import PickupGenerator          from './pickups/PickupGenerator'
import PickupGreenKey           from './pickups/PickupGreenKey'
import PickupGreencap           from './pickups/PickupGreencap'
import PickupHealthPotion       from './pickups/PickupHealthPotion'
import PickupIronArmour         from './pickups/PickupIronArmour'
import PickupIronArrows         from './pickups/PickupIronArrows'
import PickupIronBar            from './pickups/PickupIronBar'
import PickupIronDagger         from './pickups/PickupIronDagger'
import PickupIronHammer         from './pickups/PickupIronHammer'
import PickupIronHatchet        from './pickups/PickupIronHatchet'
import PickupIronOre            from './pickups/PickupIronOre'
import PickupIronPickaxe        from './pickups/PickupIronPickaxe'
import PickupIronRod            from './pickups/PickupIronRod'
import PickupIronSheet          from './pickups/PickupIronSheet'
import PickupIronSword          from './pickups/PickupIronSword'
import PickupMageRobe           from './pickups/PickupMageRobe'
import PickupNecromancerRobe    from './pickups/PickupNecromancerRobe'
import PickupNinjaGarb          from './pickups/PickupNinjaGarb'
import PickupNoctisArmour       from './pickups/PickupNoctisArmour'
import PickupNoctisArrows       from './pickups/PickupNoctisArrows'
import PickupNoctisBar          from './pickups/PickupNoctisBar'
import PickupNoctisDagger       from './pickups/PickupNoctisDagger'
import PickupNoctisHammer       from './pickups/PickupNoctisHammer'
import PickupNoctisHatchet      from './pickups/PickupNoctisHatchet'
import PickupNoctisOre          from './pickups/PickupNoctisOre'
import PickupNoctisPickaxe      from './pickups/PickupNoctisPickaxe'
import PickupNoctisRod          from './pickups/PickupNoctisRod'
import PickupNoctisSheet        from './pickups/PickupNoctisSheet'
import PickupNoctisSword        from './pickups/PickupNoctisSword'
import PickupOakBow             from './pickups/PickupOakBow'
import PickupOakLogs            from './pickups/PickupOakLogs'
import PickupPitKey             from './pickups/PickupPitKey'
import PickupPlainRobe          from './pickups/PickupPlainRobe'
import PickupRedcap             from './pickups/PickupRedcap'
import PickupRedKey             from './pickups/PickupRedKey'
import PickupRespawnOrb         from './pickups/PickupRespawnOrb'
import PickupShuriken           from './pickups/PickupShuriken'
import PickupString             from './pickups/PickupString'
import PickupSuperBloodStaff    from './pickups/PickupSuperBloodStaff'
import PickupSuperFireStaff     from './pickups/PickupSuperFireStaff'
import PickupSuperWindStaff     from './pickups/PickupSuperWindStaff'
import PickupVampireFang        from './pickups/PickupVampireFang'
import PickupWindGem            from './pickups/PickupWindGem'
import PickupWindStaff          from './pickups/PickupWindStaff'
import PickupWoodDoor           from './pickups/PickupWoodDoor'
import PickupWoodWall           from './pickups/PickupWoodWall'
import PickupWorkbench          from './pickups/PickupWorkbench'
import PickupYellowKey          from './pickups/PickupYellowKey'

import ProjAcorn                from './projectiles/ProjAcorn'
import ProjBloodBolt            from './projectiles/ProjBloodBolt'
import ProjDeathbind            from './projectiles/ProjDeathbind'
import ProjDungiumArrow         from './projectiles/ProjDungiumArrow'
import ProjDungiumDagger        from './projectiles/ProjDungiumDagger'
import ProjDungiumHammer        from './projectiles/ProjDungiumHammer'
import ProjDungiumSword         from './projectiles/ProjDungiumSword'
import ProjFire                 from './projectiles/ProjFire'
import ProjIronArrow            from './projectiles/ProjIronArrow'
import ProjIronDagger           from './projectiles/ProjIronDagger'
import ProjIronHammer           from './projectiles/ProjIronHammer'
import ProjIronSword            from './projectiles/ProjIronSword'
import ProjNoctisArrow          from './projectiles/ProjNoctisArrow'
import ProjNoctisDagger         from './projectiles/ProjNoctisDagger'
import ProjNoctisHammer         from './projectiles/ProjNoctisHammer'
import ProjNoctisSword          from './projectiles/ProjNoctisSword'
import ProjPacify               from './projectiles/ProjPacify'
import ProjShuriken             from './projectiles/ProjShuriken'
import ProjSnowball             from './projectiles/ProjSnowball'
import ProjSuperBloodBolt       from './projectiles/ProjSuperBloodBolt'
import ProjSuperFire            from './projectiles/ProjSuperFire'
import ProjSuperWind            from './projectiles/ProjSuperWind'
import ProjVampireFang          from './projectiles/ProjVampireFang'
import ProjWind                 from './projectiles/ProjWind'*/

/**
 * A list of all client display entities that can be created.
 * @type {Object}
 */
const EntitiesList = allFiles;

/*{

    Player:                 Player,
    ArenaMaster:            ArenaMaster,
    Assassin:               Assassin,
    Bandit:                 Bandit,
    BanditLeader:           BanditLeader,
    Bat:                    Bat,
    BloodLord:              BloodLord,
    BloodPriest:            BloodPriest,
    Citizen:                Citizen,
    Commander:              Commander,
    CryptWarden:            CryptWarden,
    DwarfWeaponMerchant:    DwarfWeaponMerchant,
    GnarlOak:               GnarlOak,
    Goblin:                 Goblin,
    GrassScamp:             GrassScamp,
    GreatGnarl:             GreatGnarl,
    Hawk:                   Hawk,
    Innkeeper:              Innkeeper,
    Knight:                 Knight,
    MagicMerchant:          MagicMerchant,
    MasterAssassin:         MasterAssassin,
    MeleeMerchant:          MeleeMerchant,
    Mummy:                  Mummy,
    OmniMerchant:           OmniMerchant,
    Pharaoh:                Pharaoh,
    PriestMerchant:         PriestMerchant,
    Prisoner:               Prisoner,
    RangedMerchant:         RangedMerchant,
    Rat:                    Rat,
    Ruler:                  Ruler,
    SandScamp:              SandScamp,
    Snoovir:                Snoovir,
    ToolMerchant:           ToolMerchant,
    TutorialMerchant:       TutorialMerchant,
    Vampire:                Vampire,
    Warrior:                Warrior,
    ZombieHuman:            ZombieHuman,

    CorpseHuman:            CorpseHuman,

    //Anvil:                  Anvil,
    //BankChest:              BankChest,
    //Charter:                Charter,
    //WoodWall:               WoodWall,
    //Furnace:                Furnace,
    //Generator:              Generator,
    //Workbench:              Workbench,
    //CottonPlant:            CottonPlant,
    //DungiumOre:             DungiumOre,
    //IronOre:                IronOre,
    //OakTree:                OakTree,
    //WoodDoor:               WoodDoor,
    //WoodDoorLockedBlue:     WoodDoorLockedBlue,
    //WoodDoorLockedGreen:    WoodDoorLockedGreen,
    //WoodDoorLockedRed:      WoodDoorLockedRed,
    //WoodDoorLockedYellow:   WoodDoorLockedYellow,
    //SmallIronCandle:        SmallIronCandle,

    PickupAnvil:            PickupAnvil,
    PickupBankChest:        PickupBankChest,
    PickupBloodGem:         PickupBloodGem,
    PickupBloodStaff:       PickupBloodStaff,
    PickupBluecap:          PickupBluecap,
    PickupBlueKey:          PickupBlueKey,
    PickupBookOfLight:      PickupBookOfLight,
    PickupBookOfSouls:      PickupBookOfSouls,
    PickupCharter:          PickupCharter,
    PickupCloak:            PickupCloak,
    PickupCotton:           PickupCotton,
    PickupCurePotion:       PickupCurePotion,
    PickupDungiumArmour:    PickupDungiumArmour,
    PickupDungiumArrows:    PickupDungiumArrows,
    PickupDungiumBar:       PickupDungiumBar,
    PickupDungiumDagger:    PickupDungiumDagger,
    PickupDungiumHammer:    PickupDungiumHammer,
    PickupDungiumHatchet:   PickupDungiumHatchet,
    PickupDungiumOre:       PickupDungiumOre,
    PickupDungiumPickaxe:   PickupDungiumPickaxe,
    PickupDungiumRod:       PickupDungiumRod,
    PickupDungiumSheet:     PickupDungiumSheet,
    PickupDungiumSword:     PickupDungiumSword,
    PickupEnergyPotion:     PickupEnergyPotion,
    PickupExpOrbArmoury:    PickupExpOrbArmoury,
    PickupExpOrbGathering:  PickupExpOrbGathering,
    PickupExpOrbMagic:      PickupExpOrbMagic,
    PickupExpOrbMelee:      PickupExpOrbMelee,
    PickupExpOrbPotionry:   PickupExpOrbPotionry,
    PickupExpOrbRanged:     PickupExpOrbRanged,
    PickupExpOrbToolery:    PickupExpOrbToolery,
    PickupExpOrbWeaponry:   PickupExpOrbWeaponry,
    PickupFabric:           PickupFabric,
    PickupFeathers:         PickupFeathers,
    PickupFighterKey:       PickupFighterKey,
    PickupFireGem:          PickupFireGem,
    PickupFireStaff:        PickupFireStaff,
    PickupFurnace:          PickupFurnace,
    PickupGenerator:        PickupGenerator,
    PickupGreencap:         PickupGreencap,
    PickupGreenKey:         PickupGreenKey,
    PickupHealthPotion:     PickupHealthPotion,
    PickupIronArmour:       PickupIronArmour,
    PickupIronArrows:       PickupIronArrows,
    PickupIronBar:          PickupIronBar,
    PickupIronDagger:       PickupIronDagger,
    PickupIronHammer:       PickupIronHammer,
    PickupIronHatchet:      PickupIronHatchet,
    PickupIronOre:          PickupIronOre,
    PickupIronPickaxe:      PickupIronPickaxe,
    PickupIronRod:          PickupIronRod,
    PickupIronSheet:        PickupIronSheet,
    PickupIronSword:        PickupIronSword,
    PickupMageRobe:         PickupMageRobe,
    PickupNecromancerRobe:  PickupNecromancerRobe,
    PickupNinjaGarb:        PickupNinjaGarb,
    PickupNoctisArmour:     PickupNoctisArmour,
    PickupNoctisArrows:     PickupNoctisArrows,
    PickupNoctisBar:        PickupNoctisBar,
    PickupNoctisDagger:     PickupNoctisDagger,
    PickupNoctisHammer:     PickupNoctisHammer,
    PickupNoctisHatchet:    PickupNoctisHatchet,
    PickupNoctisOre:        PickupNoctisOre,
    PickupNoctisPickaxe:    PickupNoctisPickaxe,
    PickupNoctisRod:        PickupNoctisRod,
    PickupNoctisSheet:      PickupNoctisSheet,
    PickupNoctisSword:      PickupNoctisSword,
    PickupOakBow:           PickupOakBow,
    PickupOakLogs:          PickupOakLogs,
    PickupPitKey:           PickupPitKey,
    PickupPlainRobe:        PickupPlainRobe,
    PickupRedcap:           PickupRedcap,
    PickupRedKey:           PickupRedKey,
    PickupRespawnOrb:       PickupRespawnOrb,
    PickupShuriken:         PickupShuriken,
    PickupString:           PickupString,
    PickupSuperBloodStaff:  PickupSuperBloodStaff,
    PickupSuperFireStaff:   PickupSuperFireStaff,
    PickupSuperWindStaff:   PickupSuperWindStaff,
    PickupVampireFang:      PickupVampireFang,
    PickupWindGem:          PickupWindGem,
    PickupWindStaff:        PickupWindStaff,
    PickupWoodDoor:         PickupWoodDoor,
    PickupWoodWall:         PickupWoodWall,
    PickupWorkbench:        PickupWorkbench,
    PickupYellowKey:        PickupYellowKey,

    ProjAcorn:              ProjAcorn,
    ProjBloodBolt:          ProjBloodBolt,
    ProjDeathbind:          ProjDeathbind,
    ProjDungiumArrow:       ProjDungiumArrow,
    ProjDungiumDagger:      ProjDungiumDagger,
    ProjDungiumHammer:      ProjDungiumHammer,
    ProjDungiumSword:       ProjDungiumSword,
    ProjFire:               ProjFire,
    ProjIronArrow:          ProjIronArrow,
    ProjIronDagger:         ProjIronDagger,
    ProjIronHammer:         ProjIronHammer,
    ProjIronSword:          ProjIronSword,
    ProjNoctisArrow:        ProjNoctisArrow,
    ProjNoctisDagger:       ProjNoctisDagger,
    ProjNoctisHammer:       ProjNoctisHammer,
    ProjNoctisSword:        ProjNoctisSword,
    ProjPacify:             ProjPacify,
    ProjShuriken:           ProjShuriken,
    ProjSnowball:           ProjSnowball,
    ProjSuperBloodBolt:     ProjSuperBloodBolt,
    ProjSuperFire:          ProjSuperFire,
    ProjSuperWind:          ProjSuperWind,
    ProjVampireFang:        ProjVampireFang,
    ProjWind:               ProjWind,

};*/

export default EntitiesList;