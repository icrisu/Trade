import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import PageLayout from './layout/PageLayout';
import { connect } from 'react-redux';
import { getFavouritesFull } from '../../actions';
import _ from 'lodash';
import shortid from 'shortid';
import FeedItem from './parts/FeedItem';
import FeedTopbar from './parts/FeedTopbar';
import Card from './layout/Card';

class Favourites extends Component {

    static defaultProps = {
        favoritesFullData: []
    }


    constructor(props) {
        super(props);
        this.state = { favoritesFullData: [] };
    }

    componentDidMount() {
        this.props.getFavouritesFull();
    }

    componentWillReceiveProps(newProps) {
        if (_.isArray(newProps.favoritesFullData)) {
            this.setState({favoritesFullData: newProps.favoritesFullData});
        }
    }

    // remove from list
    _onFavouriteSwitch(state, coinId) {
        this.props.getFavouritesFull();
    }

    _renderWatchlist() {
        return this.state.favoritesFullData.map(f => {
            return <FeedItem key={shortid.generate()} coinData={f} onFavouriteSwitch={this._onFavouriteSwitch.bind(this)} />
        });
    }

    _renderData() {
        if (_.isArray(this.state.favoritesFullData) && this.state.favoritesFullData.length > 0) {
            return(
                <Fragment>
                    <FeedTopbar />
                    { this._renderWatchlist() }
                </Fragment>
            )
        } else {
            return(
                <div className="page-section">
                    <div className="row">
                        <Card size="col-md-12" >
                            <p className="generic-info">{window.TRADE_LOCALES.watchlist_is_empty}</p>
                        </Card>
                    </div>
                </div>                
            )
        }
    }

    render() {
        return(
            <PageLayout pageTitle={window.TRADE_LOCALES.my_favorites}>
                { this._renderData() }
            </PageLayout>            
        )
    }
}

const mapStateToProps = ({favoritesFullData}) => {
    return {favoritesFullData};
}

Favourites.propTypes = {
    favoritesFullData: PropTypes.array
}

export default connect(mapStateToProps, { getFavouritesFull })(Favourites);
