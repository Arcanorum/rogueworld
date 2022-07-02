import { RowCol } from '@rogueworld/types';
import Entity from '../../../entities/classes/Entity';
import { StatusEffect } from '../../status_effects';

export default function applyStatusEffect(
    source: Entity,
    targetPosition?: RowCol,
    targetEntity?: Entity,
    statusEffectConfig?: {
        StatusEffect: typeof StatusEffect;
    },
) {
    if (!statusEffectConfig) return;

    // Target a specific entity if given.
    if (targetEntity) {
        targetEntity.addStatusEffect(statusEffectConfig.StatusEffect, source);
    }
    // If targetting a board tile, get any entity that is now on it.
    // Player might have chose to act on a specific tile, such as predicting where a target entity
    // will move to so act there instead.
    else if (targetPosition) {
        const boardTile = source.board?.getTileAt(targetPosition.row, targetPosition.col);
        if (!boardTile) return;

        const foundEntity = boardTile.getFirstEntity();
        if (!foundEntity) return;

        foundEntity.addStatusEffect(statusEffectConfig.StatusEffect, source);
    }
}
