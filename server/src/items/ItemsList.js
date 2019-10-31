
const ItemsList = {

    LIST: this,

    /*ItemCharter:        require('./ItemCharter'),
    ItemAnvil:          require('./ItemAnvil'),
    ItemFurnace:        require('./ItemFurnace'),
    ItemWorkbench:      require('./ItemWorkbench'),
    ItemWoodWall:       require('./ItemWoodWall'),
    ItemWoodDoor:       require('./ItemWoodDoor'),
    ItemBankChest:      require('./ItemBankChest'),
    ItemGenerator:      require('./ItemGenerator'),*/

    ItemBloodGem:       require('./ItemBloodGem'),
    ItemBluecap:        require('./ItemBluecap'),
    ItemBlueKey:        require('./ItemBlueKey'),
    ItemCotton:         require('./ItemCotton'),
    ItemCurePotion:     require('./ItemCurePotion'),
    ItemDungiumBar:     require('./ItemDungiumBar'),
    ItemDungiumHatchet: require('./ItemDungiumHatchet'),
    ItemDungiumOre:     require('./ItemDungiumOre'),
    ItemDungiumPickaxe: require('./ItemDungiumPickaxe'),
    ItemDungiumRod:     require('./ItemDungiumRod'),
    ItemDungiumSheet:   require('./ItemDungiumSheet'),
    ItemEnergyPotion:   require('./ItemEnergyPotion'),
    ItemExpOrbArmoury:  require('./ItemExpOrbArmoury'),
    ItemExpOrbGathering:require('./ItemExpOrbGathering'),
    ItemExpOrbMagic:    require('./ItemExpOrbMagic'),
    ItemExpOrbMelee:    require('./ItemExpOrbMelee'),
    ItemExpOrbPotionry: require('./ItemExpOrbPotionry'),
    ItemExpOrbRanged:   require('./ItemExpOrbRanged'),
    ItemExpOrbToolery:  require('./ItemExpOrbToolery'),
    ItemExpOrbWeaponry: require('./ItemExpOrbWeaponry'),
    ItemFabric:         require('./ItemFabric'),
    ItemFeathers:       require('./ItemFeathers'),
    ItemFighterKey:     require('./ItemFighterKey'),
    ItemFireGem:        require('./ItemFireGem'),
    ItemGreencap:       require('./ItemGreencap'),
    ItemGreenKey:       require('./ItemGreenKey'),
    ItemHealthPotion:   require('./ItemHealthPotion'),
    ItemIronBar:        require('./ItemIronBar'),
    ItemIronHatchet:    require('./ItemIronHatchet'),
    ItemIronOre:        require('./ItemIronOre'),
    ItemIronPickaxe:    require('./ItemIronPickaxe'),
    ItemIronRod:        require('./ItemIronRod'),
    ItemIronSheet:      require('./ItemIronSheet'),
    ItemNoctisBar:      require('./ItemNoctisBar'),
    ItemNoctisHatchet:  require('./ItemNoctisHatchet'),
    ItemNoctisOre:      require('./ItemNoctisOre'),
    ItemNoctisPickaxe:  require('./ItemNoctisPickaxe'),
    ItemNoctisRod:      require('./ItemNoctisRod'),
    ItemNoctisSheet:    require('./ItemNoctisSheet'),
    ItemOakLogs:        require('./ItemOakLogs'),
    ItemPitKey:         require('./ItemPitKey'),
    ItemRedcap:         require('./ItemRedcap'),
    ItemRedKey:         require('./ItemRedKey'),
    ItemString:         require('./ItemString'),
    ItemWindGem:        require('./ItemWindGem'),
    ItemYellowKey:      require('./ItemYellowKey'),

    ItemDungiumArrows:  require('./ammunition/ItemDungiumArrows'),
    ItemIronArrows:     require('./ammunition/ItemIronArrows'),
    ItemNoctisArrows:   require('./ammunition/ItemNoctisArrows'),

    ItemCloak:          require('./clothes/ItemCloak'),
    ItemDungiumArmour:  require('./clothes/ItemDungiumArmour'),
    ItemIronArmour:     require('./clothes/ItemIronArmour'),
    ItemMageRobe:       require('./clothes/ItemMageRobe'),
    ItemNecromancerRobe:require('./clothes/ItemNecromancerRobe'),
    ItemNinjaGarb:      require('./clothes/ItemNinjaGarb'),
    ItemNoctisArmour:   require('./clothes/ItemNoctisArmour'),
    ItemPlainRobe:      require('./clothes/ItemPlainRobe'),

    ItemBookOfLight:    require('./holdable/spell_books/ItemBookOfLight'),
    ItemBookOfSouls:    require('./holdable/spell_books/ItemBookOfSouls'),

    ItemBloodStaff:     require('./holdable/weapons/ItemBloodStaff'),
    ItemDungiumDagger:  require('./holdable/weapons/ItemDungiumDagger'),
    ItemDungiumHammer:  require('./holdable/weapons/ItemDungiumHammer'),
    ItemDungiumSword:   require('./holdable/weapons/ItemDungiumSword'),
    ItemFireStaff:      require('./holdable/weapons/ItemFireStaff'),
    ItemIronDagger:     require('./holdable/weapons/ItemIronDagger'),
    ItemIronHammer:     require('./holdable/weapons/ItemIronHammer'),
    ItemIronSword:      require('./holdable/weapons/ItemIronSword'),
    ItemNoctisDagger:   require('./holdable/weapons/ItemNoctisDagger'),
    ItemNoctisHammer:   require('./holdable/weapons/ItemNoctisHammer'),
    ItemNoctisSword:    require('./holdable/weapons/ItemNoctisSword'),
    ItemShuriken:       require('./holdable/weapons/ItemShuriken'),
    ItemSuperBloodStaff:require('./holdable/weapons/ItemSuperBloodStaff'),
    ItemSuperFireStaff: require('./holdable/weapons/ItemSuperFireStaff'),
    ItemSuperWindStaff: require('./holdable/weapons/ItemSuperWindStaff'),
    ItemVampireFang:    require('./holdable/weapons/ItemVampireFang'),
    ItemWindStaff:      require('./holdable/weapons/ItemWindStaff'),

    ItemOakBow:         require('./holdable/weapons/bows/ItemOakBow'),

};

