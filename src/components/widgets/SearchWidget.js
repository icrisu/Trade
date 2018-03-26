import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchService from '../../services/SearchService';
import NumberFormat from 'react-number-format';
import _ from 'lodash';

class SearchWidget extends Component {

    _isMounted;
    constructor(props) {
        super(props);
        this.state = { searchKey: '', results: [] };
        this._delayedSearch = _.debounce(term => {
            const results = SearchService.getInstance().search(term);
            // this.setState({results: _.slice(results, 0, MAX_SEARCH_RESULTS) });
            this.setState({ results });

        }, 500);        
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    _onFocus() {
        SearchService.getInstance().init();
    }

    _onBlur() {
        setTimeout(() => {
            if (this._isMounted) {
                this.setState({results: [], searchKey: ''});
            }
        }, 200);
    }

    _onChange(e) {
        this.setState({searchKey: e.currentTarget.value}, () => {
            if (this.state.searchKey === '') {
                this.setState({results: []});
            } else {
                this._delayedSearch(this.state.searchKey);
            }
        });
    }

    _onSelectedItem(coinData) {
        if (this.props.onItemSelected) {
            this.props.onItemSelected(coinData);
        }
    }

    _renderItemIndicator() {
        return this.props.plusIndicator ? <span className="icon-plus"></span> : <span className="icon-keyboard_arrow_right"></span>; 
    }
    
    _renderResults() {
        if (this.state.results.length === 0) {
            return <noscript />
        }
        let count = -1;
        const items = this.state.results.map(item => {
            count++;
            const noBorder = count === this.state.results.length - 1 ? ' no-border' : '';
            const name = `${item['long']} (${item['short']})`;
            const price = item['price'];
            const cap24hrChange = item['cap24hrChange'];
            let trend = 'trend-negative';
            if (cap24hrChange > 0) {
                trend = 'trend-positive';
            }            

            return(
                <div className={`result-item${noBorder}`} key={count} onClick={e => this._onSelectedItem(item)}>
                    <div className="pull-left result-entry">{name} - </div>
                    <div className={`pull-left result-entry ${trend}`}>
                        <NumberFormat value={price} displayType={'text'} thousandSeparator={true} prefix={'$'} decimalScale={ price < 1 ? 3 : 0} />
                    </div>
                    <div className="arrow-go">{this._renderItemIndicator()}</div>
                </div>
            )
        })

        return <div className="search-results">{items}</div>
    }

    render() {
        return(
            <div className="search-widget pull-left">
                <input className="search-input" placeholder={ this.props.placeholder || '' } onFocus={this._onFocus.bind(this)} value={this.state.searchKey} onChange={this._onChange.bind(this)} onBlur={this._onBlur.bind(this)} type="text" />
                <span className="search-icon icon-search2"></span>
                { this._renderResults() }
            </div>
        )
    }
}

export default connect(null, null)(SearchWidget);