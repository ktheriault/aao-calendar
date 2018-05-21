import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { CSS_CLASS_DICTIONARY, HOUR_HEIGHT } from "../global";
import "../style/App.css";

export default class SessionCard extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        let { session, dayStartTime, verticalOffset } = this.props;
        let startTime = new Date(Date.parse(session.startDateTime));
        let endTime = new Date(Date.parse(session.endDateTime));
        let lengthInMinutes = (Date.parse(endTime) - Date.parse(startTime)) / 1000 / 60;
        let heightClass = `time-block-${lengthInMinutes}`;
        let heightClassExists = !!CSS_CLASS_DICTIONARY[`.${heightClass}`];

        let minutesSinceDayStartTime = (Date.parse(session.startDateTime) - Date.parse(dayStartTime)) / 1000 / 60;
        let sessionLocationInPixels = minutesSinceDayStartTime * HOUR_HEIGHT / 60;

        let speakers = [];
        session.sessionParts.forEach((sessionPart) => {
            speakers = [
                ...speakers,
                ...sessionPart.speakers,
            ];
        });

        return (
            <div
                name="Session"
                className={classNames("session-card", heightClass)}
                style={!heightClassExists ? {
                    height: `${lengthInMinutes / 60 * HOUR_HEIGHT}px`,
                    top: `${sessionLocationInPixels + verticalOffset}px`,
                } : {
                    top: `${sessionLocationInPixels + verticalOffset}px`
                }}
            >
                {speakers.map((speaker) => {
                    let speakerName = `${speaker.firstName} ${speaker.lastName}`;
                    if (speaker.prefix) { speakerName = `${speaker.prefix} ${speakerName}`; }
                    return (
                        <div className={classNames("overflow-text", "session-speaker-text")}>
                            {speakerName}
                        </div>
                    )
                })}
                <div className={classNames("overflow-text", "session-title-text")}>
                    {session.title}
                </div>
                <div className={classNames("overflow-text", "session-time-text")}>
                    {`${startTime.toLocaleTimeString()} - ${endTime.toLocaleTimeString()}`}
                </div>
            </div>
        )
    }

}

SessionCard.propTypes = {
    session: PropTypes.object,
    dayStartTime: PropTypes.object,
    verticalOffset: PropTypes.number,
};
