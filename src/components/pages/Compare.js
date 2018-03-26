import React, { Component } from 'react';
import PageLayout from './layout/PageLayout';
import _ from 'lodash';
import SearchWidget from '../widgets/SearchWidget';
import LineChartSingle from '../common/charts/LineChartSingle';
import CryptoService from '../../services/CryptoService';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import shortid from 'shortid';
import Card from './layout/Card';


class Compare extends Component {

    _historyFeeds = {};
    _chartLinesColours = [
        window.TRADE_INSIDE_APP_COLORS.charts_lines_primary_color,
        window.TRADE_INSIDE_APP_COLORS.charts_lines_second_color,
        window.TRADE_INSIDE_APP_COLORS.charts_lines_third_color,
        window.TRADE_INSIDE_APP_COLORS.charts_lines_fourth_color,
    ];
    _lineChart;

    constructor(props) {
        super(props);
        this.state = { historyValue: '1day', isLoading: false, addedCurrencies: [], loadedFirstTime: false };  
    }

    _chooseRightKeys() {
        let coinId = '';
        let count = 0;
        for (const key in this._historyFeeds) {
            if (this._historyFeeds.hasOwnProperty(key)) {
                const coinData = this._historyFeeds[key];
                if (coinData.keys.length > count) {
                    coinId = key;
                }
                count = coinData.keys.length;
            }
        }
        if (this._historyFeeds[coinId]) {
            return {
                labels: this._historyFeeds[coinId].keys,
                coinId
            };
        }
        return false;
    }


    _onCoinFound(coinData) {
        if (!coinData) {
            return;
        }
        if (this._historyFeeds[coinData.short]) {
            return;
        }
        if (Object.keys(this._historyFeeds).length > 3) {
            return alert(window.TRADE_LOCALES.compare_max_warn);
        }     
        //this._getCoinData(coinData);  
        this.setState({isLoading: true});
        CryptoService.getInstance().getHistory(coinData.short, this.state.historyValue)
        .then(data => {
            this._processData(data, coinData);
            this.setState({isLoading: false});
        })
    }

    _processData(data, coinData) {
        this.setState({addedCurrencies: [...this.state.addedCurrencies, {
            long: coinData.long,
            short: coinData.short
        }], loadedFirstTime: true})
        this._historyFeeds[coinData.short] = data;
        this._historyFeeds[coinData.short].coinLabel = coinData.long || coinData.coinLabel;
        this._historyFeeds[coinData.short].coinId = coinData.short;
        const rightKeysData = this._chooseRightKeys();
        const { labels } = rightKeysData;
        
        if (this._lineChart) {
            let count = 0;
            let dataFeed = [];
            
            for (const key in this._historyFeeds) {
                if (this._historyFeeds.hasOwnProperty(key)) {
                    const feedData = this._historyFeeds[key];
                    const gradient = this._lineChart.createGradient(this._chartLinesColours[count], {
                        a1: '0.300', a2: '0.100'
                    });
                    dataFeed.push({
                        data: feedData.prices,
                        label: feedData.coinLabel,
                        backgroundColor: gradient,
                        borderColor: this._chartLinesColours[count],
                        customLegentBackground: this._chartLinesColours[count],
                        coinId: feedData.coinId
                    })
                    count++;
                }
            }
            this._lineChart.setLabels(labels);
            this._lineChart.drawChart(dataFeed);
        }
    }

    _onHistoryChange(event, index, value) {
        if (this.state.isLoading) {
            return;
        }
        this.setState({historyValue: value}, () => {
            if (this._lineChart) {
                this._lineChart.destroy();
            }
            this.setState({isLoading: true, addedCurrencies: []});
            let keepdata = [];
            for (const key in this._historyFeeds) {
                if (this._historyFeeds.hasOwnProperty(key)) {
                    keepdata.push({
                        short: key,
                        long: this._historyFeeds[key].coinLabel
                    })
                }
            }
            let allPromises = [];
            for (let i = 0; i < keepdata.length; i++) {
                var promise = new Promise((resolve, reject) => {
                    CryptoService.getInstance().getHistory(keepdata[i].short, this.state.historyValue)
                    .then(data => {
                        this._processData(data, keepdata[i]);
                        resolve();
                    })
                });
                // const element = keepdata[i];
                allPromises.push(promise)
            }
            Promise.all(allPromises)
            .then(() => {
                this.setState({isLoading: false});
            })            
        });        
        
    }

    _removeCurrency(coinId, coinName, event) {
        event.preventDefault();
        if (window.confirm(window.TRADE_LOCALES.compare_remve_alert)) {
            let addedCurrenciesClone = _.clone(this.state.addedCurrencies);
            for (let i = 0; i < addedCurrenciesClone.length; i++) {
                if (addedCurrenciesClone[i].short === coinId) {
                    addedCurrenciesClone.splice(i, 1)
                }
            }
            this.setState({addedCurrencies: addedCurrenciesClone});
            delete this._historyFeeds[coinId];
            if (this._lineChart) {
                for (let i = 0; i < this._lineChart.getChart().data.datasets.length; i++) {
                    if (this._lineChart.getChart().data.datasets[i].coinId === coinId) {
                        this._lineChart.getChart().data.datasets.splice(i, 1);
                        break;
                    }
                }
                this._lineChart.getChart().update();
            }
        }
    }

    _renderCurrencies() {
        return this.state.addedCurrencies.map(c => {
            return(
                <div className="currency-remove" key={shortid.generate()}>
                    <a onClick={e => {this._removeCurrency(c.short, c.long, e)}} href="#remove">
                        <span className="icon-delete icon-trash-2"></span>
                        <span>{c.long}</span>
                    </a>
                </div>
            )
        })
    }   

    _renderFirstTime() {
        if (!this.state.loadedFirstTime) {
            return(
                <div className="page-section">
                    <div className="row">
                        <Card size="col-md-12" >
                            <p className="generic-info">{window.TRADE_LOCALES.crypto_compare_info}</p>
                        </Card>
                    </div>
                </div>
            )
        }
    }

    _renderContent() {
        if (this.state.loadedFirstTime) {
            return(
                <div className="page-section">
                    <div className="row">
                        <Card size="col-md-8" >
                            <LineChartSingle ref={r => { this._lineChart = r }} hideProgress={true} />
                        </Card>
                        <Card size="col-md-4">
                            <SelectField style={{display: (!this.state.loadedFirstTime) ? 'none': 'block' }}
                                value={ this.state.historyValue } onChange={this._onHistoryChange.bind(this)}
                            >
                                <MenuItem value="1day" primaryText={window.TRADE_LOCALES.one_day_history} />
                                <MenuItem value="7day" primaryText={window.TRADE_LOCALES.seven_days_history} />
                                <MenuItem value="30day" primaryText={window.TRADE_LOCALES.one_month_history} />
                            </SelectField> 
                            <div className="added-currency">
                                { this._renderCurrencies() }
                            </div>                        
                        </Card>                        
                    </div>
                </div>                
            )            
        }
    }

    render() {
        return(
            <PageLayout pageTitle={window.TRADE_LOCALES.crypto_compare} classes="crypto-compare-page">
                <div className="search-ui">
                    <SearchWidget onItemSelected={dta => this._onCoinFound(dta)} plusIndicator={true} placeholder={window.TRADE_LOCALES.search_box_placeholder_1} />
                </div>
                { this._renderFirstTime() }
                { this._renderContent() }                    
            </PageLayout> 
        )
    }
}


export default Compare;
