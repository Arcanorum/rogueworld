# * ***Item system rework in progress, this guide may be out of date/incomplete***

# Getting started: Items

An item is an object that a player can obtain and can be used for many game functions, such as combat, resource gathering, crafting and interacting with other objects (such as opening locked doors).

An item can exist in one of two states:
- As a logical [`Item`](../server/src/items/Item.js) in an inventory or bank slot.
- As a concrete [`Pickup`](../server/src/entities/destroyables/pickups/Pickup.js) entity on a board tile.

Each item type usually has an associated pickup type, which is an entity that allows the item to be dropped and added to the board (Item to Pickup) or picked up by a player and removed from the board (Pickup to Item).

This guide will go through adding a new weapon to the game, *Iron spear*.

## Create a server file

Every item in the game has its own JS file that contains its specific configuraton and functionality.

Any custom logic for a particular item belongs in this file.

In `server/src/items/` there are several sub-directories for more specific item types, which should be where you organise items by category based on their function.

In this case, an iron spear will be a weapon, and a weapon is holdable, so create a new JS file for the item to add to `server/src/items/holdable/weapons`.

Every weapon should have at least the following code for it to be valid.

### ItemIronSpear.js
```js
const Item = require("./Item");

class IronSpear extends Item {}

IronSpear.translationID = "Iron spear";
IronSpear.iconSource = "icon-iron-spear";

module.exports = IronSpear;
```

## Add it to the game world

Since items themselves are not actual entities, but pickups are, we can add items as pickups to the game world using a regular entity spawner.

<img src="item-spawner.png" width="50%"/>
