const { model, Schema } = require("mongoose");

// const integerValidator = {
//     validator: Number.isInteger,
//     message: "{VALUE} is not an integer value",
// };

const statsIntegerValidator = {
    validator(value) {
        if (Number.isInteger(value)) return true;

        // Find the offending property.
        Object.entries(this.toObject()).some(([key, eachValue]) => {
            if (!Number.isInteger(eachValue)) {
                this[key] = Math.floor(eachValue);
                return true;
            }
            return false;
        });

        return true;
    },
    message: "{VALUE} is not an integer value",
};

const taskIntegerValidator = {
    validator(value) {
        if (Number.isInteger(value)) return true;

        // Find the offending property.
        if (!Number.isInteger(this.progress)) {
            this.progress = Math.floor(this.progress);
            return true;
        }
        if (!Number.isInteger(this.completionThreshold)) {
            this.completionThreshold = Math.floor(this.completionThreshold);
            return true;
        }
        if (!Number.isInteger(this.rewardGlory)) {
            this.rewardGlory = Math.floor(this.rewardGlory);
            return true;
        }

        return false;
    },
    message: "{VALUE} is not an integer value",
};

const accountIntegerValidator = {
    validator(value) {
        if (Number.isInteger(value)) return true;

        // Find the offending property.
        if (!Number.isInteger(this.glory)) {
            this.glory = Math.floor(this.glory);
            return true;
        }
        if (!Number.isInteger(this.bankUpgrades)) {
            this.bankUpgrades = Math.floor(this.bankUpgrades);
            return true;
        }

        return false;
    },
    message: "{VALUE} is not an integer value",
};

const itemSchema = new Schema(
    {
        typeCode: { type: String, default: "VRAS0927" }, // Glory orb
        quantity: { type: Number },
        durability: { type: Number },
        maxDurability: { type: Number },
        weightReduce: { type: Number, default: 0 },
    },
    { _id: false },
);

const statsSchema = new Schema(
    {
        Melee: { type: Number, default: 0, validate: statsIntegerValidator },
        Ranged: { type: Number, default: 0, validate: statsIntegerValidator },
        Magic: { type: Number, default: 0, validate: statsIntegerValidator },
        Gathering: { type: Number, default: 0, validate: statsIntegerValidator },
        Weaponry: { type: Number, default: 0, validate: statsIntegerValidator },
        Armoury: { type: Number, default: 0, validate: statsIntegerValidator },
        Toolery: { type: Number, default: 0, validate: statsIntegerValidator },
        Potionry: { type: Number, default: 0, validate: statsIntegerValidator },
        // Clanship: { type: Number, default: 0, validate: statsIntegerValidator },
    },
    { _id: false },
);

const taskSchema = new Schema(
    {
        taskId: { type: String, default: "KillRats" },
        progress: { type: Number, default: 0, validate: taskIntegerValidator },
        completionThreshold: { type: Number, default: 0, validate: taskIntegerValidator },
        rewardGlory: { type: Number, default: 0, validate: taskIntegerValidator },
        rewardItemTypeCodes: [{ type: String, default: "VRAS0927" }], // Glory orb
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
        glory: { type: Number, default: 0, validate: accountIntegerValidator },
        bankUpgrades: { type: Number, default: 0, validate: accountIntegerValidator },
        bankItems: [itemSchema],
        inventoryItems: [itemSchema],
        stats: statsSchema,
        tasks: { type: Map, of: taskSchema },
    },
);

module.exports = model("Account", accountSchema);
