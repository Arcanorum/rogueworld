const path = require("path");
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const Utils = require("./Utils");
const settings = require("../settings");

const app = express();

const httpPort = 4567;

// Serve the client locally for development.
// Production should use a proper file server (i.e. Caddy).
if (settings.DEV_MODE) {
    app.use(express.static(path.join(__dirname, "../../client/build")));

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, "../../client/build/index.html"));
    });
}

app.get("/map/:z/:x/:y", (req, res) => {
    const { z, x, y } = req.params;

    res.sendFile(path.join(__dirname, `../map/leaflet-map/${z}/${x}/${y}`), (err) => {
        if (err) return res.sendStatus(404);
    });
});

const httpServer = http.createServer(app).listen(httpPort);

const wss = new WebSocket.Server({
    server: httpServer,
});

Utils.message("Started HTTP and WS servers on port", httpPort);

module.exports = {
    app,
    wss,
};
