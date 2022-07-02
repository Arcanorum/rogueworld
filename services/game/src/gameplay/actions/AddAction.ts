import ActionsList from './ActionsList';
import { ActionFunction } from './Action';

function addAction(name: string, duration: number, run?: ActionFunction, config?: any) {
    ActionsList[name] = {
        name, duration, run, config,
    };
}

export default addAction;
