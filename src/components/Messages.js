import React from 'react';
import '../App.css';

function Messages(value) {
    switch(value) {
        case "Breonna Taylor":
            return "Breonna Taylor";
        case "police":
            return "Police"
        case "Minimum Wage":
            return "Minimum Wage";
        case "Medical drugs":
            return "Medical drugs";
        case "Immunity":
            return "Immunity"
        case "Prison":
            return "Prison";
        case "Marijuana":
            return "Marijuana";
        case "ICE":
            return "ICE"
        default:
            return "No things works"
    }
}

export default Messages;