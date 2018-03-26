import { ADD_PORTFOLIO, ALL_PORTFOLIO, REMOVE_PORTFOLIO } from '../actions/types';
import _ from 'lodash';

export default (state = {}, action) => {
    switch (action.type) {
        case ADD_PORTFOLIO:
            let cl = _.clone(state);
            cl[action.payload.coinData.short] = action.payload;
            return cl;
        case REMOVE_PORTFOLIO:
            let removeClone = _.clone(state);
            if (!_.isEmpty(removeClone[action.payload])) {
                delete removeClone[action.payload];
                return removeClone;
            }            
            return state;
        case ALL_PORTFOLIO:
            return state;                      
        default:
            return state;
    }
}