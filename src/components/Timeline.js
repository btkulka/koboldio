import React, { Component } from 'react';
import './Timeline.css';

const notchLength = 15;
const globalPadding = 16;

export default class Timeline extends Component {
    constructor(props){
        super(props);
    }

    get yScale() {
        let midEvent = this.props.events[2];
        return midEvent.worldTimePoint / 10000;
    }

    render(){

        let timelineMarkers = [];

        let viewBox = "0 0 1000 " + this.yScale;

        this.props.events.forEach((event) => {
            let position = (event.worldTimePoint - this.props.currentTime) / 10000;
            let notchStart = 500 - notchLength;
            let notch = (
                <path d={"M" + notchStart + " " + position + " L" + ((notchLength * 2) + notchStart) + " " + position} stroke="white" strokeWidth="1" />
            );
            let name = (
                <text className="event-name" x={notchStart + (notchLength * 2) + globalPadding} y={position}>{event.name}</text>
            );
            let details = (
                <text className="event-details" x={notchStart + (notchLength * 2) + globalPadding} y={position + (globalPadding * 1.5) }>{event.time}</text>
            )
            timelineMarkers.push(notch, name, details);
        });

        return(
            <div className="timeline-wrapper">
                <svg height="500" width="900" viewBox={viewBox}>
                    <defs>
                        <linearGradient id="fade-in" x1="0" x2="1" y1="0" y2="1">
                            <stop offset="0" stopColor="rgba(0,0,0,0)" />
                            <stop offset="0.95" stopColor="rgba(0,0,0,1)" />
                        </linearGradient>
                        <linearGradient id="fade-out" x1="0" x2="1" y1="0" y2="1">
                            <stop offset="0" stopColor="rgba(0,0,0,1)" />
                            <stop offset="0.95" stopColor="rgba(0,0,0,0)" />
                        </linearGradient>
                    </defs>
                    <circle id="current-position" cx="50%" cy="8%" r={notchLength} stroke="white" fill="white" strokeWidth="1" />
                    <path d={"M500 0 L500 " + this.yScale} strokeWidth="1" stroke="white" />
                    {
                        timelineMarkers
                    }
                    <rect x="0" y="0" height="6%" width="100%" fill="url(#fade-out)"/>
                    <rect x="0" y="94%" height="6%" width="100%" fill="url(#fade-in)"/>
                </svg>
            </div>
        );
    }
}