import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

class MenuItem extends Component {
    
    _activeClass() {
        return this.props.to === this.props.location.pathname ? 'active' : 'inactive';
    }

    _onClick() {
        if (this.props.onCloseRequest) {
            this.props.onCloseRequest();
        }
    }

    render() {
        return <Link onClick={e => this._onClick()} className={this._activeClass()} to={this.props.to}><span className="active-dot"></span>{this.props.label}</Link>
    }
}

export default withRouter(connect()(MenuItem));