import { PUSH_CHUNK_DATA } from '../actions/types';
import { MAX_FEED_ON_PAGE } from '../config';
import _ from 'lodash';

export default (state = { feeds: [], lastPage: false, page: 0, totalItems: 0 }, action) => {
    switch (action.type) {
        case PUSH_CHUNK_DATA:
            if (action.payload) {
                if (action.payload.returnEmpty === true) {
                    return { feeds: [], lastPage: false, page: 0, totalItems: 0 };
                }

                if (_.isNumber(action.payload.page)) {
                    const allCoins = action.payload.allCoins;
                    const totalPages = Math.ceil(allCoins.length / MAX_FEED_ON_PAGE);
                    const isLastPage = action.payload.page === totalPages - 1;

                    if (action.payload.page >= totalPages) {
                        return state;
                    }

                    const slice = _.slice(allCoins, action.payload.page * MAX_FEED_ON_PAGE, action.payload.page * MAX_FEED_ON_PAGE + MAX_FEED_ON_PAGE);
                    
                    return { feeds: slice, lastPage: isLastPage, totalPages: totalPages, page: action.payload.page, totalItems: allCoins.length };
                } else {
                    return { feeds: [], lastPage: false };
                }
            } 
            return [];      
        default:
            return state;
    }
}