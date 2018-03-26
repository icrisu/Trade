import { store } from '../index';
import { OPEN_ALERT, OPEN_MENU, COINS_FEED_ALL, PUSH_CHUNK_DATA, SINGLE_COIN_DATA,
COIN_UPDATE, FAVOURITE_ADD, FAVOURITE_REMOVE, FAVOURITE_ALL, FEED_FILTER, COINS_FEED_ALL_BACKUP, 
ADD_PORTFOLIO, ALL_PORTFOLIO, REMOVE_PORTFOLIO } from './types';
import _ from 'lodash';
import Storage from '../services/StorageService';

// coin feeds
export const setAllFeedData = (payload, keepBackup = false) => {
	return (dispatch, getState) => {
		dispatch({
			type: COINS_FEED_ALL,
			payload
		});
		if (keepBackup) {
			dispatch({
				type: COINS_FEED_ALL_BACKUP,
				payload
			});			
		}
	} 	 
}

export const pushChunck = (page = 0, returnEmpty = false) => {
	return (dispatch, getState) => {
		const { allCoins } = getState();
		dispatch({
			type: PUSH_CHUNK_DATA,
			payload: {
				allCoins, page, returnEmpty
			}
		});
	} 
}

// open / close main menu
export const openMenu = val => {
	return (dispatch, getState) => {
		dispatch({
			type: OPEN_MENU,
			payload: val
		});
	} 
}

export const feedSingleCoin = coinData => {
	store.dispatch({
		type: SINGLE_COIN_DATA,
		payload: coinData	
	});	
}

// update coin
export const coinUpdate = coinData => {
	store.dispatch({
		type: COIN_UPDATE,
		payload: coinData	
	});	
}

// add remove from favourites
export const favouriteSwitch = (currencyId, add = true) => {
	return {
		type: add ? FAVOURITE_ADD : FAVOURITE_REMOVE,
		payload: currencyId
	}
}

// retunrs only the IDs
export const getAllFavourites = () => {
	const { favourites } = store.getState();
	return favourites;
}


export const getFavouritesFull = () => {
	const { allCoins } = store.getState();
	let { favourites } = store.getState();
	if (_.isEmpty(favourites)) {
		favourites = Storage.getFavoritesData();
	}
	return (dispatch, getState) => {
		dispatch({
			type: FAVOURITE_ALL,
			payload: { allCoins, favRefs: favourites }
		});
	} 
}

export const feedFilter = filter => {
	const { allFeedBackup } = store.getState();
	let filtered = [];
	switch(filter) {
		case 'market_cap_up':
			filtered = _.sortBy(allFeedBackup, ['mktcap']);
		break;
		case 'market_cap_down':
			filtered = _.reverse(_.sortBy(allFeedBackup, ['mktcap']));
		break;
		case 'price_up':
			filtered = _.sortBy(allFeedBackup, ['price']);
		break;
		case 'price_down':
			filtered = _.reverse(_.sortBy(allFeedBackup, ['price']));
		break;
		case '24_vol_up':
			filtered = _.sortBy(allFeedBackup, ['volume']);
		break;
		case '24_vol_down':
			filtered = _.reverse(_.sortBy(allFeedBackup, ['volume']));
		break;
		case '24_percent_up':
			filtered = _.sortBy(allFeedBackup, ['perc']);
		break;
		case '24_percent_down':
			filtered = _.reverse(_.sortBy(allFeedBackup, ['perc']));
		break;
		case '':
			filtered = allFeedBackup;
		break;	
		default: 
			filtered = allFeedBackup;		
	}
	
	store.dispatch(setAllFeedData(filtered));
	store.dispatch(pushChunck(0, true));
	setTimeout(() => {
		store.dispatch(pushChunck(0));
	}, 500)
	return {
		type: FEED_FILTER,
		payload: filter
	}
}

// open alert/modal across app
export const openAlert = (data, alertType) => {
	return (dispatch, getState) => {
		dispatch({
			type: OPEN_ALERT,
			payload: { data, alertType }
		});
	} 
}

// add portfolio
export const addPortfolio = payload => {
	Storage.addPortfolio(payload);
	return (dispatch, getState) => {
		dispatch({
			type: ADD_PORTFOLIO,
			payload
		});
	} 
}

// get portfolio
export const getPortfolio = () => {
	return (dispatch, getState) => {
		dispatch({
			type: ALL_PORTFOLIO,
			payload: {}
		});
	} 
}

// remove portfolio
export const removePortfolio = shortKey => {
	Storage.removePortfolioItem(shortKey);
	return (dispatch, getState) => {
		dispatch({
			type: REMOVE_PORTFOLIO,
			payload: shortKey
		});
	} 
}

// set up initial data
export const setupInitialData = (allCoinsData) => {
	store.dispatch({
		type: COINS_FEED_ALL,
		payload: allCoinsData
	})	
	const { allCoins } = store.getState();
	let { favourites } = store.getState();
	if (_.isEmpty(favourites)) {
		favourites = Storage.getFavoritesData() || {};
	}
	store.dispatch({
		type: FAVOURITE_ALL,
		payload: { allCoins: allCoins, favRefs: favourites }
	})
	
	let portfolioSaved = Storage.getPortfolio();
	if (!_.isEmpty(portfolioSaved)) {

		for (let i = 0; i < allCoins.length; i++) {
			const portfolioItem = portfolioSaved[allCoins[i].short];
			if (!_.isEmpty(portfolioItem)) {
				store.dispatch({
					type: ADD_PORTFOLIO,
					payload: { coinData: allCoins[i], amount: portfolioItem.amount, label: portfolioItem.label }
				})				
			}
		}
	}
}