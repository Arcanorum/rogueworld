import PubSub from 'pubsub-js';
import eventResponses from './EventResponses';
import { CREATE_ACCOUNT_FAILURE, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE } from '../../shared/EventTypes';
import { ApplicationState } from '../../shared/state';
import { message } from '../../../../../shared/utils';

export default () => {
    eventResponses.create_account_success = () => {
        message('create_account_success');

        ApplicationState.setLoggedIn(true);
    };

    eventResponses.create_account_failure = (data) => {
        message('create_account_failure:', data);

        if (data) {
            PubSub.publish(CREATE_ACCOUNT_FAILURE, data);
        }
    };

    eventResponses.change_password_success = () => {
        message('change_password_success');

        PubSub.publish(CHANGE_PASSWORD_SUCCESS);
    };

    eventResponses.change_password_failure = (data) => {
        message('change_password_failure:', data);

        if (data) {
            PubSub.publish(CHANGE_PASSWORD_FAILURE, data);
        }
    };
};