// Check all of the items are valid. i.e. are a class/function.
Object.keys(ItemsList).forEach((itemKey) => {
    // Skip the list itself.
    if(itemKey === "LIST") return;

    if(typeof ItemsList[itemKey] !== "function"){
        console.error("* ERROR: Invalid item type added to ItemsList:", itemKey);
        process.exit();
    }
});

// Write the registered item types to the client, so the client knows what item to add for each type number.
const fs = require('fs');
let dataToWrite = {};

for(let itemTypeKey in ItemsList){
    // Don't check prototype properties.
    if(ItemsList.hasOwnProperty(itemTypeKey) === false) continue;

    const itemPrototype = ItemsList[itemTypeKey].prototype;
    // Catches the LIST reference thing that is set up at the end of server init, which won't have a type number at all.
    if(itemPrototype === undefined) continue;
    // Only add registered types.
    if(itemPrototype.typeNumber === 'Type not registered.') continue;
    // Add this item type to the type catalogue.
    dataToWrite[itemPrototype.typeNumber] = {
        typeNumber: itemPrototype.typeNumber,
        idName: itemPrototype.idName,
        baseValue: itemPrototype.baseValue,
        iconSource: itemPrototype.iconSource
    };
}

// Check the type catalogue exists. Catches the case that this is the deployment server
// and thus doesn't have a client directory, and thus no type catalogue.
if (fs.existsSync('../client/src/catalogues/ItemTypes.json')) {
    // Turn the data into a string.
    dataToWrite = JSON.stringify(dataToWrite);

    // Write the data to the file in the client files.
    fs.writeFileSync('../client/src/catalogues/ItemTypes.json', dataToWrite);

    console.log("* Item types catalogue written to file.");
}

module.exports = ItemsList;
