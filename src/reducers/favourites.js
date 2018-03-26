import { FAVOURITE_ADD, FAVOURITE_REMOVE } from '../actions/types';
import _ from 'lodash';
import Storage from '../services/StorageService';

export default (state = {}, action) => {
    switch (action.type) {
        case FAVOURITE_ADD:
            if (!action.payload || state[action.payload]) {
                return state;
            }
            let c = _.clone(state);
            c[action.payload] = action.payload;
            Storage.setFavoritesData(c);
            return c;
        case FAVOURITE_REMOVE:
            if (state[action.payload]) {
                let c = _.clone(state);
                delete c[action.payload];
                Storage.setFavoritesData(c);
                return c;
            }            
            return state;             
        default:
            return state;
    }
}
