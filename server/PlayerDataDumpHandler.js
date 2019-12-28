
const fs = require('fs');
const mongoose = require('mongoose');

const dumpedPlayerData = JSON.parse(fs.readFileSync('./PlayerDataDump.json', 'utf8'));
// Dumped data is expected to be an array.
if(Array.isArray(dumpedPlayerData) === false) process.exit();

let AccountModel;

async function logOut(data) {

    await AccountModel.findOne({username: data.accountUsername})
        .then(async (res) => {
            // If a document by the given username was NOT found, res will be null.
            if(!res){
                console.log(" NO account found!");
                return;
            }

            res.lastLogOutTime = Date.now();
            res.isLoggedIn = false;
            res.displayName = data.displayName;
            res.glory = data.glory;
            res.bankItems = data.bankItems;
            res.inventory = data.inventory;
            res.stats = data.stats;
            res.tasks = data.tasks;

            await res.save();
        })
        .catch((err) => {
            console.log("error:", err);
            // There was a problem, so exit so the dumped data doesn't get deleted by unlink.
            process.exit();
        });
}

(async () => {

    await mongoose.connect('mongodb://localhost/accounts', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
        .catch((err) => {
            console.log("DB connect error:", err);
        });

    mongoose.connection.on('error', (err) => {
        console.error('DB connection error:', err);
        // Cannot connect to database, so exit so the dumped data doesn't get deleted by unlink.
        process.exit();
    });

    // Ensure this is the same schema as in AccountManager.js.
    const accountSchema = new mongoose.Schema({
        username:       {type: String,  required: true},
        password:       {type: String,  required: true},
        creationTime:   {type: Date,    default: Date.now()},
        lastLogOutTime: {type: Date,    default: Date.now()},
        isLoggedIn:     {type: Boolean, default: false},
        displayName:    {type: String,  default: "Savage"},
        glory:          {type: Number,  default: 0},
        bankItems:      {type: Array,   default: []},
        inventory:      {type: Object,  default: {}},
        stats:          {type: Object,  default: {}},
        tasks:          {type: Object,  default: {}},
    });

    AccountModel = mongoose.model('Account', accountSchema);

    // Log out each of the players whose data is in the dump.
    for(let i=0; i<dumpedPlayerData.length; i+=1){
        await logOut(dumpedPlayerData[i]);
    }

    // Delete the temp player data dump file.
    fs.unlinkSync('./PlayerDataDump.json');

    // All done, this process is no longer needed.
    process.exit();
})();