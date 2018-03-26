import React, { Component } from 'react';
import { connect } from 'react-redux';
import { favouriteSwitch, getAllFavourites } from '../../actions';
import _ from 'lodash';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';

class FavouritesSwitch extends Component {

    static defaultProps = {
        isFavourite: false
    }

    constructor(props) {
        super(props);
        this.state = {isFavourite: false};
    }

    componentDidMount() {
        const favorites = getAllFavourites();
        if (favorites && favorites[this.props.coinId]) {
            this.setState({isFavourite: true});
        }
    }

    _renderFavourite() {
        const heartColor = window.TRADE_INSIDE_APP_COLORS.favourites_heart_color;
        if (this.state.isFavourite) {
            return(
                <IconButton tooltip={window.TRADE_LOCALES.remove_from_favorites} iconStyle={{width: 5, height: 5, color: heartColor}} style={{padding: 0, paddingRight: 10, width: 7, height: 7}} tooltipPosition="top-right" >
                    <FontIcon className="icon-star3" />
                </IconButton>                
            )
        } else {
            return(
                <IconButton tooltip={window.TRADE_LOCALES.add_to_favorites} iconStyle={{width: 5, height: 5, color: heartColor}} style={{padding: 0, paddingRight: 10, width: 7, height: 7}} tooltipPosition="top-right" >
                    <FontIcon className="icon-star_border" />
                </IconButton>   
            )
        }
    }

    _handleClick() {
        this.setState({isFavourite: !this.state.isFavourite}, () => {
            this.props.favouriteSwitch(this.props.coinId, this.state.isFavourite);   
            if (_.isFunction(this.props.onFavouriteSwitch)) {
                this.props.onFavouriteSwitch(this.state.isFavourite, this.props.coinId);
            }            
        });
    }

    render() {
        return(
            <div className="favourite-switch" onClick={e => this._handleClick()}>
                { this._renderFavourite() }
            </div>
        )
    }
}


export default connect(null, { favouriteSwitch, getAllFavourites })(FavouritesSwitch);
