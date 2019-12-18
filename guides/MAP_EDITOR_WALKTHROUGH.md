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



Every dungeon map should have properties for its difficulty (Difficulty), and a ID for the name of the dungeon in the text definitions spreadsheet (NameDefinitionID).

[adding difficulty and namedefinitionid prop]

With these in place, we should add the dungeon to the game and enter it to test that it works.

Enter a 


# Spawn a creature

# Spawn an item pickup

Pickaxe and hatchet

# Entrances & exits

Many entrances can go to the same exit, and many exits can go to the same entrance.

Each exit can only have one entrance that it leads to.

# Add a dungeon portal

A list of valid dungeon names is defined in src/???


# Change the player spawn point

