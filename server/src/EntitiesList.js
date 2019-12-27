// Mob values are defined at https://docs.google.com/spreadsheets/d/1Hzu-qrflnSssyDC2sUa4ipaGjBGKccUAgGeO83yqw-A/edit#gid=0

const fs = require('fs');

const requireAll = () => {
    
}

console.log(fs.readdirSync());

const EntitiesList = (ctx => {
    let keys = ctx.keys();
    let values = keys.map(ctx);
    return keys.reduce((object, key, index) => {
        key = key.split("/").pop().slice(0, -3);
        console.log("key:", key);
        object[key] = values[index];
        return object;
    }, {});
})(require.context('./entities/', true, /.js$/)); do manually with fs dir...

// const EntitiesList = {

//     Entity:                 require('./entities/Entity'),

//     // Spawners
//     SpawnerArea:            require('./entities/spawners/SpawnerArea'),
//     SpawnerTotem:           require('./entities/spawners/SpawnerTotem'),

//     // Destroyables

//     // Destroyables - Corpses
//     Corpse:                 require('./entities/destroyables/corpses/Corpse'),
//     CorpseHuman:            require('./entities/destroyables/corpses/CorpseHuman'),

//     // Destroyables - Movables

//     // Destroyables - Movables - Characters
//     Character:              require('./entities/destroyables/movables/characters/Character'),
//     Player:                 require('./entities/destroyables/movables/characters/Player'),

//     // Destroyables - Movables - Characters - Mobs
//     Assassin:               require('./entities/destroyables/movables/characters/mobs/Assassin'),
//     Bandit:                 require('./entities/destroyables/movables/characters/mobs/Bandit'),
//     BanditLeader:           require('./entities/destroyables/movables/characters/mobs/BanditLeader'),
//     Bat:                    require('./entities/destroyables/movables/characters/mobs/Bat'),
//     BloodLord:              require('./entities/destroyables/movables/characters/mobs/BloodLord'),
//     BloodPriest:            require('./entities/destroyables/movables/characters/mobs/BloodPriest'),
//     Citizen:                require('./entities/destroyables/movables/characters/mobs/Citizen'),
//     Commander:              require('./entities/destroyables/movables/characters/mobs/Commander'),
//     CryptWarden:            require('./entities/destroyables/movables/characters/mobs/CryptWarden'),
//     GnarlOak:               require('./entities/destroyables/movables/characters/mobs/GnarlOak'),
//     Goblin:                 require('./entities/destroyables/movables/characters/mobs/Goblin'),
//     GrassScamp:             require('./entities/destroyables/movables/characters/mobs/GrassScamp'),
//     GreatGnarl:             require('./entities/destroyables/movables/characters/mobs/GreatGnarl'),
//     Hawk:                   require('./entities/destroyables/movables/characters/mobs/Hawk'),
//     Knight:                 require('./entities/destroyables/movables/characters/mobs/Knight'),
//     MasterAssassin:         require('./entities/destroyables/movables/characters/mobs/MasterAssassin'),
//     Mummy:                  require('./entities/destroyables/movables/characters/mobs/Mummy'),
//     Pharaoh:                require('./entities/destroyables/movables/characters/mobs/Pharaoh'),
//     Prisoner:               require('./entities/destroyables/movables/characters/mobs/Prisoner'),
//     Rat:                    require('./entities/destroyables/movables/characters/mobs/Rat'),
//     SandScamp:              require('./entities/destroyables/movables/characters/mobs/SandScamp'),
//     Snoovir:                require('./entities/destroyables/movables/characters/mobs/Snoovir'),
//     Vampire:                require('./entities/destroyables/movables/characters/mobs/Vampire'),
//     Warrior:                require('./entities/destroyables/movables/characters/mobs/Warrior'),
//     ArenaMaster:            require('./entities/destroyables/movables/characters/mobs/traders/ArenaMaster'),
//     DwarfWeaponMerchant:    require('./entities/destroyables/movables/characters/mobs/traders/DwarfWeaponMerchant'),
//     Innkeeper:              require('./entities/destroyables/movables/characters/mobs/traders/Innkeeper'),
//     MagicMerchant:          require('./entities/destroyables/movables/characters/mobs/traders/MagicMerchant'),
//     MeleeMerchant:          require('./entities/destroyables/movables/characters/mobs/traders/MeleeMerchant'),
//     OmniMerchant:           require('./entities/destroyables/movables/characters/mobs/traders/OmniMerchant'),
//     PriestMerchant:         require('./entities/destroyables/movables/characters/mobs/traders/PriestMerchant'),
//     RangedMerchant:         require('./entities/destroyables/movables/characters/mobs/traders/RangedMerchant'),
//     //Ruler:                  require('./destroyables/movables/characters/mobs/traders/Ruler'),
//     ToolMerchant:           require('./entities/destroyables/movables/characters/mobs/traders/ToolMerchant'),
//     TutorialMerchant:       require('./entities/destroyables/movables/characters/mobs/traders/TutorialMerchant'),

