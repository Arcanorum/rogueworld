import { CallbackError, Document } from 'mongoose';
import EntityModel from './EntityModel';
import Entity from '../../entities/classes/Entity';

export { default as EntityModel, EntityDocument } from './EntityModel';

export function createEntityDocument(entity: Entity) {
    const { row, col, hitPoints } = entity;
    const { typeCode } = (entity.constructor as typeof Entity);

    EntityModel.create(
        {
            typeCode,
            row,
            col,
            hitPoints,
        },
        (err: CallbackError, res: Document) => {
            if(err) return;

            entity.documentId = res.id;
        },
    );
}

export function updateEntityDocument(id: string, entity: Entity) {
    //
}

export function deleteEntityDocument(id: string) {
    //
}
