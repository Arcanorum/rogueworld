import { RowCol } from '@rogueworld/types';
import Entity from '../../entities/classes/Entity';

export type ActionFunction = (
    source: Entity,
    targetPosition?: RowCol,
    targetEntity?: Entity,
    config?: any
) => void;

export type ConditionFunction = (
    source: Entity,
    targetPosition?: RowCol,
    targetEntity?: Entity,
    config?: any
) => boolean;

interface Action {
    /**
     * The unique name/ID of this action.
     */
    name: string;
    /**
     * The delay between this action being started and it being completed.
     * Can be cancelled/interrupted during this time.
     */
    duration: number;
    /**
     * The function to run when this action completes.
     */
    run?: ActionFunction;
    /**
    * The function to run to decide if this action should be ran.
     */
    condition?: ConditionFunction;
    /**
     * A config object that can be used to pass extra details to the run function.
     */
    config?: any;
    /**
     * Any action that can be considered to be helpful/useful to an entity, such as healing.
     */
    beneficial?: boolean;
}

export default Action;
