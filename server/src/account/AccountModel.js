const { model, Schema } = require("mongoose");

const accountSchema = new Schema({
    username: {
        // Account usernames must be unique.
        type: String, required: true, index: true, unique: true,
    },
    password: { type: String, required: true },
    creationTime: { type: Date, default: Date.now() },
    lastLogOutTime: { type: Date, default: Date.now() },
    isLoggedIn: { type: Boolean, default: false },
    displayName: { type: String, default: "Savage" },
    glory: { type: Number, default: 0 },
    bankItems: { type: Array, default: [] },
    inventory: { type: Object, default: {} },
    stats: { type: Object, default: {} },
    tasks: { type: Object, default: {} },
});

module.exports = model("Account", accountSchema);