//     // Destroyables - Movables - Characters - Mobs - Zombies
//     Zombie:                 require('./entities/destroyables/movables/characters/mobs/zombies/Zombie'),
//     ZombieHuman:            require('./entities/destroyables/movables/characters/mobs/zombies/ZombieHuman'),

//     // Destroyables - Movables - Projectiles
//     ProjAcorn:              require('./entities/destroyables/movables/projectiles/ProjAcorn'),
//     ProjBloodBolt:          require('./entities/destroyables/movables/projectiles/ProjBloodBolt'),
//     ProjDeathbind:          require('./entities/destroyables/movables/projectiles/ProjDeathbind'),
//     ProjDungiumArrow:       require('./entities/destroyables/movables/projectiles/ProjDungiumArrow'),
//     ProjDungiumDagger:      require('./entities/destroyables/movables/projectiles/ProjDungiumDagger'),
//     ProjDungiumHammer:      require('./entities/destroyables/movables/projectiles/ProjDungiumHammer'),
//     ProjDungiumSword:       require('./entities/destroyables/movables/projectiles/ProjDungiumSword'),
//     ProjFire:               require('./entities/destroyables/movables/projectiles/ProjFire'),
//     ProjIronArrow:          require('./entities/destroyables/movables/projectiles/ProjIronArrow'),
//     ProjIronDagger:         require('./entities/destroyables/movables/projectiles/ProjIronDagger'),
//     ProjIronHammer:         require('./entities/destroyables/movables/projectiles/ProjIronHammer'),
//     ProjIronSword:          require('./entities/destroyables/movables/projectiles/ProjIronSword'),
//     ProjNoctisArrow:        require('./entities/destroyables/movables/projectiles/ProjNoctisArrow'),
//     ProjNoctisDagger:       require('./entities/destroyables/movables/projectiles/ProjNoctisDagger'),
//     ProjNoctisHammer:       require('./entities/destroyables/movables/projectiles/ProjNoctisHammer'),
//     ProjNoctisSword:        require('./entities/destroyables/movables/projectiles/ProjNoctisSword'),
//     ProjPacify:             require('./entities/destroyables/movables/projectiles/ProjPacify'),
//     ProjShuriken:           require('./entities/destroyables/movables/projectiles/ProjShuriken'),
//     ProjSnowball:           require('./entities/destroyables/movables/projectiles/ProjSnowball'),
//     ProjSuperBloodBolt:     require('./entities/destroyables/movables/projectiles/ProjSuperBloodBolt'),
//     ProjSuperFire:          require('./entities/destroyables/movables/projectiles/ProjSuperFire'),
//     ProjSuperWind:          require('./entities/destroyables/movables/projectiles/ProjSuperWind'),
//     ProjVampireFang:        require('./entities/destroyables/movables/projectiles/ProjVampireFang'),
//     ProjWind:               require('./entities/destroyables/movables/projectiles/ProjWind'),

