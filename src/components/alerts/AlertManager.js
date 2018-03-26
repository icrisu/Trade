import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { ALERT_MESSAGES_TYPES } from './types';
import CreatePortfolio from './CreatePortfolio';


class AlertManager extends Component {

    static defaultProps = {
        infoAlert: false
    }

	constructor(props) {
		super(props);
		this.state = {
			open: false
		}
    }

	render() {
        if (!this.props.infoAlert) {
            return <noscript />;
        }
        switch(this.props.infoAlert.alertType) {
            case ALERT_MESSAGES_TYPES.CREATE_PORTFOLIO:
                return <CreatePortfolio title={window.TRADE_LOCALES.portfolio_modal_title} maxWidth={500} data={this.props.infoAlert} />
            default:
            return <noscript />;
        }
	}
}

AlertManager.propTypes = {
    infoAlert: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.object
    ]),
}

const mapStateToProps = ({ infoAlert }, ownProps) => {
    return {
        infoAlert
    }
}

export default connect(mapStateToProps)(AlertManager);
