const { model, Schema } = require("mongoose");

const itemSchema = new Schema(
    {
        typeCode: { type: String, default: "VRAS0927" }, // Glory orb
        quantity: { type: Number },
        durability: { type: Number },
        maxDurability: { type: Number },
    },
    { _id: false },
);

const statsSchema = new Schema(
    {
        Melee: { type: Number, default: 0 },
        Ranged: { type: Number, default: 0 },
        Magic: { type: Number, default: 0 },
        Gathering: { type: Number, default: 0 },
        Weaponry: { type: Number, default: 0 },
        Armoury: { type: Number, default: 0 },
        Toolery: { type: Number, default: 0 },
        Potionry: { type: Number, default: 0 },
        // Clanship: { type: Number, default: 0 },
    },
    { _id: false },
);

const taskSchema = new Schema(
    {
        taskID: { type: String, default: "KillRats" },
        progress: { type: Number, default: 0 },
        completionThreshold: { type: Number, default: 0 },
        rewardGlory: { type: Number, default: 0 },
        rewardItemTypeCodes: [{ type: String, default: "VRAS0927" }],
    },
    { _id: false },
);

const accountSchema = new Schema(
    {
        username: {
            type: String, required: true, index: true, unique: true,
        },
        password: { type: String, required: true },
        creationTime: { type: Date, default: Date.now() },
        lastLogOutTime: { type: Date, default: Date.now() },
        isLoggedIn: { type: Boolean, default: false },
        displayName: { type: String, default: "Savage" },
        glory: { type: Number, default: 0 },
        bankUpgrades: { type: Number, default: 0 },
        bankItems: [itemSchema],
        inventory: [itemSchema],
        stats: statsSchema,
        tasks: [taskSchema],
    },
);

module.exports = model("Account", accountSchema);