//     // Destroyables - Pickups
//     //PickupAnvil:            require('./destroyables/pickups/PickupAnvil'),
//     //PickupBankChest:        require('./destroyables/pickups/PickupBankChest'),
//     PickupBloodGem:         require('./entities/destroyables/pickups/PickupBloodGem'),
//     PickupBloodStaff:       require('./entities/destroyables/pickups/PickupBloodStaff'),
//     PickupBluecap:          require('./entities/destroyables/pickups/PickupBluecap'),
//     PickupBlueKey:          require('./entities/destroyables/pickups/PickupBlueKey'),
//     PickupBookOfLight:      require('./entities/destroyables/pickups/PickupBookOfLight'),
//     PickupBookOfSouls:      require('./entities/destroyables/pickups/PickupBookOfSouls'),
//     //PickupCharter:          require('./destroyables/pickups/PickupCharter'),
//     PickupCloak:            require('./entities/destroyables/pickups/PickupCloak'),
//     PickupCotton:           require('./entities/destroyables/pickups/PickupCotton'),
//     PickupCurePotion:       require('./entities/destroyables/pickups/PickupCurePotion'),
//     PickupDungiumArmour:    require('./entities/destroyables/pickups/PickupDungiumArmour'),
//     PickupDungiumArrows:    require('./entities/destroyables/pickups/PickupDungiumArrows'),
//     PickupDungiumBar:       require('./entities/destroyables/pickups/PickupDungiumBar'),
//     PickupDungiumDagger:    require('./entities/destroyables/pickups/PickupDungiumDagger'),
//     PickupDungiumHammer:    require('./entities/destroyables/pickups/PickupDungiumHammer'),
//     PickupDungiumHatchet:   require('./entities/destroyables/pickups/PickupDungiumHatchet'),
//     PickupDungiumOre:       require('./entities/destroyables/pickups/PickupDungiumOre'),
//     PickupDungiumPickaxe:   require('./entities/destroyables/pickups/PickupDungiumPickaxe'),
//     PickupDungiumRod:       require('./entities/destroyables/pickups/PickupDungiumRod'),
//     PickupDungiumSheet:     require('./entities/destroyables/pickups/PickupDungiumSheet'),
//     PickupDungiumSword:     require('./entities/destroyables/pickups/PickupDungiumSword'),
//     PickupEnergyPotion:     require('./entities/destroyables/pickups/PickupEnergyPotion'),
//     PickupExpOrbArmoury:    require('./entities/destroyables/pickups/PickupExpOrbArmoury'),
//     PickupExpOrbGathering:  require('./entities/destroyables/pickups/PickupExpOrbGathering'),
//     PickupExpOrbMagic:      require('./entities/destroyables/pickups/PickupExpOrbMagic'),
//     PickupExpOrbMelee:      require('./entities/destroyables/pickups/PickupExpOrbMelee'),
//     PickupExpOrbPotionry:   require('./entities/destroyables/pickups/PickupExpOrbPotionry'),
//     PickupExpOrbRanged:     require('./entities/destroyables/pickups/PickupExpOrbRanged'),
//     PickupExpOrbToolery:    require('./entities/destroyables/pickups/PickupExpOrbToolery'),
//     PickupExpOrbWeaponry:   require('./entities/destroyables/pickups/PickupExpOrbWeaponry'),
//     PickupFabric:           require('./entities/destroyables/pickups/PickupFabric'),
//     PickupFeathers:         require('./entities/destroyables/pickups/PickupFeathers'),
//     PickupFighterKey:       require('./entities/destroyables/pickups/PickupFighterKey'),
//     PickupFireGem:          require('./entities/destroyables/pickups/PickupFireGem'),
//     PickupFireStaff:        require('./entities/destroyables/pickups/PickupFireStaff'),
//     //PickupFurnace:          require('./destroyables/pickups/PickupFurnace'),
//     //PickupGenerator:        require('./destroyables/pickups/PickupGenerator'),
//     PickupGreencap:         require('./entities/destroyables/pickups/PickupGreencap'),
//     PickupGreenKey:         require('./entities/destroyables/pickups/PickupGreenKey'),
//     PickupHealthPotion:     require('./entities/destroyables/pickups/PickupHealthPotion'),
//     PickupIronArmour:       require('./entities/destroyables/pickups/PickupIronArmour'),
//     PickupIronArrows:       require('./entities/destroyables/pickups/PickupIronArrows'),
//     PickupIronBar:          require('./entities/destroyables/pickups/PickupIronBar'),
//     PickupIronDagger:       require('./entities/destroyables/pickups/PickupIronDagger'),
//     PickupIronHammer:       require('./entities/destroyables/pickups/PickupIronHammer'),
//     PickupIronHatchet:      require('./entities/destroyables/pickups/PickupIronHatchet'),
//     PickupIronOre:          require('./entities/destroyables/pickups/PickupIronOre'),
//     PickupIronPickaxe:      require('./entities/destroyables/pickups/PickupIronPickaxe'),
//     PickupIronRod:          require('./entities/destroyables/pickups/PickupIronRod'),
//     PickupIronSheet:        require('./entities/destroyables/pickups/PickupIronSheet'),
//     PickupIronSword:        require('./entities/destroyables/pickups/PickupIronSword'),
//     PickupMageRobe:         require('./entities/destroyables/pickups/PickupMageRobe'),
//     PickupNecromancerRobe:  require('./entities/destroyables/pickups/PickupNecromancerRobe'),
//     PickupNinjaGarb:        require('./entities/destroyables/pickups/PickupNinjaGarb'),
//     PickupNoctisArmour:     require('./entities/destroyables/pickups/PickupNoctisArmour'),
//     PickupNoctisArrows:     require('./entities/destroyables/pickups/PickupNoctisArrows'),
//     PickupNoctisBar:        require('./entities/destroyables/pickups/PickupNoctisBar'),
//     PickupNoctisDagger:     require('./entities/destroyables/pickups/PickupNoctisDagger'),
//     PickupNoctisHammer:     require('./entities/destroyables/pickups/PickupNoctisHammer'),
//     PickupNoctisHatchet:    require('./entities/destroyables/pickups/PickupNoctisHatchet'),
//     PickupNoctisOre:        require('./entities/destroyables/pickups/PickupNoctisOre'),
//     PickupNoctisPickaxe:    require('./entities/destroyables/pickups/PickupNoctisPickaxe'),
//     PickupNoctisRod:        require('./entities/destroyables/pickups/PickupNoctisRod'),
//     PickupNoctisSheet:      require('./entities/destroyables/pickups/PickupNoctisSheet'),
//     PickupNoctisSword:      require('./entities/destroyables/pickups/PickupNoctisSword'),
//     PickupOakBow:           require('./entities/destroyables/pickups/PickupOakBow'),
//     PickupOakLogs:          require('./entities/destroyables/pickups/PickupOakLogs'),
//     PickupPitKey:           require('./entities/destroyables/pickups/PickupPitKey'),
//     PickupPlainRobe:        require('./entities/destroyables/pickups/PickupPlainRobe'),
//     PickupRedcap:           require('./entities/destroyables/pickups/PickupRedcap'),
//     PickupRedKey:           require('./entities/destroyables/pickups/PickupRedKey'),
//     PickupRespawnOrb:       require('./entities/destroyables/pickups/PickupRespawnOrb'),
//     PickupShuriken:         require('./entities/destroyables/pickups/PickupShuriken'),
//     PickupString:           require('./entities/destroyables/pickups/PickupString'),
//     PickupSuperFireStaff:   require('./entities/destroyables/pickups/PickupSuperFireStaff'),
//     PickupSuperWindStaff:   require('./entities/destroyables/pickups/PickupSuperWindStaff'),
//     PickupSuperBloodStaff:  require('./entities/destroyables/pickups/PickupSuperBloodStaff'),
//     PickupVampireFang:      require('./entities/destroyables/pickups/PickupVampireFang'),
//     PickupWindGem:          require('./entities/destroyables/pickups/PickupWindGem'),
//     PickupWindStaff:        require('./entities/destroyables/pickups/PickupWindStaff'),
//     //PickupWoodDoor:         require('./destroyables/pickups/PickupWoodDoor'),
//     //PickupWoodWall:         require('./destroyables/pickups/PickupWoodWall'),
//     //PickupWorkbench:        require('./destroyables/pickups/PickupWorkbench'),
//     PickupYellowKey:        require('./entities/destroyables/pickups/PickupYellowKey'),

