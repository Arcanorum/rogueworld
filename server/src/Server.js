// Express config.
const express = require('express');
const path = require('path');
const app = express();
const expressPortNumber = 4567;

app.use(express.static(path.join(__dirname, '../../client/')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/index.html'));
});


// WebSocket config.
const WebSocket = require('ws');
const webSocketPortNumber = 3000;
let httpServer;
let wss;


// SSL check.
const fs = require('fs');
const pathToKeys = '../../../etc/letsencrypt/live/dungeonz.io/';
// If a certificate can be found, load it and use SSL.
if(fs.existsSync(pathToKeys + 'fullchain.pem')){
    const https = require('https');
    httpServer = https.createServer({
       cert:   fs.readFileSync(pathToKeys + 'fullchain.pem'),
       key:    fs.readFileSync(pathToKeys + 'privkey.pem'),
    }, app);

    console.log("* Started HTTPS server on port", expressPortNumber);
    console.log("* Started WS server using SSL on port", webSocketPortNumber);
}
// No certificate found, use unsecure connections for development.
else {
    const http = require('http');
    httpServer = http.createServer(app);

    console.log("* Could not locate SSL certificate.");
    console.log("* Started unsecure HTTP server on port", expressPortNumber);
    console.log("* Started unsecure WS server on port", webSocketPortNumber);
}

wss = new WebSocket.Server({
    server: httpServer,
    port: webSocketPortNumber
});

httpServer.listen(expressPortNumber);

module.exports = wss;