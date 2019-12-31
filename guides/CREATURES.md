# Getting started: Creatures

When thinking of a new type of creature to add, consider it's purpose and how it might affect other parts of the game.

This guide will go through adding a new monster entity to the game, *Slime*, and a boss variant, a *Giant Slime*, though you are encouraged to think of something different to add instead and to experiment with each step of the guide, so you aren't just copying the guide without understanding what is happening.

## Create a server file

Every entity in the game has its own JS file that contains its specific configuraton and functionality.

Create a new JS file for the creature you want to add to `server/src/entities/destroyables/movables/characters/mobs`.

Every mob should have at least the following code for it to be valid.

### Slime.js
```js
const Mob = require('./Mob');

class Slime extends Mob {}
module.exports = Slime;

Slime.prototype.registerEntityType();
Slime.prototype.assignMobValues("Slime", Slime.prototype);
```

## Add it to the stat definitions spreadsheet.

### [Spreadsheet](https://docs.google.com/spreadsheets/d/1Hzu-qrflnSssyDC2sUa4ipaGjBGKccUAgGeO83yqw-A/edit#gid=0)

<img src="creature-stat-defs.png" alt="drawing" width="50%"/>

## Add it to the game world

To add a spawner for this creature type to the map, use its class name in a spawner area object.

## Create a client file

A logical entity now exists for the slime on the server, but it needs a graphical representation on the client, a sprite.

Just like on the server, every entity needs its own JS file on the client.

Create a JS file with the same name as the server JS file.

# Creating a boss

The process for creating a dungeon boss entity is mostly the same, but the 

Every boss should have at least the following code for it to be valid.

### GiantSlime.js
```js
const Mob = require('./Boss');

class GiantSlime extends Boss {}
module.exports = GiantSlime;

GiantSlime.prototype.registerEntityType();
GiantSlime.prototype.assignMobValues("Giant slime", GiantSlime.prototype);
```


## Test it

## Extra properties

With our basic entity set up and working, we can customise it further, such as giving it a drop list, assigning it as a task objective, giving it special attacks.

This can be done by adding more properties to its prototype object. See [Mob.js](../server/src/entities/destroyables/movables/characters/mobs/Mob.js) for a list of the properties that mobs can have and their default values, and other mob files for examples of how they can be used.