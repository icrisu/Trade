import _ from 'lodash';
import { MAX_RELOD_FEED_TIME } from '../config';

const STORAGE_KEY = 'trade928423&(__';
const STORAGE_KEY_FAVORITES = '_fav_trade92a8423&(';
const STORAGE_KEY_PORTFOLIO = '_portf_trade92a8423&(';

class StorageService {

	static isStorageSupported() {
		return typeof(Storage) !== 'undefined';
	}

	static setStorageData(dataObj) {
		if (!StorageService.isStorageSupported()) {
			return null;
		}		

		if (_.isString(dataObj)) {
			localStorage.setItem(STORAGE_KEY, dataObj);
			return true;
		} else if (_.isObject(dataObj)) {
			let serializiedData;
			try {
				serializiedData = JSON.stringify(dataObj);
				localStorage.setItem(STORAGE_KEY, serializiedData);
			} catch (err) { 
				console.log(err);
				return null;
			};
			return true;			
		}		
	}

	static getStorageData() {
		if (!StorageService.isStorageSupported()) {
			return;
		}
		let data = null;
		try {
			let serializiedData = localStorage.getItem(STORAGE_KEY);
			data = JSON.parse(serializiedData);
		} catch (err) { data = null; console.log(err); };
		return data;
	}
	
	static setFeed(feed) {
		if (!StorageService.isStorageSupported()) {
			return;
		}
		let allData = StorageService.getStorageData();
		if (_.isNil(allData)) {
			allData = {};
        }
        allData.timestamp = Date.now();
		allData.feed = feed;
        StorageService.setStorageData(allData);
	}

	static getFeed() {
		if (!StorageService.isStorageSupported()) {
			return false;
		}
		const allData = StorageService.getStorageData();
		let feed = false;
		if (allData && allData.feed) {
			feed = allData.feed;
		}
		return feed;
    }
    
    static setTimestamp() {
		if (!StorageService.isStorageSupported()) {
			return;
		}
		let allData = StorageService.getStorageData();
		if (_.isNil(allData)) {
			allData = {};
		}
		allData.timestamp = Date.now();
		StorageService.setStorageData(allData);        
    }

    static getTimestamp() {
		if (!StorageService.isStorageSupported()) {
			return false;
		}
		const allData = StorageService.getStorageData();
		let timestamp = false;
		if (allData && allData.timestamp) {
			timestamp = allData.timestamp;
		}
		return timestamp;
    }
	
    static shouldUpdateFeed() {
        let timestamp = StorageService.getTimestamp();
        if (timestamp === false) {
            return true;
        }
        const diff = Date.now() - timestamp;
        const minutesDifference = Math.floor(diff/1000/60);
        return minutesDifference > MAX_RELOD_FEED_TIME;
    }

	static removeStorageData() {
		if (!StorageService.isStorageSupported()) {
			return;
		}
		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch (err) { console.log(err) };		
	}	

	// set favorites
	static setFavoritesData(dataObj) {
		if (!StorageService.isStorageSupported()) {
			return null;
		}		

		if (_.isString(dataObj)) {
			localStorage.setItem(STORAGE_KEY_FAVORITES, dataObj);
			return true;
		} else if (_.isObject(dataObj)) {
			let serializiedData;
			try {
				serializiedData = JSON.stringify(dataObj);
				localStorage.setItem(STORAGE_KEY_FAVORITES, serializiedData);
			} catch (err) { 
				console.log(err);
				return false;
			};
			return true;			
		}		
	}	

	static getFavoritesData() {
		if (!StorageService.isStorageSupported()) {
			return;
		}
		let data = {};
		try {
			let serializiedData = localStorage.getItem(STORAGE_KEY_FAVORITES);
			data = JSON.parse(serializiedData);
		} catch (err) { data = {}; console.log(err); };
		if (_.isNil(data)) {
			data = {};
		}
		return data;
	}
	
	// set portfolio
	static addPortfolio(portObj) {
		if (!StorageService.isStorageSupported()) {
			return null;
		}		

		let existing = StorageService.getPortfolio();

		if (_.isObject(portObj)) {
			existing[portObj.coinData.short] = portObj;
			let serializiedData;
			try {
				serializiedData = JSON.stringify(existing);
				localStorage.setItem(STORAGE_KEY_PORTFOLIO, serializiedData);
			} catch (err) { 
				console.log(err);
				return false;
			};
			return true;			
		}		
	}	

	static removePortfolioItem(shortKey) {
		let allportfolios = StorageService.getPortfolio();
		if (!_.isEmpty(allportfolios[shortKey])) {
			delete allportfolios[shortKey];
		}
		let serializiedData;
		try {
			serializiedData = JSON.stringify(allportfolios);
			localStorage.setItem(STORAGE_KEY_PORTFOLIO, serializiedData);
		} catch (err) { 
			console.log(err);
			return false;
		};		
		
	}

	static getPortfolio() {
		if (!StorageService.isStorageSupported()) {
			return;
		}
		let data = {};
		try {
			let serializiedData = localStorage.getItem(STORAGE_KEY_PORTFOLIO);
			data = JSON.parse(serializiedData);
		} catch (err) { data = {}; console.log(err); };
		if (_.isNil(data)) {
			data = {};
		}
		return data;
	}

}

export default StorageService;
