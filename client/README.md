## What is this?
This is the code repository for the dungeonz.io game client. Everything that gets ran on the client for the game to be playable is in here.

It can be used for making custom clients, mods, fixing bugs, new featues, etc.

## Getting started

This guide is intended for dummies, and as such goes into some introductory concepts and basic detail needed to get hopefully anyone able to get things working.

A good understanding of the following is advised:

- JavaScript: The programming language used for the majority of the code found here.

- Phaser.io (CE): The game development framework the client uses for things like rendering, audio playback, animations, tweening, some input handling.

- Node.js & NPM: Node is a runtime environment that allows you to run JavaScript code outside of a web browser. Used for running webpack.

- Webpack: This is used to take all of the source code files and pack them together into one file.

- Git (or a git GUI client): A source version control system that works as a way to keep one central place for the code to live. This is needed for creating your own version of this repository, which you can make changes to. It also allows you to propose that changes you have made to be added back to this central repo.

- Command line: Moving through directories and running commands.

- A code editor: Notepad++ will work I guess, but something more sophisticated like VS Code or WebStorm is advised.

## Cloning the repo

You are probably reading this on the repository page, which is where all of the game client assets are kept.

You cannot make changes to anything here directly. Instead, you will need to clone this git repo.

This means to make a copy of this repository (repo) on your own machine, which will download all of the files here.

With the repository cloned, you can then start making changes to the files on your own machine.

To clone the repository using git, you will need git installed. Windows download link:

https://git-scm.com/download/win

All of the default settings should be fine (unless you feel like changing them), although using Vim as the default editor is not advised.

Assuming basic setup has been successful, you can now use git to clone this repo.

Open a command line terminal, and run:

`git clone https://bitbucket.org/waywardworlds/dungeonz.io-client.git`

This will download the files to the **current** directory, so if you want the files to be in your /Desktop folder for example, your terminal will need to be in that directory when you run the command.

A folder called 'dungeonz.io-client' should have appeared, with the project files inside.

## Setting up a web server

Right now, the folder that was cloned contains the same files used by the live game you would find at https://dungeonz.io

You can even play the game using these files from your own computer.

This project assumes Chrome is being used, as other browsers have very unreliable support for many features (particularly CSS) that are used frequently.

Try opening index.html

You will see a lot of errors logged to the console, complaining about 'CORS'. For this project, you will need to access the files through a web server. For a detailed explanation as to why, check out:

https://phaser.io/tutorials/getting-started-phaser2/index

I will be going with the **http-server** package, found on NPM (https://www.npmjs.com/package/http-server), as it is very lightweight, fast to set up, and simple to use. Install it via the command line with:

`npm install http-server -g`

Then (while in the /dungeonz.io-client directory), a basic web server can be started by using:

`http-server`

Now open in a new tab:

http://127.0.0.1:8080/index.html

And now the game should be playable as if you were on the main site.

## Building your code with Webpack

Ok, so the game works, but now for making your own changes.

Most of the actual code you will want to change is in /src.

There are many files and it is impractical to load so many individual files when someone comes to the game, so they are combined into one big file, known as a distributable, or dist, which significantly reduces load times.

You must create this dist file (called *main.js* by convention) yourself to see any of the code changes you make take effect.

To do this, webpack is used. https://webpack.js.org/

While still in /dungeonz.io-client, run:

`npm install`

This will install webpack and any other dependencies the project has into the node_modules folder.

Now webpack can be ran to bundle the source files together into a *main.js* file, which will be exported to /dist, using:

`npm run dev`

This runs the script in the package.json file called *"dev"*, which in turn runs `webpack --mode development`.

Now refresh the game page, and your changes will be loaded.

You might need to disable caching to ensure changes are loaded instead of an older version.

Go to the Chrome dev tools settings (press F12, then F1), and under Network, tick "Disable cache (while DevTools is open)".

For any problems or questions, I am usually on the Discord server. (https://discord.gg/7wjyU7B)