import React from 'react';
export default (props) => {
    return(
        <div className={`card-display ${props.size}`}>
            <p className="title">{props.title}</p>
            {props.children}
        </div>
    )
}