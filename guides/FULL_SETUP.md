# Full setup

## You should understand to an intermediate level
- JavaScript/[NodeJS]((https://nodejs.org/en/download/) )
- [Git](https://git-scm.com/downloads)

## Would also be useful to know, depending on what you are doing
- [Phaser](https://phaser.io/) (rendering, input, audio playback)
- [React](https://reactjs.org/) (GUI)
- [MongoDB]((https://www.mongodb.com/download-center/community)) (player accounts storage)

## To run the project, you will need:
- NodeJS installed.
- MongoDB installed (or in a Docker container).
- Git installed.
- An IDE.
- A [GitHub](https://github.com/) account.
- Maybe a Git GUI client (such as GitHub Desktop).

## Quickstart

>***Note:*** The MongoDB database must already be running for the game server to start. If it is not running you will get an error when you try to start the game server.
>```
>DB connect error: Error: connect ECONNREFUSED 127.0.0.1:27017
>    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1056:14) {
>  name: 'MongoNetworkError',
>  errorLabels: [ 'TransientTransactionError' ],
>  [Symbol(mongoErrorContextSymbol)]: {}
>}
>```

Clone the project:

`git clone https://github.com/Arcanorum/dungeonz.git`

Enter the directory:

`cd dungeonz`

Install package dependencies:

`npm i`

Start the server with file watcher:

`npm run server:dev`

In another ternimal in the root of the project, start the client in dev mode:

`npm run client:dev`

>***Note:*** There are some resources that the server generates and adds to the client files when it starts that the client needs to work correctly, so when running with the file watchers every time the server restarts, the client may rebuild too. This is expected.

Finally, to open the client and play the game, go to http://localhost:3000 in a web browser.

<img src="client-loaded.png" width="50%"/>update with not using 4567 port