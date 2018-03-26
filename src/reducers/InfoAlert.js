import { OPEN_ALERT } from '../actions/types';

export default (state = false, action) => {
    switch (action.type) {
        case OPEN_ALERT:
            return action.payload;
        default:
            return state;
    }
}
