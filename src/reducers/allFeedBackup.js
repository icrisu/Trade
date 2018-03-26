import { COINS_FEED_ALL_BACKUP, COIN_UPDATE } from '../actions/types';
import _ from 'lodash';

export default (state = [], action) => {
    switch (action.type) {
        case COINS_FEED_ALL_BACKUP:
            return action.payload;
        case COIN_UPDATE:
            const indx = _.findIndex(state, o => { return o.short === action.payload.short; });
            if (indx !== -1) {
                let shallow = _.clone(state);
                try {
                    shallow[indx] = action.payload;
                } catch (e) {}
                return shallow;
            }
            return state;
        default:
            return state;
    }
}