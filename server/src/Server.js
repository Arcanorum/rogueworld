const fs = require('fs');
const Utils = require("./Utils");
const pathToKeys = '../../../etc/letsencrypt/live/dungeonz.io/';

// Express config.
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '../../client/')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/index.html'));
});


// WebSocket config.
const WebSocket = require('ws');
let httpServer;
let wss;


// SSL check.
// If a certificate can be found, load it and use SSL.
if (fs.existsSync(pathToKeys + 'fullchain.pem')) {

    const https = require('https');
    httpServer = https.createServer({
        cert: fs.readFileSync(pathToKeys + 'fullchain.pem'),
        key: fs.readFileSync(pathToKeys + 'privkey.pem'),
    }, app).listen(443);

    Utils.message("Started HTTPS and WS servers on port", 443);

    const redirectApp = express();
    // Redirect all requests to the HTTP (port 80) server to the HTTPS server.
    redirectApp.all('*', (req, res, next) => {
        res.redirect('https://dungeonz.io');
    });
    // Create a basic HTTP server to catch HTTP 
    // requests and redirect to the HTTPS server.
    require('http').createServer(redirectApp).listen(80);

}
// No certificate found, use unsecure connections for development.
else {
    const http = require('http');
    httpServer = http.createServer(app).listen(80);

    Utils.message("Could not locate SSL certificate.");
    Utils.message("Started unsecure HTTP and WS servers on port", 80);
}

wss = new WebSocket.Server({
    server: httpServer
});

module.exports = wss;