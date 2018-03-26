import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../../config/routes';
import { removePortfolio } from '../../../../actions';
import NumberFormat from 'react-number-format';
import EventTransportService from '../../../../services/EventTransportService';

class PortfolioItem extends Component {

    _isMount;
    _time;
    
    constructor(props) {
        super(props);
        this.state = { price: 0, amount: 0, coinData: {} }
    }

    componentDidMount() {
        this.setState({
            price: this.props.itemData.coinData.price,
            amount: parseFloat(this.props.itemData.amount, 10),
            coinData: this.props.itemData.coinData
        }, () => {
            EventTransportService.getInstance().subscribe(this.state.coinData['short'], updatedData => {
                try {
                    clearTimeout(this._time);
                } catch (err) {};
                this.setState({ coinData: updatedData });
            });             
        });        
    }

    componentWillUnmount() {
        this._isMount = false;
        EventTransportService.getInstance().unsubscribe(this.state.coinData['short']);
    }    

    _removePortfolio() {
        if (window.confirm(window.TRADE_LOCALES.remove_portfolio_item)) {
            this.props.removePortfolio(this.props.itemData.coinData.short);
        }
    }

    render() {
        if (!this.props.itemData) {
            return <noscript />
        }

        let currentMoney = (this.state.coinData.price * this.state.amount) / 1;
        const itemData = this.props.itemData;

        let trend = 'trend-negative';
        let trendIcon = 'icon-trending-down';
        const { cap24hrChange } = this.state.coinData;
        if (cap24hrChange > 0) {
            trend = 'trend-positive';
            trendIcon = 'icon-trending-up';
        }        

        return(
            <div className="portfolio-card pull-left">
                <div onClick={e => this._removePortfolio()} className="remove"><span className="icon-trash-2"></span></div>
                <p className="label"><Link to={`${ROUTES.cryptocurrency}/${itemData.coinData.short}`}>{itemData.label}</Link></p>
                <div className="currency-info"><span className="currency">{itemData.coinData.short}:</span> 
                    <span className={`trend-ico ${trendIcon} ${trend}`}></span>
                    <span className={trend}>
                        <NumberFormat value={this.state.coinData.price} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={ this.state.coinData.price < 1 ? 3 : 0} />
                    </span>
                </div>
                <div className="portfolio-info"><span className="value">Portfolio value:</span> 
                    <span className={trend}><NumberFormat value={currentMoney} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={ currentMoney < 1 ? 3 : 0} /></span>
                </div>
                <div className="amount-info"><span className="value">Amount:</span> 
                    <span>{ `${this.state.amount} (${itemData.coinData.short})` }</span>
                </div>                
            </div>            
        )        
    }
}

export default connect(null, { removePortfolio })(PortfolioItem);

