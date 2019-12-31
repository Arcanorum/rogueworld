
const fs = require('fs');
const WebSocket = require('ws');
const portNumber = 3000;
const pathToKeys = '../../../etc/letsencrypt/live/test.waywardworlds.com/';
let server;
let wss;

if(fs.existsSync(pathToKeys + 'fullchain.pem')){
    //const https = require('https');
    //server = new https.createServer({
    //    cert:   fs.readFileSync(pathToKeys + 'fullchain.pem'),
    //    key:    fs.readFileSync(pathToKeys + 'privkey.pem'),
    //});
    //wss = new WebSocket.Server({server});
    //server.listen(portNumber);
    //console.log("* Started HTTPS server on port", portNumber);
}
else {
    wss = new WebSocket.Server({port: portNumber});
    //console.log("* Could not locate SSL certificate.");
}

const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, '../../client/')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/index.html'));
});

app.listen(4567);

module.exports = wss;