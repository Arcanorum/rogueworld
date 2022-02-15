import { model, Schema, Document, Types } from 'mongoose';

// const integerValidator = {
//     validator: Number.isInteger,
//     message: "{VALUE} is not an integer value",
// };

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
export interface ItemDocument {
    id: string;
    typeCode: string;
    quantity: number;
}

const itemSchema = new Schema<ItemDocument>(
    {
        id: { type: String },
        typeCode: { type: String, default: 'VRAS0927' }, // Glory orb
        quantity: { type: Number },
    },
    { _id: false },
);

export interface AccountDocument extends Document {
    username: string;
    password: string;
    creationTime: number;
    lastLogOutTime: number;
    isLoggedIn: boolean;
    displayName: string;
    glory: number;
    bankUpgrades: number;
    // bankItems:
    inventoryItems: Types.DocumentArray<ItemDocument>;
}

const accountSchema = new Schema( // TODO: figure out how to type this as the Account interface, weird Date issue...
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
    },
);

const AccountModel = model<AccountDocument>('Account', accountSchema);

export default AccountModel;


