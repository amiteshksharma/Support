import React from 'react';
import '../css/Tile.css';

export default function Tile(props) {
    const checkForPlus = text => {
        if(text.includes("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")) {
            return text.replace("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++", "");
        } else {
            return text;
        }
    }
    
    return (
        <div className="tile" onClick={() => window.location.href = props.link}>
            <img src={props.image} alt="GofundMe" width="100%" height="300"></img>
            <p className="title">{props.title}</p>
            <p className="text">{checkForPlus(props.text)}</p>
            <p className="raised">{props.raised}</p>
        </div>
    )
}