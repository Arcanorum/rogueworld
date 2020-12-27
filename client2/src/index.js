import React from "react";
import ReactDOM from "react-dom";
import "./websocket_events/WebSocketEvents";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import gameConfig from "./shared/GameConfig";

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Import the data for each map.
function requireAll(r) {
    r.keys().forEach((fileName) => {
        let trimmedFileName;
        // Remove the "./" from the start.
        trimmedFileName = fileName.substring(2);
        // Remove the ".json" from the end.
        trimmedFileName = trimmedFileName.slice(0, -5);
        // Skip the blank map that is used as a base/template when making new maps.
        if (trimmedFileName === "BLANK") return;

        // eslint-disable-next-line global-require, import/no-dynamic-require
        gameConfig.mapsData[trimmedFileName] = require(`./assets/maps/${trimmedFileName}.json`);
    });
}
requireAll(require.context("./assets/maps/", true, /\.json$/));

// Check if the game should be run in dev mode by checking if it is localhost, or what other server to
// connect to based on the domain, i.e. go to test server for test.dungeonz.io, or live server for dungeonz.io
if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.hostname === "") {
    console.log("* Running in dev mode.");
    window.devMode = true;
    window.host = "local";
} else if (window.location.hostname === "test.dungeonz.io") {
    console.log("* Running in test mode.");
    window.devMode = true;
    window.host = "test";
} else {
    console.log("* Running in prod mode.");
    window.devMode = false;
    window.host = "live";
}
