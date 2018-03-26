import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { MENU_OPEN_WIDTH } from '../../config';
import { ROUTES } from '../../config/routes';
import { openMenu } from '../../actions';
import ActionMenu from 'material-ui/svg-icons/navigation/menu';
import IconButton from 'material-ui/IconButton';
import SearchWidget from '../widgets/SearchWidget';
import safe from 'undefsafe';
import IconMenu from 'material-ui/IconMenu';
import ContentFilter from 'material-ui/svg-icons/content/filter-list';
import TopbarFilters from '../widgets/TopbarFilters';
import { menuType } from '../../config';
import FlatButton from 'material-ui/FlatButton';

class TopBar extends Component {
    
    static defaultProps = {
        openedMenu: {
            isOpen: true
        }
    }

    constructor(props) {
        super(props);
        this.state = { redirectTo: false, filtersOpen: false };
    }

    componentWillReceiveProps(newProps) {
        if (safe(newProps, 'location.state.topBarRedirected') === true) {
            this.setState({ redirectTo: false });
        }
    }

    _openMenu() {
        this.props.openMenu({
            isOpen: true,
            type: menuType()
        });
    }  
    
    _onCoinFound(coinData) {
        if (coinData && this.state.redirectTo === false) {
            this.setState({ redirectTo: `${ROUTES.cryptocurrency }/${coinData.short}`});
        }
    }

    _renderDynamicStyle() {
        return this.props.openedMenu.isOpen ? { paddingLeft: `${MENU_OPEN_WIDTH}px` } : { paddingLeft: 0 }
    }

    _renderOpenMenu() {
        if (!this.props.openedMenu.isOpen) {
            return(
                <div className="open-menu pull-left">
                    <IconButton onClick={ e => this._openMenu() } iconStyle={{ color: window.TRADE_INSIDE_APP_COLORS.topbar_buttons_color }}>
                        <ActionMenu />
                    </IconButton>
                </div>                
            )
        }
        return <noscript />
    }

    _renderTopWidgets() {
        if (!this.props.location) {
            return <noscript />
        }

        return <SearchWidget onItemSelected={dta => this._onCoinFound(dta)} placeholder={window.TRADE_LOCALES.search_box_placeholder_2} />
    }

    _redirect() {
        if (this.state.redirectTo !== false) {
            return <Redirect to={{pathname: this.state.redirectTo, state: {topBarRedirected: true}}} />;
        }
    }

    _onRequestCloseFilters() {
        this.setState({filtersOpen: false})
    }

    // <IconButton iconStyle={{ color: window.TRADE_INSIDE_APP_COLORS.topbar_buttons_color }}><ContentFilter /></IconButton>

    _renderContentFilter() {
        if (this.props.location.pathname === ROUTES.root) {
            return(
                <div className="pull-right">
                        <IconMenu 
                            open={this.state.filtersOpen}
                            onClick={e => {this.setState({filtersOpen: true})}}
                            onRequestChange={(changeState) => {this.setState({filtersOpen: changeState})}}
                            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}                    
                            iconButtonElement={
                                <FlatButton
                                label={window.TRADE_LOCALES.top_bar_filters_label}
                                labelPosition="before"
                                primary={false}
                                style={{color: window.TRADE_INSIDE_APP_COLORS.topbar_buttons_color, marginTop: '5px'}}
                                icon={<ContentFilter />}
                                />
                            }
                        >
                        <TopbarFilters onRequestCloseFilters={this._onRequestCloseFilters.bind(this)} />
                    </IconMenu>    
                </div>
            )
        }
        return <noscript />
    }

    render() {        
        return(
            <div className="topbar" style={this._renderDynamicStyle()}>
                {this._redirect()}
                { this._renderOpenMenu() }
                <div className="top-widgets pull-left">
                    { this._renderTopWidgets() }
                </div>
                { this._renderContentFilter() }                            
                <div className="clearfix"></div>
            </div>
        )
    }
}

const mapStateToProps = ({openedMenu}) => {
    return {
        openedMenu
    }
}

TopBar.propTypes = {
    openedMenu: PropTypes.object
}


export default withRouter(connect(mapStateToProps, { openMenu })(TopBar));


