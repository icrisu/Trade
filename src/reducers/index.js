import { combineReducers } from 'redux';
import openedMenu from './openMenu';
import allFeed from './allFeed';
import allFeedBackup from './allFeedBackup';
import feedChunks from './feedChunks';
import singleCoin from './singleCoin';
import favourites from './favourites';
import favoritesFullData from './favoritesFullData';
import selectedFilter from './feedFilter';
import infoAlert from './InfoAlert';
import portfolio from './portfolio';

const reducers = combineReducers({
	test: () => { return {} },
	openedMenu,
	allCoins: allFeed,
	feedChunks,
	singleCoin,
	favourites,
	favoritesFullData,
	selectedFilter,
	allFeedBackup,
	infoAlert,
	portfolio
});

export default reducers;
