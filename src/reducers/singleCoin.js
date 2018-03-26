import { SINGLE_COIN_DATA, COIN_UPDATE } from '../actions/types';

export default (state = {}, action) => {
    switch (action.type) {
        case SINGLE_COIN_DATA:
            return action.payload;
        case COIN_UPDATE:
            if (action.payload.short === state.short) {
                return action.payload;
            }
            return state;
        default:
            return state;
    }
}