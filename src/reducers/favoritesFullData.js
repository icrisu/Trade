import { FAVOURITE_ALL } from '../actions/types';

export default (state = [], action) => {
    switch (action.type) {
        case FAVOURITE_ALL:
            let favAll = [];
            for (const key in action.payload.favRefs) {
                if (action.payload.favRefs.hasOwnProperty(key)) {
                    for (let i = 0; i < action.payload.allCoins.length; i++) {
                        const coinData = action.payload.allCoins[i];
                        if (coinData.short === key) {
                            favAll.push(coinData);
                            break;
                        }
                    }
                }
            }
            return favAll;         
        default:
            return state;
    }
}
