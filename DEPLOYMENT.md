# Deployment

This deployment guide assumes you are going to be running the game server on an Ubuntu or other linux based machine.

Getting a game server up and running on an Ubuntu machine is fairly straightforward, but below is some subject matter that you should be familiar with to understand the component parts of a successful deployment.

## Security | Reverse proxy | File server

The game server runs as an unsecured WebSocket (WS) server, which means that it will only accept regular WebSocket requests, but most browsers these days will warn users of unsecure connections, especially for a game like this one that has user credential input fields, so we will need to use WebSocket Secure (WSS) for secured connections.

We can keep running the game server on unsecure WS, and just have any requests routed to it through a reverse proxy that is secured. This allows us to still be able to access the game for development on localhost:4567 as we don't care about security when it is just for testing things locally.

We also need to have a file server running alongside the game server, so any requests to the web page the game is running on can load the game files, as they are not sent from the game server itself. This file server also needs to be secured, as a regular HTTP requests will cause the same browser security problems as above, so files must be served over HTTPS instead.

It would also be nice if we could automatically redirect any requests using unsecured protocols (HTTP) to the secured variant instead (HTTPS), so if a user mistakenly goes to the wrong URL they are redirected to the correct one.
i.e. `http://dungeonz.io/` -> `https://dungeonz.io`

Typically to do all of this we would have to request a digital certificate from from a certificate authority, install it, and configure our game server to load and use those certificates. This quickly becomes a long, error prone and headache inducing process. Luckily there is an easier way where we don't have to mess around much to set this up ourselves.

For this, Caddy is recommended, due to it's ease of setup, and the fact that almost straight out of the box it does everything we need:
- An ACME client (Certbot) to get digital certificates to upgrade our HTTP/WS to HTTPS/WSS.
- A file server to serve our built client files from /dungeonz/client
- A reverse proxy to send incoming WebSocket traffic to our game server running locally on localhost:4567.
- Automatic URL redirection.

https://caddyserver.com/

Though you may use whatever file server and reverse proxy tools you wish (Apache, NGINX, etc.) if you are already familiar, but I really think Caddy is the easiest and fastest to set up.

### Using Caddy

The project already has a Caddyfile for expected config that a typical deployment would use.

In the project root, run:

`echo "deb [trusted=yes] https://apt.fury.io/caddy/ /" \
    | sudo tee -a /etc/apt/sources.list.d/caddy-fury.list`

`sudo apt update`

`sudo apt install caddy`

This will download Caddy and then start it as a background service on completion, and it will automatically use the provided Caddyfile.

See the Caddy docs for further commands such as `caddy stop`, `caddy start`, `caddy reload`

## Running the game server | Creating a daemon

Now to actually start the game server.

To run the game server in the background as a service on your deployment machine (so you can close the terminal without also stopping the server, or do other things on it while the game is running), a daemon process manager is needed.

For this, PM2 is recommended, also for it's ease of setup.

https://pm2.keymetrics.io/

First, install PM2:

`sudo npm i pm2 -g`

Then in the project root (/dungeonz), run:

`pm2 start npm --name "Dungeonz game server" -- run server`

Wait a few seconds for the game server to finish starting and building the client files, then check it is running:

`pm2 list`

"Dungeonz game server" should appear in the list of running daemons. The terminal and your connection to the remote server can now be closed and the game will keep running.

## Misc info

### NPM problems

When deploying/updating there are a plethora of NPM related issues that can be very annoying to deal with.

A common solution to many of the problems that I have encountered with scripts not running or ENOENT type errors is simply to start the packages from a blank slate. In the project root, run:

`npm cache clean --force`

`rm -rf node_modules`

`rm -rf client/node_modules`

`rm -rf server/node_modules`

`rm -rf package-lock.json`

`rm -rf client/package-lock.json`

`rm -rf server/package-lock.json`

And then do a fresh reinstall of the packages.

`npm i`

### Reboot a machine

`sudo shutdown -r now`