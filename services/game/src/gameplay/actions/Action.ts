import { RowCol } from '@rogueworld/types';
import Entity from '../../entities/classes/Entity';

export type ActionFunction = (
    source: Entity,
    targetPosition?: RowCol,
    targetEntity?: Entity,
    config?: any
) => void;

interface Action {
    /**
     * The unique name/ID of this action.
     */
    name: string;
    /**
     * The delay between this action being started and it being completed.
     * Can be cancelled/interupted during this time.
     */
    duration: number;
    /**
     * The function to run when this action completes.
     */
    run: ActionFunction;
    /**
     * A config object that can be used to pass extra details to the run function.
     */
    config?: any;
}

export default Action;
