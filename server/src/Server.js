const fs = require("fs");
const Utils = require("./Utils");
// const pathToKeys = "../../../etc/letsencrypt/live/dungeonz.io/";

// Express config.
const express = require("express");
const path = require("path");
const app = express();
const httpPort = 4567;
// const httpsPort = 443;

app.use(express.static(path.join(__dirname, "../../client/")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/index.html"));
});


// WebSocket config.
const WebSocket = require("ws");
let httpServer;
let wss;


// SSL check.
// If a certificate can be found, load it and use SSL.
// if (fs.existsSync(pathToKeys + "fullchain.pem")) {
//     const https = require("https");
//     httpServer = https.createServer({
//         cert: fs.readFileSync(pathToKeys + "fullchain.pem"),
//         key: fs.readFileSync(pathToKeys + "privkey.pem"),
//     }, app).listen(443);

//     Utils.message("Started HTTPS and WS servers on port", httpsPort);

//     const redirectApp = express();
//     // Redirect all requests to the HTTP server to the HTTPS server.
//     redirectApp.all("*", (req, res, next) => {
//         res.redirect("https://dungeonz.io");
//     });
//     // Create a basic HTTP server to catch HTTP 
//     // requests and redirect to the HTTPS server.
//     require("http").createServer(redirectApp).listen(httpPort);
// }
// // No certificate found, use unsecure connections for development.
// else {
    

//     Utils.message("Could not locate SSL certificate.");
// }

const http = require("http");
httpServer = http.createServer(app).listen(httpPort);
Utils.message("Started unsecure HTTP and WS servers on port", httpPort);

wss = new WebSocket.Server({
    server: httpServer
});

module.exports = {
    app,
    wss
};