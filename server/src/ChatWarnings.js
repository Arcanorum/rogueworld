const Utils = require("./Utils");

var counter = 0;
function registerChatWarningID() {
    counter += 1;
    //Utils.message("Registering chat warning, ID: ", counter);
    return counter;
}

const ChatWarnings = {
    "Leave town warning": registerChatWarningID(),
    "Already in clan warning": registerChatWarningID(),
};

// Write the warning message definition IDs to the client, so the client knows what message text to use for each warning.
const fs = require('fs');
let dataToWrite = {};

for (let key in ChatWarnings) {
    // Don't check prototype properties.
    if (ChatWarnings.hasOwnProperty(key) === false) continue;
    // Add this chat warning ID to the catalogue.
    // The ID number of the warning will be the key, and the key (the text definition ID) will be the value.
    dataToWrite[ChatWarnings[key]] = key;
}

// Turn the data into a string.
dataToWrite = JSON.stringify(dataToWrite);

Utils.checkClientCataloguesExists();

// Write the data to the file in the client files.
fs.writeFileSync('../client/src/catalogues/ChatWarnings.json', dataToWrite);

Utils.message("Chat warnings catalogue written to file.");

module.exports = ChatWarnings;