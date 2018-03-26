import React, { Component } from 'react';
import { connect } from 'react-redux';
import shortid from 'shortid';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import SearchWidget from '../widgets/SearchWidget';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import { addPortfolio } from '../../actions';

class CreatePortfolio extends Component {

    constructor(props) {
        super(props);
        this.state = { selectedCurrency: false, amount: '', open: false, label: '' }
    }

    componentDidMount() {
        this.setState({ open: true });
    }

    componentWillReceiveProps(newProps) {
        setTimeout(() => this.setState({ open: true }), 500);
    }    

    handleClose() {
        this.setState({ open: false, selectedCurrency: false, amount: 0 });
        if (this.props.onCancel) {
            this.props.onCancel();
        } 
    }       

    _onCoinFound(coinData) {
        this.setState({selectedCurrency: coinData});
    }

    _onChange(event, newValue) {
        this.setState({
            amount: event.target.value,
        });      
    }

    _onLabelChange(event, newValue) {
        this.setState({
            label: event.target.value,
        }); 
    }

    _isDisabled() {
        return this.state.amount === 0 || this.state.amount === '' || this.state.selectedCurrency === false || this.state.label === '';
    }

    _createPortfolio() {
        this.props.addPortfolio({
            coinData: this.state.selectedCurrency,
            amount: this.state.amount,
            label: this.state.label
        });
        this.handleClose();
    }

    _getActions() {
        let actions = [];
        actions.push(<FlatButton label={window.TRADE_LOCALES.modal_cancel_label} primary={false} onClick={() => this.handleClose()} key={shortid.generate()}/>)
        actions.push(<div className="spacer" key={shortid.generate()}></div>)
        actions.push(<RaisedButton label={window.TRADE_LOCALES.modal_accept_label} primary={true} onClick={e => this._createPortfolio()} key={shortid.generate()} disabled={this._isDisabled()} />)
        return actions;
    }   

    _renderContentStyle() {
        if (this.props.maxWidth) {
            return { maxWidth: this.props.maxWidth }
        }
        return {};
    }    

    _renderTitle() {
        if (this.props.title) {
            return <div className="title">{this.props.title}</div>
        }        
    }    

    render() {
        return(
            <Dialog contentStyle={this._renderContentStyle()}
            modal={false}
            open={this.state.open}
            onRequestClose={() => this.handleClose()}
            autoScrollBodyContent={this.props.autoScroll || false}
            >
                <div className="base-alert-content">
                    { this._renderTitle() }
                    <div className="content">
                        <div className="create-portfolio-content">
                            <SearchWidget onItemSelected={dta => this._onCoinFound(dta)} plusIndicator={true} placeholder={window.TRADE_LOCALES.search_box_placeholder_1} />
                            <div className="selected-currency">
                                { this.state.selectedCurrency ? this.state.selectedCurrency.long : window.TRADE_LOCALES.portfolio_label_no_currency }
                            </div>
                            <TextField
                                onChange={(e, val) => this._onChange(e, val)}
                                type="number" min="0"
                                value={this.state.amount}
                                hintText={window.TRADE_LOCALES.portfolio_eneter_amount} fullWidth={true}
                            />
                            <TextField
                                onChange={(e, val) => this._onLabelChange(e, val)}
                                value={this.state.label}
                                hintText={window.TRADE_LOCALES.portfolio_eneter_label} fullWidth={true}
                            />                            
                        </div>                    
                    </div>
                    <div className="button-actions">{this._getActions()}</div>
                </div>
            </Dialog>            
        )
    }
}

export default connect(null, { addPortfolio })(CreatePortfolio);
