import React, { Component, Fragment } from 'react';
import Card from '../../layout/Card';
import LineChartSingle from '../../../common/charts/LineChartSingle';
import _ from 'lodash';
import EventTransportService from '../../../../services/EventTransportService';
import { MAX_RECENT_TRADES_CURRENCY_SINGLE } from '../../../../config';
import moment from 'moment';
import shortid from 'shortid';
import NumberFormat from 'react-number-format';

class LiveTradesChart extends Component {
    _isMount = false;

    constructor(props) {
        super(props);
        this.state = { parsedData: false, latestTrades: [] };
    }

    componentDidMount() {
        this._isMount = true;
        this._init(this.props.parsedData);
    }

    componentWillUnmount() {
        this._isMount = false;
        if (this._processedData) {
            EventTransportService.getInstance().unsubscribe(this._processedData['short']);
        }        
    }

    componentWillReceiveProps(newProps) {
        this._init(newProps.parsedData);
    }
    
    _init(parsedData) {
        if (this.state.parsedData === false && parsedData) {
            this.setState({parsedData}, this._initChart);             
        }
    }        

    _initChart() {
        if (this._liveLineChart) {
            const gradientOne = this._liveLineChart.createGradient(window.TRADE_INSIDE_APP_COLORS.charts_lines_primary_color);
            this._liveLineChart.setLabels([])
            .drawChart([{
                data: [],
                label: this.state.parsedData.long,
                backgroundColor: gradientOne,
                borderColor: window.TRADE_INSIDE_APP_COLORS.charts_lines_primary_color                    
            }]);                          
        }


        EventTransportService.getInstance().subscribe(this.state.parsedData['short'], updatedData => {
            if (this._liveLineChart) {
                let firstDataset = this._liveLineChart.getChart().data.datasets[0];
                if (firstDataset) {
                    let lt = _.clone(this.state.latestTrades);

                    if (firstDataset.data.length > MAX_RECENT_TRADES_CURRENCY_SINGLE) {
                        this._liveLineChart.getChart().data.labels.shift();
                        firstDataset.data.shift();
                        lt.pop();  
                    }
                    
                    let m = moment(updatedData.lastUpdate).format('LTS');
                    this._liveLineChart.getChart().data.labels.push(m);
                    firstDataset.data.push(updatedData.price);
                    this._liveLineChart.getChart().update();

                    lt.unshift(updatedData);
                    for (let i = 0; i < lt.length; i++) {
                        lt[i].showHighlite = i % 2;
                    }
                    this.setState({latestTrades: lt});

                }                       
            } 
        });        
    }

    _renderLiveTrades() {
        return this.state.latestTrades.map(t => {
            let highlight = '';
            if (t.showHighlite !== 0) {
                highlight = ' trade-highlight';
            }
            return(
                <div key={shortid.generate()} className={`row trade${highlight}`}>
                    <div className="col-sm-3">{t.short}</div>
                    <div className="col-sm-3"><NumberFormat value={t.price} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={0} /></div>
                    <div className="col-sm-3">{moment(t.lastUpdate).format('LTS')}</div> 
                    <div className="col-sm-3">{t.exchange_id.charAt(0).toUpperCase() + t.exchange_id.slice(1)}</div>                    
                </div>
            )
        })
    }    
    

    render() {
        return(
            <Fragment>
                <Card>     
                    <p className="inpage-title">{`${ this.props.parsedData ? this.props.parsedData.long : ''} ${window.TRADE_LOCALES.recent_trades}`}</p>
                    <LineChartSingle ref={r => { this._liveLineChart = r }} />                   
                </Card>
                <Card>
                    <div className="live-trades">
                        {this._renderLiveTrades()}
                    </div>
                </Card>                    
            </Fragment>
        )
    }
}

export default LiveTradesChart;
