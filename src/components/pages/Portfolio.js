import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import PageLayout from './layout/PageLayout';
import _ from 'lodash';
import shortid from 'shortid';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { openAlert, getPortfolio } from '../../actions';
import { ALERT_MESSAGES_TYPES } from '../alerts/types';
import PortfolioItem from './parts/portfolio/PortfolioItem';

class Portfolio extends Component {

    static defaultProps = {
        portfolio: {}
    }

    componentWillMount() {
        this.props.getPortfolio();
    }

    _openCreateNew() {
        this.props.openAlert({}, ALERT_MESSAGES_TYPES.CREATE_PORTFOLIO);
    }


    _renderPortfolios() {
        if (_.isEmpty(this.props.portfolio)) {
            return <noscript />;
        }
        let items = [];
        const portfolio = this.props.portfolio;
        for (const key in portfolio) {
            if (portfolio.hasOwnProperty(key)) {
                const itemData = portfolio[key];
                items.push(<PortfolioItem itemData={itemData} key={shortid.generate()} />)
            }
        }
        return items;
    }

    render() {
        return(
            <PageLayout pageTitle={window.TRADE_LOCALES.portfolio_page_title} classes="portfolio-page">
                <div className="add-new-card pull-left">
                    <FloatingActionButton onClick={this._openCreateNew.bind(this)} style={{ marginTop: '35px' }}>
                        <ContentAdd />
                    </FloatingActionButton>
                    <p className="create-new">{window.TRADE_LOCALES.portfolio_page_create_new}</p>
                </div>
                { this._renderPortfolios() }        
                <div className="clearfix"></div>
            </PageLayout> 
        )
    }
}

const mapStateToProps = ({ portfolio }) => {
    return { portfolio }
}

Portfolio.propTypes = {
    portfolio: PropTypes.object
}

export default connect(mapStateToProps, { openAlert, getPortfolio })(Portfolio);
