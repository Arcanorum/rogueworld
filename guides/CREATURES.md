# Getting started: Creatures

When thinking of a new type of creature to add, consider it's purpose and how it might affect other parts of the game.

This guide will go through adding the Rat entity to the game.

## 1. Create a new JS file for the creature you want to add to `server/src/entities/destroyables/movables/characters/mobs`.

Every mob should have at least the following code for it to be valid.

### Rat.js
```js
const Mob = require('./Mob');

class Rat extends Mob {}
module.exports = Rat;

Rat.prototype.registerEntityType();
Rat.prototype.assignMobValues("Rat", Rat.prototype);
```

Which can then be extended by adding more properties its prototype object. See [Mob.js](../server/src/entities/destroyables/movables/characters/mobs/Mob.js) for a list of the properties that mobs can have and their default values, and other mob files for examples of how they can be used.

## 2. Add it to the server entities list.

### [EntitiesList.js](../server/src/EntitiesList.js)

<img src="creature-entities-list.png" alt="drawing" width="50%"/>

*Keep this list organised by entity type and arranged alphabetically.*

## 3. Add it to the stat definitions spreadsheet.

### [Spreadsheet](https://docs.google.com/spreadsheets/d/1Hzu-qrflnSssyDC2sUa4ipaGjBGKccUAgGeO83yqw-A/edit#gid=0)

<img src="creature-stat-defs.png" alt="drawing" width="50%"/>

## 4. Add a sprite for it on the client

## 5. Add it to the client sprites list

## 6. Add it to the game world

To add a spawner for this creature type to the map, use its class name in a spawner area object.

## 7. Test it