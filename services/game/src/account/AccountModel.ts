import { model, Schema, Document } from 'mongoose';

// const integerValidator = {
//     validator: Number.isInteger,
//     message: "{VALUE} is not an integer value",
// };

class AccountDocument extends Document {
    [key: string]: unknown;
}

const statsIntegerValidator = {
    validator(this: AccountDocument, value: any) {
        if (Number.isInteger(value)) return true;

        // Find the offending property.
        Object.entries(this.toObject()).some(([ key, eachValue ]) => {
            if (!Number.isInteger(eachValue)) {
                this[key] = Math.floor(eachValue as number);
                return true;
            }
            return false;
        });

        return true;
    },
    message: '{VALUE} is not an integer value',
};

const taskIntegerValidator = {
    validator(this: AccountDocument, value: any) {
        if (Number.isInteger(value)) return true;

        // Find the offending property.
        if (!Number.isInteger(this.progress)) {
            this.progress = Math.floor((this.progress as number));
            return true;
        }
        if (!Number.isInteger(this.completionThreshold)) {
            this.completionThreshold = Math.floor((this.completionThreshold as number));
            return true;
        }
        if (!Number.isInteger(this.rewardGlory)) {
            this.rewardGlory = Math.floor((this.rewardGlory as number));
            return true;
        }

        return false;
    },
    message: '{VALUE} is not an integer value',
};

const accountIntegerValidator = {
    validator(this: AccountDocument, value: any) {
        if (Number.isInteger(value)) return true;

        // Find the offending property.
        if (!Number.isInteger(this.glory)) {
            this.glory = Math.floor((this.glory as number));
            return true;
        }
        if (!Number.isInteger(this.bankUpgrades)) {
            this.bankUpgrades = Math.floor((this.bankUpgrades as number));
            return true;
        }

        return false;
    },
    message: '{VALUE} is not an integer value',
};

const itemSchema = new Schema(
    {
        id: { type: String },
        typeCode: { type: String, default: 'VRAS0927' }, // Glory orb
        quantity: { type: Number },
        durability: { type: Number },
        maxDurability: { type: Number },
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
        taskId: { type: String, default: 'KillRats' },
        progress: { type: Number, default: 0, validate: taskIntegerValidator },
        completionThreshold: { type: Number, default: 0, validate: taskIntegerValidator },
        rewardGlory: { type: Number, default: 0, validate: taskIntegerValidator },
        rewardItemTypeCodes: [ { type: String, default: 'VRAS0927' } ], // Glory orb
    },
    { _id: false },
);

export interface AccountSchema extends Document {
    username: string;
    password: string;
    creationTime: number;
    lastLogOutTime: number;
    isLoggedIn: boolean;
    displayName: string;
    glory: number;
    bankUpgrades: number;
    // bankItems:
    inventoryItems: [];
    // stats: [];
    // tasks: object;
}

const accountSchema = new Schema(
    {
        username: {
            type: String, required: true, index: true, unique: true,
        },
        password: { type: String, required: true },
        creationTime: { type: Date, default: Date.now }, // TODO: check these, feels weird
        lastLogOutTime: { type: Date, default: Date.now }, // TODO: check these, feels weird
        isLoggedIn: { type: Boolean, default: false },
        displayName: { type: String, default: 'Savage' },
        glory: { type: Number, default: 0, validate: accountIntegerValidator },
        bankUpgrades: { type: Number, default: 0, validate: accountIntegerValidator },
        // bankItems: [ itemSchema ],
        inventoryItems: [ itemSchema ],
        // stats: statsSchema,
        // tasks: { type: Map, of: taskSchema },
    },
);

const AccountModel = model<AccountSchema>('Account', accountSchema);

export default AccountModel;
