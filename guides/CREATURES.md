# Getting started: Creatures

This guide will go through adding a new monster entity to the game, *Slime*, and a boss variant, a *Giant Slime*.

To add a creature to the game:
- Create a server entity file (for logic)
- Create a client sprite file (for display)
- - Create sprite assets (for appearance)

## Create a server file

Every entity in the game has its own JS file that contains its specific configuraton and functionality.

Any custom logic for a particular entity belongs in this file.

Create a new JS file for the creature you want to add to `server/src/entities/destroyables/movables/characters/mobs`.

Every mob should have at least the following code for it to be valid.

### Slime.js
```js
const Mob = require('./Mob');

class Slime extends Mob {}
module.exports = Slime;

Slime.prototype.registerEntityType();
Slime.prototype.assignMobValues();
```

## Add it to the mob stat values definitions list.

### [>> Mob stats <<](../server/src/MobValues.json)

This is where you define most of the generic configuration of the creature (hitpoints, move rate, what weapon it uses, etc.).

<img src=".png" alt="drawing" width="50%"/>
//TODO update this image to show the json file instead of the excel spreadsheet

## Add it to the game world

To make this entity appear on the map use its class name in a spawner area object.

## Create a client file

A logical entity now exists for the slime on the server, but it needs a graphical representation on the client, a sprite.

Just like on the server, every entity needs its own JS file on the client.

Create a JS file with the same name as the server JS file.




## Test it

## Extra properties

With our basic entity set up and working, we can customise it further, such as giving it a drop list, assigning it as a task objective, giving it special attacks.

See [Mob.js](../server/src/entities/destroyables/movables/characters/mobs/Mob.js) for a list of the properties that mobs can have and their default values, and other mob files for examples of how they can be used.




# Creating a boss

The process for creating a dungeon boss entity is mostly the same, but the 

Every boss should have at least the following code for it to be valid.

### GiantSlime.js
```js
const Mob = require('./Boss');

class GiantSlime extends Boss {}
module.exports = GiantSlime;

GiantSlime.prototype.registerEntityType();
GiantSlime.prototype.assignMobValues();
```