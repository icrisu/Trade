import React, { Component, Fragment } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Card from '../../layout/Card';
import LineChartSingle from '../../../common/charts/LineChartSingle';
import _ from 'lodash';

class HistoryChart extends Component {
    _isMount = false;

    constructor(props) {
        super(props);
        this.state = { historyValue: '1day' };
    }

    componentDidMount() {
        this._isMount = true;
        if (this.props.coinName && this.props.historyData && this._lineChart) {
            this._renderChart(this.props.historyData, this.props.coinName);
        }

    }

    componentWillUnmount() {
        this._isMount = false;
    }

    _renderChart(historyData, coinName) {         
        const gradientOne = this._lineChart.createGradient(window.TRADE_INSIDE_APP_COLORS.charts_lines_primary_color);
        this._lineChart.setLabels(historyData.keys)
        .drawChart([{
            data: historyData.prices,
            label: coinName,
            backgroundColor: gradientOne,
            borderColor: window.TRADE_INSIDE_APP_COLORS.charts_lines_primary_color                    
        }]);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.coinName && newProps.historyData && newProps.historyData !== false && this._lineChart) {
            this._renderChart(newProps.historyData, newProps.coinName);
        }
    }

    _onHistoryChange(event, index, value) {
        if (_.isFunction(this.props.onHistoryChange)) {
            this.setState({historyValue: value});            
            if (this._lineChart) {
                this._lineChart.destroy();
            }            
            this.props.onHistoryChange(value);
        }
    }

    render() {
        return(
            <Fragment>
                <Card>
                    <p className="inpage-title pull-left">{window.TRADE_LOCALES.currency_history}</p>
                    <SelectField className="pull-right"
                        value={ this.state.historyValue } onChange={this._onHistoryChange.bind(this)}
                    >
                        <MenuItem value="1day" primaryText={window.TRADE_LOCALES.one_day_history} />
                        <MenuItem value="7day" primaryText={window.TRADE_LOCALES.seven_days_history} />
                        <MenuItem value="30day" primaryText={window.TRADE_LOCALES.one_month_history} />
                        <MenuItem value="90day" primaryText={window.TRADE_LOCALES.three_months_history} />
                        <MenuItem value="180day" primaryText={window.TRADE_LOCALES.six_months_history} />
                        <MenuItem value="365day" primaryText={window.TRADE_LOCALES.twelve_months_history} />
                    </SelectField> 
                    <div className="clearfix"></div>   
                    <LineChartSingle ref={r => { this._lineChart = r }} />                          
                </Card>
            </Fragment>
        )
    }
}

export default HistoryChart;
