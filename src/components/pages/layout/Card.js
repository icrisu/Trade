import React from 'react';
export default props => {
    const renderStyle = () => {
        let style = {};
        if (props.noPadding) {
            style.padding = '0px';
        }
        return style;
    }
    if (props.size) {
        return(
            <div style={renderStyle()} className={props.size}>
                <div className="content-card">
                    { props.children }
                </div>
            </div>
        )        
    } 
    return(
        <div style={renderStyle()} className="content-card no-size">
            { props.children }
        </div>
    )
}