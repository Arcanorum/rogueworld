const { model, Schema } = require("mongoose");

const integerValidator = {
    validator: Number.isInteger,
    message: "{VALUE} is not an integer value",
};

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
        Melee: { type: Number, default: 0, validate: integerValidator },
        Ranged: { type: Number, default: 0, validate: integerValidator },
        Magic: { type: Number, default: 0, validate: integerValidator },
        Gathering: { type: Number, default: 0, validate: integerValidator },
        Weaponry: { type: Number, default: 0, validate: integerValidator },
        Armoury: { type: Number, default: 0, validate: integerValidator },
        Toolery: { type: Number, default: 0, validate: integerValidator },
        Potionry: { type: Number, default: 0, validate: integerValidator },
        // Clanship: { type: Number, default: 0, validate: integerValidator },
    },
    { _id: false },
);

const taskSchema = new Schema(
    {
        taskID: { type: String, default: "KillRats" },
        progress: { type: Number, default: 0, validate: integerValidator },
        completionThreshold: { type: Number, default: 0, validate: integerValidator },
        rewardGlory: { type: Number, default: 0, validate: integerValidator },
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
        glory: { type: Number, default: 0, validate: integerValidator },
        bankUpgrades: { type: Number, default: 0, validate: integerValidator },
        bankItems: [itemSchema],
        inventory: [itemSchema],
        stats: statsSchema,
        tasks: [taskSchema],
    },
);

module.exports = model("Account", accountSchema);
