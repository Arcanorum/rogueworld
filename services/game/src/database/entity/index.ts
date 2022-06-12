import { ObjectOfAny } from '@rogueworld/types';
import { warning } from '@rogueworld/utils';
import { CallbackError, Document } from 'mongoose';
import EntityModel, { EntityDocument } from './EntityModel';

export { default as EntityModel, EntityDocument } from './EntityModel';

export function createEntityDocument(
    data: EntityDocument,
    onSuccess: (documentId: string) => void,
) {
    EntityModel.create(
        data,
        (err: CallbackError, res: Document) => {
            if(err) {
                warning(err);
                return;
            }

            onSuccess(res.id);
        },
    );
}

export function updateEntityDocument(id: string, data: ObjectOfAny) {
    EntityModel.findByIdAndUpdate(id, data, undefined, (err) => {
        if(err) {
            warning(err);
        }
    });
}

export function deleteEntityDocument(id: string) {
    EntityModel.findByIdAndDelete(id, undefined, (err) => {
        if(err) {
            warning(err);
        }
    });
}

export async function getPaginatedEntityDocuments(page: number, limit: number) {
    return EntityModel
        .find()
        .limit(limit)
        .skip((page - 1) * limit)
        .exec();
}
