import { model, Schema } from 'mongoose';

export interface WorldDocument {
    spawnRow: number,
    spawnCol: number,
    level: number;
    highestLevelRecord: number,
}

const worldSchema = new Schema<WorldDocument>(
    {
        spawnRow: { type: Number },
        spawnCol: { type: Number },
        level: { type: Number },
        highestLevelRecord: { type: Number },
    },
);

const WorldModel = model<WorldDocument>('World', worldSchema);

export default WorldModel;
