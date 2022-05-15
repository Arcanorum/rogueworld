import { RowCol } from '@rogueworld/types';
import Entity from '../../entities/classes/Entity';
import Damage from '../Damage';

export default function basicAttack(
    source: Entity,
    targetPosition?: RowCol,
    targetEntity?: Entity,
    damageConfig?: Damage,
) {
    if(!damageConfig) return;

    // Target a specific entity if given.
    if(targetEntity) {
        targetEntity.damage(damageConfig, source);
    }
    // If targetting a board tile, get any entity that is now on it.
    // Player might have chose to attack a specific tile, such as predicting where a target entity
    // will move to so attacking there instead.
    else if(targetPosition) {
        const boardTile = source.board?.getTileAt(targetPosition.row, targetPosition.col);
        if(!boardTile) return;

        const foundEntity = boardTile.getFirstEntity();
        if(!foundEntity) return;

        foundEntity.damage(damageConfig, source);
    }
}
