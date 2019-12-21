# Getting started: Map editor - Walkthrough

This guide covers creating and editing the game world maps, such as the main overworld, and dungeons.

It is structured as a walkthough that you can follow along with that demonstrates most of the core features.

All maps are built using Tiled map editor, which you will need to have installed. https://www.mapeditor.org/

# Setting up Tiled

There are a few small things that need to be done to configure Tiled to work best with the game's workflow.

- If you experience that Tiled crashes (often when zoomed out far) or that it stutters a lot, try disabling hardware accelerated drawing in Preferences.

<img src="tiled-opengl.png" width="50%"/>

- You should enable 'Snap to Grid' mode, given the grid based nature of the game.

<img src="tiled-grid-snap.png" width="50%"/>

- You will need to import the object types file, which contains the default config of each object type.

<img src="tiled-object-types.gif" width="50%"/>

# Creating a new dungeon

Let's create a basic dungeon and add it to the game.

There is a blank template that can be used to start any new maps, */server/map/BLANK.json*

Make a copy of this file, and rename it to whatever you want the dungeon to be called, following the naming convention of the existing dungeon map files.

[copy blank.json gif]

***Note:*** To disable a map file so that it will not be loaded by the server when it starts, add a '#' to the front of the file name.

[pound symbol disable image]

Now we can open it in Tiled to edit it.

[open in tiled gif]

If everything went OK, then we should have a grassy field, with a few default objects already added which every dungeon should have.

These are
- An entrance (where players arrive into the dungeon)
- An exit (where players leave the dungeon)
- An optional entity spawner (for adding a boss to the dungeon).

With these in place, we should enter the dungeon to test that it works.

To enter a dungeon, a dungeon portal entity for the player to interact with is needed. Most dungeons portals are found on the Overworld map, so let's add one.

# Adding a dungeon portal

Open *overworld.json* in Tiled.

[open overworld json map gif]

Find where ever the primary player spawn point is on the overworld so we don't have to go far to reach the dungeon portal.

[city-spawn entrance pic]

Using the *Insert Tile* tool, select the dungeon portal tile from the *statics* tileset add an entity nearby.

***Note:*** Dungeon portals need to be configured, so you need to also have the *Configurables* layer selected when adding the entity.

[select insert tile tool, add dungeon portal]

Now we can set the target map for this dungeon portal to go to; The one we just created.

Using the *Select Objects* tool, select the dungeon portal, and set the *TargetBoard* property to be the file name of the dungeon map, and set the *TargetEntranceName* property to the name of the entrance you want the player to spawn into, which for most dungeons should be `dungeon-start`.

[set properties on dungeon portal]

Now our dungeon is wired up and ready for its first visitor!

# Enter the dungeon

Open a terminal in the */dungeonz* directory, start the server (`npm run server`), wait for the server to finish starting, then in another terminal build the client (`npm run client`).

Now we can open the game in a browser to play and have a look around.

[log in and enter dungeon and move around and exit back to overworld]

Cool, everything works. Now let's customise the dungeon map.

# Editing the map

As for how you design and lay out the map, that is up to you.

I usually start by deciding what the ground is going to look like, as it is a quick way to get a feel of the size of the usable space and to plan out the paths I want players to take within the map.

If you haven't already, I would advise reading through the [map editor reference](MAP_EDITOR_REFERENCE.md) to get familiar with what editable features of a map are available, as I won't be going over all of them in this walkthough.

# Editing the ground



Empty tile to mark areas that can't walked on and represent an area that it doesn't make sense to see, such as with an underground map.

# Spawn a creature

# Spawn an item pickup

Pickaxe and hatchet

# Entrances & exits

Many entrances can go to the same exit, and many exits can go to the same entrance.

Each exit can only have one entrance that it leads to.



# Change the player spawn point

# Finishing steps

Every dungeon map should have properties set for its difficulty (*Difficulty*), and a ID for the name of the dungeon in the text definitions spreadsheet (*NameDefinitionID*).

[adding difficulty and namedefinitionid props]



The dungeon name definition is the display name of the dungeon as found in the text definitions spreadsheet. Add an entry to the spreadsheet next to the other dungeon names with the name you want players to see the dungeon as. (Restart the server then rebuild the client client to see the changes when you go to play).