import { model, Schema } from 'mongoose';

export interface EntityDocument {
    id: string;
    typeCode: string;
    row: number;
    col: number;
    hitPoints: number;
}

const entitySchema = new Schema<EntityDocument>(
    {
        id: { type: String },
        typeCode: { type: String }, // Wooden fence
        row: { type: Number },
        col: { type: Number },
        hitPoints: { type: Number },
    },
    { _id: false },
);

const EntityModel = model<EntityDocument>('Entity', entitySchema);

export default EntityModel;
