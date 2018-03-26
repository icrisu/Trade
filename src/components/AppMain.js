import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import TopBar from './topbar/TopBar';
import MainMenu from './menus/MainMenu';
import { ROUTES } from '../config/routes';
import Compare from './pages/Compare';
import { menuType } from '../config';
import { openMenu } from '../actions';
import ReactResizeDetector from 'react-resize-detector';
import AlertManager from './alerts/AlertManager';
import MainFeed from './pages/MainFeed';
import CurrencySingle from './pages/CurrencySingle';
import Favourites from './pages/Favourites';
import Portfolio from './pages/Portfolio';
import _ from 'lodash';

class AppMain extends Component {	

	constructor(props) {
		super(props);
        this._delayedResize = _.debounce((w, h) => {          
            if (this.props.openMenu) {
				const type = menuType();
				this.props.openMenu({
					isOpen: type === 'desktop', type
				})
			}
        }, 700);		
	}

    _onResize(w, h) {
        this._delayedResize(w, h);
    }   	

	render() {
		return(
			<Fragment>
				<Router basename={`/`}>				
					<Fragment>
						<TopBar />
						<MainMenu />							
						<Switch>
							<Route path={`${ROUTES.cryptocurrency}/:id_short`} component={CurrencySingle} />
							<Route path={ROUTES.favourite} component={Favourites} />
							<Route path={ROUTES.compare} component={Compare} />
							<Route path={ROUTES.portfolio} component={Portfolio} />
							<Route path={ROUTES.root} component={MainFeed} />
						</Switch>
						<AlertManager />
					</Fragment>
				</Router>
				<ReactResizeDetector handleWidth handleHeight onResize={this._onResize.bind(this)} />
			</Fragment>
		)
	}
}

export default connect(null, { openMenu })(AppMain);
