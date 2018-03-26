import React, { PureComponent } from 'react';
import NumberFormat from 'react-number-format';
import EventTransportService from '../../../services/EventTransportService';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../config/routes';
import FavouritesSwitch from '../../widgets/FavouritesSwitch';
import _ from 'lodash';

class FeedItem extends PureComponent {

    _isMount;
    _time;
    constructor(props) {
        super(props);
        this.state = { coinData: false, isAnimating: false };
    }
    
    componentDidMount() {
        this._isMount = true;
        this.setState({ coinData: this.props.coinData }, () => {
            EventTransportService.getInstance().subscribe(this.state.coinData['short'], updatedData => {
                try {
                    clearTimeout(this._time);
                } catch (err) {};
                this.setState({ coinData: updatedData, isAnimating: true });
                this._time = setTimeout(() => {
                    if (this._isMount) {
                        this.setState({isAnimating: false})
                    }
                }, 1000);
            });            
        }) 
    }

    componentWillUnmount() {
        this._isMount = false;
        EventTransportService.getInstance().unsubscribe(this.state.coinData['short']);
    }

    _onFavouriteSwitch(...args) {
        if (_.isFunction(this.props.onFavouriteSwitch)) {
            this.props.onFavouriteSwitch(...args);
        }
    }

    _renderFull() {
        if (!this.state.coinData) {
            return <noscript />
        }
        const name = `${this.state.coinData['long']} (${this.state.coinData['short']})`;
        const mktcap = this.state.coinData['mktcap'];
        const price = this.state.coinData['price'];
        const vwapData = this.state.coinData['vwapData'];
        const supply = this.state.coinData['supply'];
        const usdVolume = this.state.coinData['usdVolume'];
        const cap24hrChange = this.state.coinData['cap24hrChange'];
        let trend = 'trend-negative';
        let trendIcon = 'icon-trending-down';
        if (cap24hrChange > 0) {
            trend = 'trend-positive';
            trendIcon = 'icon-trending-up';
        }

        const renderAnimated = () => {
            const lastUpdate = this.state.coinData['lastUpdate'];
            const diff = Date.now() - lastUpdate;
            const seconds = Math.floor(diff/1000)

            if (seconds === 0 && this.state.isAnimating === true) {
                return <div className={`realtime-info animated fadeOut ${trend}-background`}></div>;
            } else {
                return <noscript />;
            }
        }

        return(
                <div className="row">
                    <div className="col-md-2">
                        <span className="label">{window.TRADE_LOCALES.currencyName}: </span>
                        <div className="curency-name-ui">
                            <FavouritesSwitch onFavouriteSwitch={this._onFavouriteSwitch.bind(this)} coinId={this.state.coinData['short']} />
                            <span>
                                <Link to={`${ROUTES.cryptocurrency}/${this.state.coinData['short']}`}>{name}</Link>
                            </span>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <span className="label">{window.TRADE_LOCALES.marketCap}: </span>
                        <NumberFormat value={mktcap} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} />
                    </div>
                    <div className="col-md-1">
                        { renderAnimated() }
                        <div>
                            <span className="label">{window.TRADE_LOCALES.currencyPrice}: </span>
                            <span className={trend}>
                                <NumberFormat value={price} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={ price < 1 ? 3 : 0} />
                            </span>                            
                        </div>
                    </div>
                    <div className="col-md-1">
                        <span className="label">{window.TRADE_LOCALES.vwap}: </span>
                        <span className={trend}>
                            <NumberFormat value={vwapData} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={ vwapData < 1 ? 3 : 0} />
                        </span>
                    </div>
                    <div className="col-md-2">
                        <span className="label">{window.TRADE_LOCALES.supply}: </span>
                        <NumberFormat value={supply} displayType={'text'} thousandSeparator={true} decimalScale={ supply < 1 ? 3 : 0} />
                    </div>
                    <div className="col-md-2">
                        <span className="label">{window.TRADE_LOCALES.hrVolume}: </span>
                        <NumberFormat value={usdVolume} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={ usdVolume < 1 ? 3 : 0} />
                    </div>
                    <div className="col-md-1">
                        <span className="label">{window.TRADE_LOCALES.percentTrend}: </span>
                        <span className={`trend-ico ${trendIcon} ${trend}`}></span>
                        <span className={trend}>{cap24hrChange}%</span>
                    </div>
                    <div className="col-md-1">
                        <a target="_blank" href={window.TRADE_INSIDE_APP_SETTINGS.referral_exchange_url}>{window.TRADE_LOCALES.item_trade_referral_label}</a>
                    </div>                    
                </div>       
        )
    }    

    render() {
        return(
            <div className="feed-item">
                { this._renderFull() }
            </div>         
        )
    }
}

export default FeedItem;
