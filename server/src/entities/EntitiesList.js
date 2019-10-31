
// Mob values are defined at https://docs.google.com/spreadsheets/d/1Hzu-qrflnSssyDC2sUa4ipaGjBGKccUAgGeO83yqw-A/edit#gid=0

const EntitiesList = {

    Entity:                 require('./Entity'),

    // Spawners
    SpawnerArea:            require('./spawners/SpawnerArea'),
    SpawnerTotem:           require('./spawners/SpawnerTotem'),

    // Destroyables

    // Destroyables - Corpses
    Corpse:                 require('./destroyables/corpses/Corpse'),
    CorpseHuman:            require('./destroyables/corpses/CorpseHuman'),

    // Destroyables - Movables

    // Destroyables - Movables - Characters
    Character:              require('./destroyables/movables/characters/Character'),
    Player:                 require('./destroyables/movables/characters/Player'),

    // Destroyables - Movables - Characters - Mobs
    Assassin:               require('./destroyables/movables/characters/mobs/Assassin'),
    Bandit:                 require('./destroyables/movables/characters/mobs/Bandit'),
    BanditLeader:           require('./destroyables/movables/characters/mobs/BanditLeader'),
    Bat:                    require('./destroyables/movables/characters/mobs/Bat'),
    BloodLord:              require('./destroyables/movables/characters/mobs/BloodLord'),
    BloodPriest:            require('./destroyables/movables/characters/mobs/BloodPriest'),
    Citizen:                require('./destroyables/movables/characters/mobs/Citizen'),
    Commander:              require('./destroyables/movables/characters/mobs/Commander'),
    CryptWarden:            require('./destroyables/movables/characters/mobs/CryptWarden'),
    GnarlOak:               require('./destroyables/movables/characters/mobs/GnarlOak'),
    Goblin:                 require('./destroyables/movables/characters/mobs/Goblin'),
    GrassScamp:             require('./destroyables/movables/characters/mobs/GrassScamp'),
    GreatGnarl:             require('./destroyables/movables/characters/mobs/GreatGnarl'),
    Hawk:                   require('./destroyables/movables/characters/mobs/Hawk'),
    Knight:                 require('./destroyables/movables/characters/mobs/Knight'),
    MasterAssassin:         require('./destroyables/movables/characters/mobs/MasterAssassin'),
    Mummy:                  require('./destroyables/movables/characters/mobs/Mummy'),
    Pharaoh:                require('./destroyables/movables/characters/mobs/Pharaoh'),
    Prisoner:               require('./destroyables/movables/characters/mobs/Prisoner'),
    Rat:                    require('./destroyables/movables/characters/mobs/Rat'),
    SandScamp:              require('./destroyables/movables/characters/mobs/SandScamp'),
    Snoovir:                require('./destroyables/movables/characters/mobs/Snoovir'),
    Vampire:                require('./destroyables/movables/characters/mobs/Vampire'),
    Warrior:                require('./destroyables/movables/characters/mobs/Warrior'),
    ArenaMaster:            require('./destroyables/movables/characters/mobs/traders/ArenaMaster'),
    DwarfWeaponMerchant:    require('./destroyables/movables/characters/mobs/traders/DwarfWeaponMerchant'),
    Innkeeper:              require('./destroyables/movables/characters/mobs/traders/Innkeeper'),
    MagicMerchant:          require('./destroyables/movables/characters/mobs/traders/MagicMerchant'),
    MeleeMerchant:          require('./destroyables/movables/characters/mobs/traders/MeleeMerchant'),
    OmniMerchant:           require('./destroyables/movables/characters/mobs/traders/OmniMerchant'),
    PriestMerchant:         require('./destroyables/movables/characters/mobs/traders/PriestMerchant'),
    RangedMerchant:         require('./destroyables/movables/characters/mobs/traders/RangedMerchant'),
    //Ruler:                  require('./destroyables/movables/characters/mobs/traders/Ruler'),
    ToolMerchant:           require('./destroyables/movables/characters/mobs/traders/ToolMerchant'),
    TutorialMerchant:       require('./destroyables/movables/characters/mobs/traders/TutorialMerchant'),

    // Destroyables - Movables - Characters - Mobs - Zombies
    Zombie:                 require('./destroyables/movables/characters/mobs/zombies/Zombie'),
    ZombieHuman:            require('./destroyables/movables/characters/mobs/zombies/ZombieHuman'),

    // Destroyables - Movables - Projectiles
    ProjAcorn:              require('./destroyables/movables/projectiles/ProjAcorn'),
    ProjBloodBolt:          require('./destroyables/movables/projectiles/ProjBloodBolt'),
    ProjDeathbind:          require('./destroyables/movables/projectiles/ProjDeathbind'),
    ProjDungiumArrow:       require('./destroyables/movables/projectiles/ProjDungiumArrow'),
    ProjDungiumDagger:      require('./destroyables/movables/projectiles/ProjDungiumDagger'),
    ProjDungiumHammer:      require('./destroyables/movables/projectiles/ProjDungiumHammer'),
    ProjDungiumSword:       require('./destroyables/movables/projectiles/ProjDungiumSword'),
    ProjFire:               require('./destroyables/movables/projectiles/ProjFire'),
    ProjIronArrow:          require('./destroyables/movables/projectiles/ProjIronArrow'),
    ProjIronDagger:         require('./destroyables/movables/projectiles/ProjIronDagger'),
    ProjIronHammer:         require('./destroyables/movables/projectiles/ProjIronHammer'),
    ProjIronSword:          require('./destroyables/movables/projectiles/ProjIronSword'),
    ProjNoctisArrow:        require('./destroyables/movables/projectiles/ProjNoctisArrow'),
    ProjNoctisDagger:       require('./destroyables/movables/projectiles/ProjNoctisDagger'),
    ProjNoctisHammer:       require('./destroyables/movables/projectiles/ProjNoctisHammer'),
    ProjNoctisSword:        require('./destroyables/movables/projectiles/ProjNoctisSword'),
    ProjPacify:             require('./destroyables/movables/projectiles/ProjPacify'),
    ProjShuriken:           require('./destroyables/movables/projectiles/ProjShuriken'),
    ProjSnowball:           require('./destroyables/movables/projectiles/ProjSnowball'),
    ProjSuperBloodBolt:     require('./destroyables/movables/projectiles/ProjSuperBloodBolt'),
    ProjSuperFire:          require('./destroyables/movables/projectiles/ProjSuperFire'),
    ProjSuperWind:          require('./destroyables/movables/projectiles/ProjSuperWind'),
    ProjVampireFang:        require('./destroyables/movables/projectiles/ProjVampireFang'),
    ProjWind:               require('./destroyables/movables/projectiles/ProjWind'),

    // Destroyables - Pickups
    //PickupAnvil:            require('./destroyables/pickups/PickupAnvil'),
    //PickupBankChest:        require('./destroyables/pickups/PickupBankChest'),
    PickupBloodGem:         require('./destroyables/pickups/PickupBloodGem'),
    PickupBloodStaff:       require('./destroyables/pickups/PickupBloodStaff'),
    PickupBluecap:          require('./destroyables/pickups/PickupBluecap'),
    PickupBlueKey:          require('./destroyables/pickups/PickupBlueKey'),
    PickupBookOfLight:      require('./destroyables/pickups/PickupBookOfLight'),
    PickupBookOfSouls:      require('./destroyables/pickups/PickupBookOfSouls'),
    //PickupCharter:          require('./destroyables/pickups/PickupCharter'),
    PickupCloak:            require('./destroyables/pickups/PickupCloak'),
    PickupCotton:           require('./destroyables/pickups/PickupCotton'),
    PickupCurePotion:       require('./destroyables/pickups/PickupCurePotion'),
    PickupDungiumArmour:    require('./destroyables/pickups/PickupDungiumArmour'),
    PickupDungiumArrows:    require('./destroyables/pickups/PickupDungiumArrows'),
    PickupDungiumBar:       require('./destroyables/pickups/PickupDungiumBar'),
    PickupDungiumDagger:    require('./destroyables/pickups/PickupDungiumDagger'),
    PickupDungiumHammer:    require('./destroyables/pickups/PickupDungiumHammer'),
    PickupDungiumHatchet:   require('./destroyables/pickups/PickupDungiumHatchet'),
    PickupDungiumOre:       require('./destroyables/pickups/PickupDungiumOre'),
    PickupDungiumPickaxe:   require('./destroyables/pickups/PickupDungiumPickaxe'),
    PickupDungiumRod:       require('./destroyables/pickups/PickupDungiumRod'),
    PickupDungiumSheet:     require('./destroyables/pickups/PickupDungiumSheet'),
    PickupDungiumSword:     require('./destroyables/pickups/PickupDungiumSword'),
    PickupEnergyPotion:     require('./destroyables/pickups/PickupEnergyPotion'),
    PickupExpOrbArmoury:    require('./destroyables/pickups/PickupExpOrbArmoury'),
    PickupExpOrbGathering:  require('./destroyables/pickups/PickupExpOrbGathering'),
    PickupExpOrbMagic:      require('./destroyables/pickups/PickupExpOrbMagic'),
    PickupExpOrbMelee:      require('./destroyables/pickups/PickupExpOrbMelee'),
    PickupExpOrbPotionry:   require('./destroyables/pickups/PickupExpOrbPotionry'),
    PickupExpOrbRanged:     require('./destroyables/pickups/PickupExpOrbRanged'),
    PickupExpOrbToolery:    require('./destroyables/pickups/PickupExpOrbToolery'),
    PickupExpOrbWeaponry:   require('./destroyables/pickups/PickupExpOrbWeaponry'),
    PickupFabric:           require('./destroyables/pickups/PickupFabric'),
    PickupFeathers:         require('./destroyables/pickups/PickupFeathers'),
    PickupFighterKey:       require('./destroyables/pickups/PickupFighterKey'),
    PickupFireGem:          require('./destroyables/pickups/PickupFireGem'),
    PickupFireStaff:        require('./destroyables/pickups/PickupFireStaff'),
    //PickupFurnace:          require('./destroyables/pickups/PickupFurnace'),
    //PickupGenerator:        require('./destroyables/pickups/PickupGenerator'),
    PickupGreencap:         require('./destroyables/pickups/PickupGreencap'),
    PickupGreenKey:         require('./destroyables/pickups/PickupGreenKey'),
    PickupHealthPotion:     require('./destroyables/pickups/PickupHealthPotion'),
    PickupIronArmour:       require('./destroyables/pickups/PickupIronArmour'),
    PickupIronArrows:       require('./destroyables/pickups/PickupIronArrows'),
    PickupIronBar:          require('./destroyables/pickups/PickupIronBar'),
    PickupIronDagger:       require('./destroyables/pickups/PickupIronDagger'),
    PickupIronHammer:       require('./destroyables/pickups/PickupIronHammer'),
    PickupIronHatchet:      require('./destroyables/pickups/PickupIronHatchet'),
    PickupIronOre:          require('./destroyables/pickups/PickupIronOre'),
    PickupIronPickaxe:      require('./destroyables/pickups/PickupIronPickaxe'),
    PickupIronRod:          require('./destroyables/pickups/PickupIronRod'),
    PickupIronSheet:        require('./destroyables/pickups/PickupIronSheet'),
    PickupIronSword:        require('./destroyables/pickups/PickupIronSword'),
    PickupMageRobe:         require('./destroyables/pickups/PickupMageRobe'),
    PickupNecromancerRobe:  require('./destroyables/pickups/PickupNecromancerRobe'),
    PickupNinjaGarb:        require('./destroyables/pickups/PickupNinjaGarb'),
    PickupNoctisArmour:     require('./destroyables/pickups/PickupNoctisArmour'),
    PickupNoctisArrows:     require('./destroyables/pickups/PickupNoctisArrows'),
    PickupNoctisBar:        require('./destroyables/pickups/PickupNoctisBar'),
    PickupNoctisDagger:     require('./destroyables/pickups/PickupNoctisDagger'),
    PickupNoctisHammer:     require('./destroyables/pickups/PickupNoctisHammer'),
    PickupNoctisHatchet:    require('./destroyables/pickups/PickupNoctisHatchet'),
    PickupNoctisOre:        require('./destroyables/pickups/PickupNoctisOre'),
    PickupNoctisPickaxe:    require('./destroyables/pickups/PickupNoctisPickaxe'),
    PickupNoctisRod:        require('./destroyables/pickups/PickupNoctisRod'),
    PickupNoctisSheet:      require('./destroyables/pickups/PickupNoctisSheet'),
    PickupNoctisSword:      require('./destroyables/pickups/PickupNoctisSword'),
    PickupOakBow:           require('./destroyables/pickups/PickupOakBow'),
    PickupOakLogs:          require('./destroyables/pickups/PickupOakLogs'),
    PickupPitKey:           require('./destroyables/pickups/PickupPitKey'),
    PickupPlainRobe:        require('./destroyables/pickups/PickupPlainRobe'),
    PickupRedcap:           require('./destroyables/pickups/PickupRedcap'),
    PickupRedKey:           require('./destroyables/pickups/PickupRedKey'),
    PickupRespawnOrb:       require('./destroyables/pickups/PickupRespawnOrb'),
    PickupShuriken:         require('./destroyables/pickups/PickupShuriken'),
    PickupString:           require('./destroyables/pickups/PickupString'),
    PickupSuperFireStaff:   require('./destroyables/pickups/PickupSuperFireStaff'),
    PickupSuperWindStaff:   require('./destroyables/pickups/PickupSuperWindStaff'),
    PickupSuperBloodStaff:  require('./destroyables/pickups/PickupSuperBloodStaff'),
    PickupVampireFang:      require('./destroyables/pickups/PickupVampireFang'),
    PickupWindGem:          require('./destroyables/pickups/PickupWindGem'),
    PickupWindStaff:        require('./destroyables/pickups/PickupWindStaff'),
    //PickupWoodDoor:         require('./destroyables/pickups/PickupWoodDoor'),
    //PickupWoodWall:         require('./destroyables/pickups/PickupWoodWall'),
    //PickupWorkbench:        require('./destroyables/pickups/PickupWorkbench'),
    PickupYellowKey:        require('./destroyables/pickups/PickupYellowKey'),

    // Statics
    Entrance:               require('./statics/Entrance'),
    Solid:                  require('./statics/Solid'),

    // Statics - Interactables
    Interactable:           require('./statics/interactables/Interactable'),

    // Statics - Interactables - Breakables
    BankChest:              require('./statics/interactables/breakables/BankChest'),
    DoorLockedFighter:      require('./statics/interactables/breakables/DoorLockedFighter'),
    DoorLockedPit:          require('./statics/interactables/breakables/DoorLockedPit'),
    LowBlock:               require('./statics/interactables/breakables/LowBlock'),
    MetalDoor:              require('./statics/interactables/breakables/MetalDoor'),
    Torch:                  require('./statics/interactables/breakables/Torch'),
    Wall:                   require('./statics/interactables/breakables/Wall'),
    WoodDoor:               require('./statics/interactables/breakables/WoodDoor'),
    WoodDoorLockedBlue:     require('./statics/interactables/breakables/WoodDoorLockedBlue'),
    WoodDoorLockedGreen:    require('./statics/interactables/breakables/WoodDoorLockedGreen'),
    WoodDoorLockedRed:      require('./statics/interactables/breakables/WoodDoorLockedRed'),
    WoodDoorLockedYellow:   require('./statics/interactables/breakables/WoodDoorLockedYellow'),

    // Statics - Interactables - Breakables - Buildables
    //ClanCharter:              require('./interactables/crafting stations/Charter'),
    //ClanGenerator:            require('./interactables/Generator'),
    //ClanWoodWall:             require('./interactables/WoodWall'),

    // Statics - Interactables - Breakables - Crafting stations
    CraftingStation:        require('./statics/interactables/breakables/crafting stations/CraftingStation'),
    Anvil:                  require('./statics/interactables/breakables/crafting stations/Anvil'),
    Furnace:                require('./statics/interactables/breakables/crafting stations/Furnace'),
    Laboratory:             require('./statics/interactables/breakables/crafting stations/Laboratory'),
    Workbench:              require('./statics/interactables/breakables/crafting stations/Workbench'),

    // Statics - Interactables - Exits
    Exit:                   require('./statics/interactables/exits/Exit'),
    DungeonPortal:          require('./statics/interactables/exits/DungeonPortal'),
    OverworldPortal:        require('./statics/interactables/exits/OverworldPortal'),

    // Statics - Interactables - Resource nodes
    BlueMushroom:           require('./statics/interactables/resource nodes/BlueMushroom'),
    CottonPlant:            require('./statics/interactables/resource nodes/CottonPlant'),
    DungiumOre:             require('./statics/interactables/resource nodes/DungiumOre'),
    GreenMushroom:          require('./statics/interactables/resource nodes/GreenMushroom'),
    IronOre:                require('./statics/interactables/resource nodes/IronOre'),
    NoctisOre:              require('./statics/interactables/resource nodes/NoctisOre'),
    OakTree:                require('./statics/interactables/resource nodes/OakTree'),
    PalmTree:               require('./statics/interactables/resource nodes/PalmTree'),
    RedMushroom:            require('./statics/interactables/resource nodes/RedMushroom'),
    SpruceTree:             require('./statics/interactables/resource nodes/SpruceTree'),


};


// Write the registered entity types to the client, so the client knows what entity to add for each type number.
const fs = require('fs');
let dataToWrite = {};

for(let entityTypeKey in EntitiesList){
    // Don't check prototype properties.
    if(EntitiesList.hasOwnProperty(entityTypeKey) === false) continue;
    // Only add registered types.
    if(EntitiesList[entityTypeKey].prototype.typeNumber === 'Type not registered.') continue;
    // Add this entity type to the type catalogue.
    dataToWrite[EntitiesList[entityTypeKey].prototype.typeNumber] = entityTypeKey;
}

// Check the type catalogue exists. Catches the case that this is the deployment server
// and thus doesn't have a client directory, and thus no type catalogue.
if (fs.existsSync('../client/src/catalogues/EntityTypes.json')) {
    // Turn the data into a string.
    dataToWrite = JSON.stringify(dataToWrite);

    // Write the data to the file in the client files.
    fs.writeFileSync('../client/src/catalogues/EntityTypes.json', dataToWrite);

    console.log("* Entity types catalogue written to file.");
}

module.exports = EntitiesList;