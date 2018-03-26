import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PageLayout from './layout/PageLayout';
import CryptoService from '../../services/CryptoService';
import FeedItem from './parts/FeedItem';
import { setAllFeedData, pushChunck, feedFilter } from '../../actions';
import FeedTopbar from './parts/FeedTopbar';
import shortid from 'shortid';
import PaginationNav from './parts/common/PaginationNav';

class MainFeed extends Component {

    static defaultProps = {
        feedChunks: {
            feeds: []
        }
    }

    componentDidMount() {
        CryptoService.getInstance().getFeed()
        .then(data => {
            this.props.feedFilter('');
            this.props.setAllFeedData(data, true);
            // this.props.pushChunck(true);
        })
        .catch(err => {
            console.log('Error', err)
        })
    }

    _renderFeed() {
        return this.props.feedChunks.feeds.map(feed => {
            return <FeedItem key={shortid.generate()} coinData={feed} />
        })
    }

    _renderNavigation() {
        return(
            <div className="navigation">
                <PaginationNav />
            </div>
        )
    }

    render() {
        return(
            <PageLayout customTopArea={<FeedTopbar />} customBottomNav={this._renderNavigation()} classes="main-feed-page">
                { this._renderFeed() }
            </PageLayout>
        )
    }
}
const mapStateToProps = ({feedChunks}) => {
    return {
        feedChunks
    }
}

MainFeed.propTypes = {
    feedChunks: PropTypes.object
}

export default connect(mapStateToProps, { setAllFeedData, pushChunck, feedFilter })(MainFeed);


