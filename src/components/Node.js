import React from 'react';
import '../css/Node.css';

export default function Tile(props) {
    return (
        <div className="node">
            <img src={props.image} alt="GofundMe" width="100%" height="300"></img>
            <p className="title">{props.title}</p>
            <p>{props.link}</p>
            <p className="text">{props.text}</p>
            <p className="raised">{props.signatures}</p>
            <p className="text">{props.user}</p>
            <p className="raised">{props.state}</p>
        </div>
    )
}