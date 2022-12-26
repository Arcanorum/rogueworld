import { warning } from '@rogueworld/utils';
import { isDBConnected } from '..';
import WorldModel, { WorldDocument } from './WorldModel';

export { default as WorldModel, WorldDocument } from './WorldModel';

export function updateWorldDocument(data: WorldDocument) {
    if (!isDBConnected()) return;

    const dataToSave = data;

    if (dataToSave.level > dataToSave.highestLevelRecord) {
        dataToSave.highestLevelRecord = dataToSave.level;
    }

    WorldModel.findOneAndUpdate(undefined, data, { upsert: true }, (err) => {
        if (err) {
            warning(err);
        }
    });
}
