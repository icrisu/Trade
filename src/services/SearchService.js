import { store } from '../index';
import _ from 'lodash';

let instance;
const instanceKey = '@&^#*(';

class SearchService {
    _searchIndex;
    _allCoins;

    constructor(key) {
        if (key !== instanceKey) {
            throw new Error('Cannot instantiate like this')
        }
    }

    init() {
        const { allCoins } = store.getState();
        if (_.isArray(allCoins)) {
            this._allCoins = allCoins;
        }
    }

    search(term) {
        if (_.isArray(this._allCoins)) {
            let result = [];
            for (let i = 0; i < this._allCoins.length; i++) {
                const findName = String(this._allCoins[i].long).toLowerCase().startsWith(`${term.toLowerCase()}`);
                const findById = String(this._allCoins[i].short).toLowerCase().indexOf(`${term.toLowerCase()}`);
                if (findName || findById !== -1) {
                    result.push(this._allCoins[i]);
                }
            }            
            return result;
        }
        return [];
    }
    
    static getInstance() {
        if (!instance) {
            instance = new SearchService(instanceKey);
        }
        return instance;
    }    
}

export default SearchService;
