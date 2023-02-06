import ActionsList from './ActionsList';
import Action from './Action';

function addAction(
    config: Action,
) {
    ActionsList[config.name] = config;
}

export default addAction;
