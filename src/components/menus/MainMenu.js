import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MENU_OPEN_WIDTH } from '../../config';
import { ROUTES } from '../../config/routes';
import { openMenu } from '../../actions';
import ActionMenu from 'material-ui/svg-icons/navigation/menu';
import IconButton from 'material-ui/IconButton';
import { withRouter } from 'react-router';
import MenuItem from './MenuItem';
import Drawer from 'material-ui/Drawer';
import { menuType, fixedAd } from '../../config';

class MainMenu extends Component {

    static defaultProps = {
        openedMenu: { isOpen: false, type: 'desktop'}
    }

    constructor(props) {
        super(props);
        this.state = { isOpen: true, type: 'desktop' };
        this.onCloseRequest = this.onCloseRequest.bind(this);
    }

    componentWillReceiveProps(newProps) {
        this.setState({isOpen: newProps.openedMenu.isOpen, type: newProps.openedMenu.type})
        // trigger adsense
        const adClient = window.TRADE_INSIDE_APP_SETTINGS.adsense_ad_client;
        const adSlot = window.TRADE_INSIDE_APP_SETTINGS.adsense_ad_slot;
        const validAd = adClient !== '' && adSlot !== '';
        if (newProps.openedMenu.isOpen && window.TRADE_INSIDE_APP_SETTINGS.has_adsense_menu === true && validAd) {
            setTimeout(() => {
                try {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                } catch (err) {console.log(err)}
            }, 1000)  
        }
    }

    _closeMenu() {
        this.props.openMenu({
            isOpen: false,
            type: menuType()
        });
    }

    onCloseRequest() {
        if (menuType() === 'mobile') {
            this._closeMenu();
        }
    }

    _onMenuRequest(isOpen) {
        this.setState({isOpen});
        this.props.openMenu({
            isOpen: isOpen,
            type: menuType()
        });        
    }

    _renderMobileMenu() {
        if (this.props.openedMenu.type !== 'mobile') {
            return <noscript />;
        }        
        
        return(
            <Drawer
                docked={false}
                width={MENU_OPEN_WIDTH}
                open={this.state.isOpen}
                onRequestChange={(isOpen) => this._onMenuRequest(isOpen)}
                containerClassName="main-menu mobile-menu"
                >
                <div style={{ width: MENU_OPEN_WIDTH }} className="main-menu mobile-menu">
                    { this._renderMenuContent() }
                </div>
            </Drawer>
        )
    }

    _renderDesktopMenu() {
        if (this.props.openedMenu.type !== 'desktop') {
            return <noscript />;
        }
        return(
            <div style={{ width: MENU_OPEN_WIDTH }} className="main-menu">
                { this._renderMenuContent() }
            </div>             
        )
    }

    _renderAdsense() {
        const adClient = window.TRADE_INSIDE_APP_SETTINGS.menu_adsense_ad_client;
        const adSlot = window.TRADE_INSIDE_APP_SETTINGS.menu_adsense_ad_slot;
        if (!window.TRADE_INSIDE_APP_SETTINGS.has_adsense_menu || adClient === '' || adSlot === '') {
            return <noscript />
        }  

        return fixedAd(adClient, adSlot);
    }

    _logoClick(e) {
        e.preventDefault();
        window.location.replace("http://sakuraplugins.com/demos/trade");
    }

    _renderMenuContent() {
        return(
            <Fragment>
                <div className="menu-topbar">
                    <div onClick={ e => this._logoClick(e) } className="logo-ui"><img src={process.env.PUBLIC_URL + '/assets/img/app-full-logo.png'} alt="" /></div>
                    <div className="close-menu">
                        <IconButton onClick={ e => this._closeMenu() } iconStyle={{ color: '#eee8ea'}}>
                            <ActionMenu />
                        </IconButton>
                    </div>
                </div>
                <div className="menu-content">
                    <ul className="menu-list">
                        <li><MenuItem to={ROUTES.root} label={window.TRADE_LOCALES.menu_feed_label} onCloseRequest={this.onCloseRequest} /></li>
                        <li><MenuItem to={ROUTES.favourite} label={window.TRADE_LOCALES.menu_favourites_label} onCloseRequest={this.onCloseRequest} /></li>
                        <li><MenuItem to={ROUTES.compare} label={window.TRADE_LOCALES.menu_compare_label} onCloseRequest={this.onCloseRequest} /></li>
                        <li><MenuItem to={ROUTES.portfolio} label={window.TRADE_LOCALES.menu_portfolio_label} onCloseRequest={this.onCloseRequest} /></li>
                    </ul>
                    { this._renderAdsense() }
                </div>                
            </Fragment>
        )        
    }
    render() {
        if (!this.props.openedMenu.isOpen) {
            return <noscript />;
        }
        return(
            <Fragment>
                { this._renderDesktopMenu() }
                { this._renderMobileMenu() }
            </Fragment>
        )
    }
}

const mapStateToProps = ({openedMenu}) => {
    return {
        openedMenu
    }
}

MainMenu.propTypes = {
    openedMenu: PropTypes.object
}

export default withRouter(connect(mapStateToProps, { openMenu })(MainMenu));


