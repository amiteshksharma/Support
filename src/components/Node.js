import React from 'react';
import '../css/Node.css';

export default function Tile(props) {
    return (
        <div className="node" onClick={() => window.location.href = props.link}>
            <section className="petition-details">
                <p className="title">{props.title}</p>
                <p className="text">{props.text}</p>
            </section>

            <hr />
            
            <section className="details">
                <p className="user"><strong>{props.user}</strong></p>
                <p className="state">{props.state}</p>
                <p className="raised">{props.signatures}</p>
            </section>
            
            <section className="image">
                <img src={props.image} alt="GofundMe" width="180" height="140"></img>
            </section>
        </div>
    )
}