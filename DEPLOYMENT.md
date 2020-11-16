# Deployment

## Security & reverse proxy

Getting a game server up and running on an Ubuntu machine is fairly straightforward.

The game server runs as unsecured NodeJS server, which means that it will only accept regular HTTP requests, but most browsers these days will warn users of unsecure connections, especially for a game like this one that has user credential input fields, so we will need to use HTTPS for secured connections. Luckily we don't have to mess around much to set this up ourselves.

We can keep running the server on unsecure HTTP, and just have any requests routed to it through a reverse proxy that is secured. This allows us to still be able to access the game for development on localhost:4567 as we don't care about security when it is just for testing things locally.

For this, Caddy is recommended, due to it's ease of setup. The project already has a Caddyfile for expected config.

https://caddyserver.com/docs/download

https://caddyserver.com/docs/getting-started

Though you may use whatever reverse proxy you wish (Apache, NGINX, etc.) if you are already familiar.

## Using Caddy
`echo "deb [trusted=yes] https://apt.fury.io/caddy/ /" \
    | sudo tee -a /etc/apt/sources.list.d/caddy-fury.list`

`sudo apt update`

`sudo apt install caddy`

`caddy stop`

`caddy start`

`caddy reload`

## Creating a service

You may want to run the game server in the background as a service on your deployment machine (so you can close the terminal without also stopping the server, or do other things on it while the server is running), and for this you can use the provided service file in the project root directory, `dungeonz.service`.

The file simply needs to be copied to `/etc/systemd/system/`

In a terminal, go to the project root and run:

`cp dungeonz.service /etc/systemd/system/dungeonz.service`

Give it permissions:

`chmod 644 /etc/systemd/system/dungeonz.service`

And use the service with:

`sudo systemctl start dungeonz`

`sudo systemctl status dungeonz`

`sudo systemctl restart dungeonz`

`sudo systemctl stop dungeonz`

## Reboot a server

`sudo shutdown -r now`