//     // Statics
//     Entrance:               require('./entities/statics/Entrance'),
//     Solid:                  require('./entities/statics/Solid'),

//     // Statics - Interactables
//     Interactable:           require('./entities/statics/interactables/Interactable'),

//     // Statics - Interactables - Breakables
//     BankChest:              require('./entities/statics/interactables/breakables/BankChest'),
//     DoorLockedFighter:      require('./entities/statics/interactables/breakables/DoorLockedFighter'),
//     DoorLockedPit:          require('./entities/statics/interactables/breakables/DoorLockedPit'),
//     LowBlock:               require('./entities/statics/interactables/breakables/LowBlock'),
//     MetalDoor:              require('./entities/statics/interactables/breakables/MetalDoor'),
//     Torch:                  require('./entities/statics/interactables/breakables/Torch'),
//     Wall:                   require('./entities/statics/interactables/breakables/Wall'),
//     WoodDoor:               require('./entities/statics/interactables/breakables/WoodDoor'),
//     WoodDoorLockedBlue:     require('./entities/statics/interactables/breakables/WoodDoorLockedBlue'),
//     WoodDoorLockedGreen:    require('./entities/statics/interactables/breakables/WoodDoorLockedGreen'),
//     WoodDoorLockedRed:      require('./entities/statics/interactables/breakables/WoodDoorLockedRed'),
//     WoodDoorLockedYellow:   require('./entities/statics/interactables/breakables/WoodDoorLockedYellow'),

