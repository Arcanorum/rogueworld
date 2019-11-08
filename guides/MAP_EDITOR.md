# Getting started: Map editor

This guide covers creating and editing the game world maps, such as the main overworld, and dungeons.

All maps are built using Tiled map editor, which you will need to have installed. https://www.mapeditor.org/

*Note: If you experience that Tiled crashes (often when zoomed out far) or that it stutters a lot, try disabling hardware accelerated drawing in Preferences.*

<img src="tiled-opengl.png" alt="drawing" width="50%"/>

# Layers

<img src="tiled-layers.png" alt="drawing" width="50%"/>

Each map file has a set of layers in it. A layer is basically a surface to add game world features to, which logically groups those features together.

Each layer handles a particular aspect of the map, and each one is used in a different way by the server code when the world is created.

There are 2 kinds of layer available:

**Tile layers:** Used to add things to the map in a visual way using tiles from the corresponding tilesets. Select one of the tiles on a tileset to see the properties of that tile. With it selected, you can draw on the matching layer to add that tile to the world.

*Note: Make sure you have the right tileset selected when adding to a tile layer!
Tiles from a tileset must be added to the matching layer or they won't work.
Boundaries tileset -> Boundaries layer, etc.*

**Object layers:** Used for adding more complex features to the map.
There is only one object layer, *"Configurables"*, which as the name suggests, is for anything that needs to be configured in some way, such as entity spawners, entrances & exits, dungeon portals, etc.

*Note: Be careful when placing objects that you don't accidentally stack them on top of each other, as they can be hard to notice when stacked!*

## Shroud layer

Used to cover areas of the map for when generating the world map image, so unfinished and secret areas can be hidden.

<img src="tiled-shroud.png" alt="drawing" width="50%"/>

## Boundaries layer

A boundary is a way of marking an area of the map to behave in a specific way.

Currently the only meaningful boundary that can be applied is the *SafeZone* tile, which defines what tiles will disable PvP, so players cannot damage each other. Covers the main city area and banks.

The *Darkness* tile will possibly be used in the future for marking areas as being dark, even during the day, such as in caves or buildings.

<img src="tiled-boundaries.png" alt="drawing" width="50%"/>

## Configurables layer



## Statics layer

## Ground layer

# Changing the terrain

"Terrain" is a term used to cover anything about the game world that changes the geometry/shape of the world and is not interactive.
This includes walls, cliffs, boulders, fences, tables, benches, and so on.

By terrain I

# Spawn a creature



# Spawn an item pickup



# Entrances & exits

Many entrances can go to the same exit, and many exits can go to the same entrance.

Each exit can only have one entrance that it leads to.

# Add a dungeon portal

A list of valid dungeon names is defined in src/???


# Change the player spawn point







# Object types and their properties

## SpawnerArea

Defines an area into which entities will spawn.
Each spawner keeps a list of all of the entities that have been spawned from it, and replaces them when they are destroyed (creature dies, item pickup gets picked up or disappears, projectile hits something, etc.)

- EntityClassName *{String}* - The name of the class in the server JS file of the entity to spawn. Case sensitive.
- MaxAtOnce *{Number}* - How many entities can exist in the world at once that were created from this spawner.
- SpawnRate *{Number}* - How long to wait in milliseconds before this spawner will create another entity after an existing entity created by this spawner is destroyed.

## Entrance

An area that can be used to define where to move an entity to.
Usually paired with an exit, where the entrance is where a player will end up if they move into the exit tile.

- **EntranceName** *{String}* - Used to identify this entrance. Must be unique on the board the entrance is on. Another entrance with the same name can exist on a different board.

## Exit

Removes a player from one board and adds them to another, positioning them somewhere within an entrance on the board they are moved to.

- **TargetBoard** *{String}* - The name of the board to move the player to.
- **TargetEntranceName** *{String}* - The name of the entrance on the target board to move the player to. 

## DungeonPortal

Allows access to a dungeon map.
Functions similar to an exit in that it will move a player to a specified Entrance inside of a dungeon, but has criteria that must be met by the player that interacts with it, such as having a glory entry cost.

- **TargetBoard** *{String}* - The name of the board (must be a dungeon) to move the player to.
- **TargetEntranceName** *{String}* - The name of the entrance on the target dungeon board to move the player to. Usually *"dungeon-start"*.

## OverworldPortal
Only works inside of a dungeon map.
Activates when the dungeon boss is defeated.

Functions similar to an exit, in that it will move a player to a specified Entrance on the overworld map.

- **TargetBoard** *{String}* - The name of the board to move the player to.
- **TargetEntranceName** *{String}* - The name of the entrance on the target board to move the player to.