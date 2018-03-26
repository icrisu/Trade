import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import NumberFormat from 'react-number-format';
import safe from 'undefsafe';
import _ from 'lodash';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
// import { withRouter } from 'react-router';

class CurrencyTopbar extends Component {

    static defaultProps = {
        singleCoin: {}
    }

    _hasData() {
        return !_.isNil(safe(this.props, 'singleCoin.short'));
    }

    _buySell() {
        window.open(window.TRADE_INSIDE_APP_SETTINGS.referral_exchange_url, '_blank');
    }

    // _goBack() {
    //     this.props.history.goBack();
    // }

    _renderInfo() {
        if (this._hasData()) {
            const { singleCoin } = this.props;
            const { price } = singleCoin;
            const { cap24hrChange } = singleCoin;

            let trend = 'trend-negative';
            let trendIcon = 'icon-trending-down';
            if (cap24hrChange > 0) {
                trend = 'trend-positive';
                trendIcon = 'icon-trending-up';
            }            

            return(
                <Fragment>
                    <div className="nav-back pull-left">
                        <Link to="/"><span className="icon-arrow-left"></span></Link>
                    </div>
                    <p className="title pull-left">
                        {`(${singleCoin.short}) ${singleCoin.long}`}
                    </p>
                    <div className="single-info-block pull-left">                        
                        <span className={trend}>
                            <NumberFormat value={price} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={ price < 1 ? 3 : 0} />
                        </span>
                    </div>
                    <div className="single-info-block pull-left">
                        <span className={`trend-ico ${trendIcon} ${trend}`}></span>                      
                        <span className={trend}>{cap24hrChange}%</span>
                    </div>  
                    <div className="buy-sell-single pull-right">
                        <RaisedButton onClick={this._buySell.bind(this)} label={window.TRADE_LOCALES.currency_single_buy_label} primary={true} />
                    </div>                                      
                </Fragment>
            )
        }
    }

    render() {
        return(
            <div className="page-topbar currency-topbar">
                { this._renderInfo() }
            </div>           
        )        
    }
}

const mapStateToProps = ({singleCoin}) => {
    return {
        singleCoin
    }
}

CurrencyTopbar.propTypes = {
    singleCoin: PropTypes.object
}

export default connect(mapStateToProps)(CurrencyTopbar);
