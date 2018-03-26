import React, { Component, Fragment } from 'react';
import PageLayout from './layout/PageLayout';
import CurrencyTopbar from './parts/currency-page/CurrencyTopbar';
import CryptoService from '../../services/CryptoService';
import safe from 'undefsafe';
import _ from 'lodash';
import NumberFormat from 'react-number-format';
import Card from './layout/Card';
import RaisedButton from 'material-ui/RaisedButton';
import HistoryChart from './parts/currency-page/HistoryChart';
import LiveTradesChart from './parts/currency-page/LiveTradesChart';
import { responsiveAd } from '../../config';

class CurrencySingle extends Component {
    _ctx;
    _processedData;

    constructor(props) {
        super(props);
        this.state = { coinNameLong: '', selectedSection: 0, historyData: false, parsedData: false };
    }

    componentDidMount() {
        this._getHistory();
        this._init(this.props);
        // adsense code
        const adClient = window.TRADE_INSIDE_APP_SETTINGS.single_adsense_ad_client;
        const adSlot = window.TRADE_INSIDE_APP_SETTINGS.single_adsense_ad_slot;
        if (window.TRADE_INSIDE_APP_SETTINGS.has_adsense_single === true && adClient !== '' && adSlot !== '') {
            setTimeout(() => {
                try {                    
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                } catch (err) {console.log(err)}
            }, 1000) 
        }          

    }

    _init(props) {
        if (!_.isNil(safe(props, 'match.params.id_short'))) {
            CryptoService.getInstance().getSingleFeed(props.match.params.id_short)
            .then(processedData => {
                this._processedData = processedData;
                this.setState({ coinNameLong: this._processedData.long, parsedData: processedData })        
            })
            .catch(err => console.log(err));             
        }              
    }

    componentWillReceiveProps(newProps) {
        this._init(newProps);
    }

    _getHistory(historyValue) {
        CryptoService.getInstance().getHistory(this.props.match.params.id_short, historyValue || '1day')
        .then(data => {
            if (data) {
                this.setState({historyData: data});
            }
        })
    }

    _onHistoryChange(value) {
        this._getHistory(value);
    }

    _renderCoinInfo() {
        if (!_.isObject(this._processedData)) {
            return <noscript />;
        }
        const singleCoin = this._processedData;
        const { supply } = singleCoin;
        const { usdVolume } = singleCoin;
        const { mktcap } = singleCoin;
        return(
            <Fragment>
                <p className="inpage-title">{window.TRADE_LOCALES.currency_info}</p>
                <p className="inpage-small-title">{window.TRADE_LOCALES.currency_single_24_market_cap}</p>
                <div className="coin-info">
                    <NumberFormat value={mktcap} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} />
                </div>
                <p className="inpage-small-title">{window.TRADE_LOCALES.currency_single_24_hour_vol}</p>
                <div className="coin-info">
                    <NumberFormat value={usdVolume} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} />
                </div>                
                <p className="inpage-small-title">{window.TRADE_LOCALES.currency_single_available_supply}</p>
                <div className="coin-info">
                    <NumberFormat value={supply} displayType={'text'} thousandSeparator={true} decimalScale={0} />
                </div>                
            </Fragment>
        )        
    }

    _renderSection() {
        if (this.state.selectedSection === 0) {
            return <HistoryChart historyData={this.state.historyData} coinName={ (this._processedData ? this._processedData.long : false) } onHistoryChange={this._onHistoryChange.bind(this)} />;
        }
        if (this.state.selectedSection === 1) {
            return <LiveTradesChart parsedData={this.state.parsedData} />       
        }        
        return <noscript />;
    }

    _renderAdsense() {
        const adClient = window.TRADE_INSIDE_APP_SETTINGS.single_adsense_ad_client;
        const adSlot = window.TRADE_INSIDE_APP_SETTINGS.single_adsense_ad_slot;
        if (!window.TRADE_INSIDE_APP_SETTINGS.has_adsense_single || adClient === '' || adSlot === '') {
            return <noscript />
        }
        return responsiveAd(adClient, adSlot);
    }

    render() {
        return(
            <PageLayout customTopArea={<CurrencyTopbar />} classes="currency-single-page" >
                { this._renderAdsense() }
                <div className="page-section">
                    <div className="row">
                        <div className="col-md-4">
                            <Card noPadding={true}>
                                <RaisedButton onClick={e => this.setState({selectedSection: 0})} label={window.TRADE_LOCALES.currency_single_history_menu_title} primary={this.state.selectedSection === 0} fullWidth={true} />
                                <RaisedButton onClick={e => this.setState({selectedSection: 1})} label={window.TRADE_LOCALES.currency_single_live_menu_title} primary={this.state.selectedSection === 1} fullWidth={true} />
                            </Card>
                            <Card>
                                { this._renderCoinInfo() }
                            </Card>
                        </div>
                        <div className="col-md-8">
                            { this._renderSection() }
                        </div>
                    </div>                              
                </div>
            </PageLayout>
        )
    }
}

export default CurrencySingle;