//     // Statics - Interactables - Breakables - Buildables
//     //ClanCharter:              require('./interactables/crafting stations/Charter'),
//     //ClanGenerator:            require('./interactables/Generator'),
//     //ClanWoodWall:             require('./interactables/WoodWall'),

//     // Statics - Interactables - Breakables - Crafting stations
//     CraftingStation:        require('./entities/statics/interactables/breakables/crafting stations/CraftingStation'),
//     Anvil:                  require('./entities/statics/interactables/breakables/crafting stations/Anvil'),
//     Furnace:                require('./entities/statics/interactables/breakables/crafting stations/Furnace'),
//     Laboratory:             require('./entities/statics/interactables/breakables/crafting stations/Laboratory'),
//     Workbench:              require('./entities/statics/interactables/breakables/crafting stations/Workbench'),

//     // Statics - Interactables - Exits
//     Exit:                   require('./entities/statics/interactables/exits/Exit'),
//     DungeonPortal:          require('./entities/statics/interactables/exits/DungeonPortal'),
//     OverworldPortal:        require('./entities/statics/interactables/exits/OverworldPortal'),

//     // Statics - Interactables - Resource nodes
//     BlueMushroom:           require('./entities/statics/interactables/resource nodes/BlueMushroom'),
//     CottonPlant:            require('./entities/statics/interactables/resource nodes/CottonPlant'),
//     DungiumOre:             require('./entities/statics/interactables/resource nodes/DungiumOre'),
//     GreenMushroom:          require('./entities/statics/interactables/resource nodes/GreenMushroom'),
//     IronOre:                require('./entities/statics/interactables/resource nodes/IronOre'),
//     NoctisOre:              require('./entities/statics/interactables/resource nodes/NoctisOre'),
//     OakTree:                require('./entities/statics/interactables/resource nodes/OakTree'),
//     PalmTree:               require('./entities/statics/interactables/resource nodes/PalmTree'),
//     RedMushroom:            require('./entities/statics/interactables/resource nodes/RedMushroom'),
//     SpruceTree:             require('./entities/statics/interactables/resource nodes/SpruceTree'),


// };


// Write the registered entity types to the client, so the client knows what entity to add for each type number.
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