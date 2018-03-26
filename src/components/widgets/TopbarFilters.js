import React, { Component } from 'react';
import { connect } from 'react-redux';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import PropTypes from 'prop-types';
import { feedFilter } from '../../actions';
import _ from 'lodash';

const radioButtonStyle = {
    display: 'block'
}

class TopbarFilters extends Component {

    static defaultProps = {
        selectedFilter: ''
    }

    constructor(props) {
        super(props);
        this.state = {selectedFilter: ''};
        // market_cup_up
    }
    componentDidMount() {
        if (this.props.selectedFilter) {
            this.setState({selectedFilter: this.props.selectedFilter});
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.selectedFilter) {
            this.setState({selectedFilter: newProps.selectedFilter});
        }
    }

    _onChange(event, value) {
        this.setState({selectedFilter: value});
    }

    _disableFilters() {
        this.setState({selectedFilter: ''});
        this.props.feedFilter('');
        this._closeFilters();
    }

    _applyFilter() {
        this.props.feedFilter(this.state.selectedFilter);
        this._closeFilters();
    }

    _closeFilters() {
        if (_.isFunction(this.props.onRequestCloseFilters)) {
            this.props.onRequestCloseFilters();
        }
    }

    render() {
        return(
            <div className="topbar-filters">
                <div className="title">{window.TRADE_LOCALES.top_bar_filters_label}</div>
                <RadioButtonGroup name="mkcup" defaultSelected={this.state.selectedFilter} onChange={this._onChange.bind(this)} valueSelected={this.state.selectedFilter}>
                    <RadioButton
                        value="market_cap_up"
                        label={`${window.TRADE_LOCALES.marketCap} ${window.TRADE_LOCALES.filter_label_up}`}
                        style={radioButtonStyle}
                    />
                    <RadioButton
                        value="market_cap_down"
                        label={`${window.TRADE_LOCALES.marketCap} ${window.TRADE_LOCALES.filter_label_down}`}
                        style={radioButtonStyle}
                    />             
                    <RadioButton
                        value="price_up"
                        label={`${window.TRADE_LOCALES.currencyPrice} ${window.TRADE_LOCALES.filter_label_up}`}
                        style={radioButtonStyle}
                    />
                    <RadioButton
                        value="price_down"
                        label={`${window.TRADE_LOCALES.currencyPrice} ${window.TRADE_LOCALES.filter_label_down}`}
                        style={radioButtonStyle}
                    />
                    <RadioButton
                        value="24_vol_up"
                        label={`${window.TRADE_LOCALES.hrVolume} ${window.TRADE_LOCALES.filter_label_up}`}
                        style={radioButtonStyle}
                    />
                    <RadioButton
                        value="24_vol_down"
                        label={`${window.TRADE_LOCALES.hrVolume} ${window.TRADE_LOCALES.filter_label_down}`}
                        style={radioButtonStyle}
                    /> 
                    <RadioButton
                        value="24_percent_up"
                        label={`${window.TRADE_LOCALES.percentTrend} ${window.TRADE_LOCALES.filter_label_up}`}
                        style={radioButtonStyle}
                    />
                    <RadioButton
                        value="24_percent_down"
                        label={`${window.TRADE_LOCALES.percentTrend} ${window.TRADE_LOCALES.filter_label_down}`}
                        style={radioButtonStyle}
                    />                                                                                                                                            
                </RadioButtonGroup>
                <div className="controls">
                    <FlatButton label="Clear" onClick={this._disableFilters.bind(this)} primary={true} disabled={this.state.selectedFilter === ''} />
                    <RaisedButton label="Apply" onClick={this._applyFilter.bind(this)} primary={true} style={{marginLeft: '15px'}} disabled={this.state.selectedFilter === ''} />
                </div>           
            </div>
        )
    }
}

const mapStateToProps = ({selectedFilter}) => {
    return {
        selectedFilter
    }
}

TopbarFilters.propTypes = {
    selectedFilter: PropTypes.string
}

export default connect(mapStateToProps, {feedFilter})(TopbarFilters);
