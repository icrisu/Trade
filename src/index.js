import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import ReduxThunk from 'redux-thunk';
import SocketService from './services/SocketService';
import CryptoService from './services/CryptoService';

import reducers from './reducers';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { blue500 } from 'material-ui/styles/colors';

import AppMain from './components/AppMain';
import Storage from './services/StorageService';
import { setupInitialData } from './actions';
import './styles/css/style.css';
// import registerServiceWorker from './registerServiceWorker';

// eslint-disable-next-line
Number.prototype.formatMoney = function(n, x) {
	var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
	return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&,');
};

export const muiTheme = getMuiTheme({
	palette: {
		primary1Color: blue500
	},
	appBar: {
		height: 50,
	},
});


export const store = createStore(reducers, {favourites: Storage.getFavoritesData()}, compose(
	applyMiddleware(ReduxThunk)
));

const mainEl: any = document.getElementById('container');

CryptoService.getInstance().getFeed()
.then(data => {
	setupInitialData(data);
	SocketService.getInstance().init();
})
.catch(err => { console.log(err)});


ReactDom.render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <Provider store={store}>
      <AppMain />
    </Provider>
  </MuiThemeProvider>
, mainEl);

// registerServiceWorker();
