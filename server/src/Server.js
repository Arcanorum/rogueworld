
const serverPortNumber = 4567;
const fs = require('fs');
const pathToKeys = '../../../etc/letsencrypt/live/dungeonz.io/';
const useSecure = fs.existsSync(pathToKeys + 'fullchain.pem');

// Express config.
const express = require('express');
const path = require('path');
const app = express();

if(useSecure){
    app.all('*', (req, res, next) => {
        console.log("ensure secure:", 'https://' + req.hostname + req.url);
        if(req.secure){
          // OK, continue
          return next();
        };
        // handle port numbers if you need non defaults
        // res.redirect('https://' + req.host + req.url); // express 3.x
        res.redirect('https://' + req.hostname + req.url); // express 4.x
    });
}

app.use(express.static(path.join(__dirname, '../../client/')));

app.get('/', (req, res) => {
    res.send("Loading...");
    res.sendFile(path.join(__dirname, '../../client/index.html'));
});


// WebSocket config.
const WebSocket = require('ws');
let httpServer;
let wss;


// SSL check.
// If a certificate can be found, load it and use SSL.
if(fs.existsSync(pathToKeys + 'fullchain.pem')){

    const https = require('https');
    httpServer = https.createServer({
       cert:   fs.readFileSync(pathToKeys + 'fullchain.pem'),
       key:    fs.readFileSync(pathToKeys + 'privkey.pem'),
    }, app).listen(443);

    console.log("* Started HTTPS and WS servers on port", serverPortNumber);

    // Create a basic HTTP server to catch HTTP 
    // requests and redirect to the HTTPS server.
    require('http').createServer(app).listen(80);

}
// No certificate found, use unsecure connections for development.
else {
    const http = require('http');
    httpServer = http.createServer(app).listen(80);

    console.log("* Could not locate SSL certificate.");
    console.log("* Started unsecure HTTP and WS servers on port", serverPortNumber);
}

//httpServer.listen(serverPortNumber);

wss = new WebSocket.Server({
    server: httpServer
});

module.exports = wss;