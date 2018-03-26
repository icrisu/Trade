import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MENU_OPEN_WIDTH } from '../../../config';
import PageTitle from '../parts/PageTitle';
import ReactResizeDetector from 'react-resize-detector';
import _ from 'lodash';

class PageLayout extends Component {
    
    _isMounted = false;
    static defaultProps = {
        openedMenu: { isOpen: true }
    }    

    constructor(props) {
        super(props);
        this._delayedResize = _.debounce((w, h) => {          
            if (this.props.onResize && this._isMounted === true) {
                this.props.onResize(w, h);
            }
        }, 700);         
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    _onScroll(event) {
        if (this.scrollContainer && this.props.shouldLoadMore) {
            if (this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight > this.scrollContainer.scrollHeight - 400) {
                this.props.shouldLoadMore();
            }
        }
    }

    _renderDynamicStyle() {
        if (this.props.openedMenu.type === 'mobile') {
            return { paddingLeft: 0 };
        }
        return this.props.openedMenu.isOpen ? { paddingLeft: `${MENU_OPEN_WIDTH}px` } : { paddingLeft: 0 }
    }

    _renderClass() {
        return this.props.classes ? `page-layout ${this.props.classes}` : 'page-layout';
    }

    _renderTop() {
        if (this.props.pageTitle) {
            return <PageTitle title={this.props.pageTitle} />
        }
        if (this.props.customTopArea) {
            return this.props.customTopArea;
        }
    }

    _renderBottomCustom() {
        if (this.props.customBottomNav) {
            return this.props.customBottomNav;
        }
    }

    _onResize(w, h) {
        this._delayedResize(w, h);
    }     

    render() {
        return(
            <div className={this._renderClass()} style={ this._renderDynamicStyle() }>
                { this._renderTop() }
                { this._renderBottomCustom() }
                
                <div ref={r => this.scrollContainer = r} onScroll={this._onScroll.bind(this)} className="page-content-with-scroll">
                    <div className="page-content">
                        <div className="container-fluid">
                            { this.props.children }
                        </div>
                    </div>
                    <ReactResizeDetector handleWidth handleHeight onResize={this._onResize.bind(this)} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({openedMenu}) => {
    return {
        openedMenu
    }
}

PageLayout.propTypes = {
    openedMenu: PropTypes.object,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    customTopArea: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])    
}

export default connect(mapStateToProps)(PageLayout);
