import React, { Component } from 'react';

class FeedTopbar extends Component {

    _renderFull() {
        return(
            <div className="coin-info coin-info-full">
                <div className="row">
                    <div className="col-md-2">{window.TRADE_LOCALES.currencyName}</div>
                    <div className="col-md-2">{window.TRADE_LOCALES.marketCap}</div>
                    <div className="col-md-1">{window.TRADE_LOCALES.currencyPrice}</div>
                    <div className="col-md-1">{window.TRADE_LOCALES.vwap}</div>
                    <div className="col-md-2">{window.TRADE_LOCALES.supply}</div>
                    <div className="col-md-2">{window.TRADE_LOCALES.hrVolume}</div>
                    <div className="col-md-1">{window.TRADE_LOCALES.percentTrend}</div>
                </div>
            </div>
        )
    }
    render() {
        return(
            <div className="page-topbar feed-topbar">
                {this._renderFull()}
            </div>           
        )        
    }
}
export default FeedTopbar;
