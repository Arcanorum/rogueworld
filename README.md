# Dungeonz
## Everything for the game Dungeonz.

Greetings! You have stumbled upon the work area for Dungeonz, the free, browser based, massively multiplayer online RPG.

## *What is this?*
This is the central code repository for Dungeonz.

Dungeonz is open-source, meaning that anyone is free to see all aspects of how the game works on a technical level, and can also contribute to the project, such as adding new creatures, items, dungeons, balancing, fixing bugs, and whatever else will make the game better.

Here you can find basically everything that goes into the game, what is currently being worked on, and how you can help!

The creation of Dungeonz is a collaborative effort, with content and mechanics able to be added by members of the community.

#### ***This readme is intended for dummies who are interested in the project, but don't know where to begin, so I assume little existing knowledge about many things. If you are already a big-brain, you can probably skip most of this readme.***

## *Ok, cool, where do I start?*
Before you jump into the code and start adding cool new features, there are some things you will need.

**You should understand to an intermediate level:**
- JavaScript (JS)
- Git

**You should also have:**
- NodeJS installed (currently using v12.9.1)
- An IDE installed (such as VSCode or WebStorm)
- Git installed
- A GitHub account
- And probably a Git GUI client (such as GitHub Desktop)

### Setup
You will need to download and set up the project to start editing files and hacking away.

Open a command line wherever you want the project folder to be, and enter:

`git clone https://github.com/Arcanorum/dungeonz.git`

Which will copy the current version of the project from GitHub to your computer.

Not everything that the project needs to work is included in the repository. For the extra stuff (external dependencies), in the command line in the same directory as the project, run:

`npm i` (Shorthand for `npm install`)

Which will get the rest of the files (as defined in package.json) from NPM and add them to the node_modules folder which it should also create.

### Building and running
To start the server, run `node index` in a command line terminal.

## *I want to add a...*
Features are divided into two rough categories:

### **Mechanics:**
Things like movement, collision, creating entities, AI, etc. that affects the fundamental flow of the game. Due to how they are often intricately tied to many other things, these are mostly handled by me, with input from the community.

### **Content:**
Things that implement mechanics to give players stuff to do, such as resources to gather, items to craft, creatures to slay, structures to build, etc.

#### [Creature](CREATURES.md)

#### [Item](ITEMS.md)

#### [Crafting recipe](CRAFTING_RECIPES.md)

#### [Dungeon](DUNGEONS.md)


For any questions about this project or the game in general, join the Discord server at https://discord.gg/7wjyU7B
