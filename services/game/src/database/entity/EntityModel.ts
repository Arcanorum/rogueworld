import { model, Schema } from 'mongoose';

export interface SavableEntityProperties {
    row: number;
    col: number;
    hitPoints?: number;
}

export interface EntityDocument extends SavableEntityProperties {
    typeCode: string;
}

const entitySchema = new Schema<EntityDocument>(
    {
        typeCode: { type: String },
        row: { type: Number },
        col: { type: Number },
        hitPoints: { type: Number },
    },
);

const EntityModel = model<EntityDocument>('Entity', entitySchema);

export default EntityModel;
