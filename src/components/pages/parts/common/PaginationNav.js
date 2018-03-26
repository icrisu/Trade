import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import IconButton from 'material-ui/IconButton';
import ActionLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import ActionRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import { pushChunck } from '../../../../actions';


class PaginationNav extends Component {

    static defaultProps = {
        feedChunks: {
            totalPages: 0,
            lastPage: false
        }
    }

    constructor(props) {
        super(props);
        this.state = { lastPage: false, totalPages: 0, _page: 0 };
    }

    componentDidMount() {
        this.props.pushChunck(this.state._page);
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            totalPages: newProps.feedChunks.totalPages || 0, 
            lastPage: newProps.feedChunks.lastPage,
            _page: newProps.feedChunks.page
        });
    }

    _navigate(side) {
        var _page = this.state._page;
        if (side === 'left') {
            if (_page > 0) {
                _page--;
            }
        } else {
            _page++;
        }
        this.props.pushChunck(_page);
    }

    render() {
        return(
            <div className="pagination-widget">
                <IconButton onClick={e => {this._navigate('left')}} disabled={this.state._page === 0}>
                    <ActionLeft />
                </IconButton>
                <div className="info">
                    {`${window.TRADE_LOCALES.pagination_label_one} ${this.state._page + 1} ${window.TRADE_LOCALES.pagination_label_two} ${this.state.totalPages}`}
                </div>
                <IconButton onClick={e => {this._navigate('right')}} disabled={this.state.lastPage}>
                    <ActionRight />
                </IconButton>                
            </div>            
        )
    }
}

const mapStateToProps = ({feedChunks}) => {
    return {
        feedChunks
    }
}

PaginationNav.propTypes = {
    feedChunks: PropTypes.object
}

export default connect(mapStateToProps, { pushChunck })(PaginationNav);
