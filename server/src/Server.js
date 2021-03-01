const Utils = require("./Utils");
const path = require("path");
const express = require("express");
const app = express();
const WebSocket = require("ws");
const http = require("http");
const settings = require("../settings");

const httpPort = 4567;
let httpServer;
let wss;

// Serve the client locally for development.
// Production should use a proper file server (i.e. Caddy).
if (settings.DEV_MODE) {
    app.use(express.static(path.join(__dirname, "../../client/")));

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "../../client/index.html"));
    });
}

app.get('/map/:z/:x/:y', function (req, res) {
    const {z, x, y} = req.params;
    res.sendFile(path.join(__dirname, `../map/leaflet-map/${z}/${x}/${y}`));
});

httpServer = http.createServer(app).listen(httpPort);

wss = new WebSocket.Server({
    server: httpServer
});

Utils.message("Started HTTP and WS servers on port", httpPort);

module.exports = {
    app,
    wss
};
