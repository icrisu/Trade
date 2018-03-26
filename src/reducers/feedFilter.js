import { FEED_FILTER } from '../actions/types';

export default (state = '', action) => {
    switch (action.type) {
        case FEED_FILTER:
            return action.payload;
        default:
            return state;
    }
}
