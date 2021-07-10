# Minimal setup

This guide is intended for newbs who are interested in the project, but don't know where to begin, so I assume little existing knowledge about many things. If some things don't make sense, then let me know and I will update this document with clarification.

## To run the project, you will need

- [NodeJS](https://nodejs.org/en/download/) installed (currently using v12.19.0). This is the JavaScript runtime that runs the game code. The NodeJS installation will also come with NPM, which is a utility used to download other packages/libraries that are required by an application.
- [VSCode](https://code.visualstudio.com/) installed. This is the visual editor IDE where you will be making most of your changes. VSCode comes with git integrated to allow getting updates from the repository easier when it gets updated. You can use another code editor if you wish, but you will also need git installed and know how to use it.
- [Tiled](https://www.mapeditor.org/) installed (if you want to edit maps).

>***Note:*** To keep things as easy to set up for this guide, the MongoDB database for player account storage is not included, so persistent features (player account creation) will not work. Consult the full setup guide for running the game with a database.

## Getting started
You will need to download the project files and set up the development environment start editing files and hacking away.

All of the files are stored online in GitHub, and will first need to be copied from there to your own device for editing.

This can be done in VSCode using the git clone command from the interface.

On opening VSCode there should be a `Clone Git Repository...` option on the Getting Started page.

Select this, and into the prompt enter the project repository URL:

`https://github.com/Arcanorum/dungeonz`

and select Clone from URL.

[vscode git clone button]

This will copy the current version of the project from GitHub to your computer.

Not everything that the project needs to work is included in the repository. For the extra stuff, the external dependencies must be installed. This is done using NPM that came with the NodeJS installation.

Here we will need to use the terminal (AKA command line) to input the commands to run.

A new terminal can be opened within VSCode.

1. Top options bar
2. Terminal
3. New Terminal

[new ternjinaml gif]

And now you should see the terminal interface to enter commands.

[terminal interface]

In this terminal type out and then press enter:

`npm install`

Which will get the rest of the files (as defined in package.json) from NPM (this process might take a while) and add them to the *node_modules* folders which it should also create in *dungeonz*, *dungeonz/client* and *dungeonz/server*.

Now we should have everything needed to run the game.

In this same terminal run:

`npm run server:dev`

If everything went well, you should see an output like the following.

The game server is running, but the client (what the user sees in the browser) must be built and served.

Open another terminal (or split the existing one), so the server can remain running in the first terminal while we enter some more commands in another.

1. Top options bar
2. Terminal
3. Split Terminal

[split terminal]

Now in this new terminal, run:

`npm run client:dev`

Which may take a minute to start up, but when it does it should open the game in your prefered browser.
