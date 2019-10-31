
var counter = 0;
function registerChatWarningID () {
    counter += 1;
    console.log("* Registering chat warning, ID: ", counter);
    return counter;
}

const ChatWarnings = {
    "Leave town warning":           registerChatWarningID(),
    "Already in clan warning":      registerChatWarningID(),
};

// Write the warning message definition IDs to the client, so the client knows what message text to use for each warning.
const fs = require('fs');
let dataToWrite = {};

for(let key in ChatWarnings){
    // Don't check prototype properties.
    if(ChatWarnings.hasOwnProperty(key) === false) continue;
    // Add this chat warning ID to the catalogue.
    // The ID number of the warning will be the key, and the key (the text definition ID) will be the value.
    dataToWrite[ChatWarnings[key]] = key;
}

// Check the catalogue exists. Catches the case that this is the deployment server
// and thus doesn't have a client directory, and thus no catalogue.
if (fs.existsSync('../client/src/catalogues/ChatWarnings.json')) {
    // Turn the data into a string.
    dataToWrite = JSON.stringify(dataToWrite);

    // Write the data to the file in the client files.
    fs.writeFileSync('../client/src/catalogues/ChatWarnings.json', dataToWrite);

    console.log("* Chat warnings catalogue written to file.");
}

module.exports = ChatWarnings;