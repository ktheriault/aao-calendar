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
        let { session } = this.props;
        let startTime = new Date(Date.parse(session.startDateTime));
        let endTime = new Date(Date.parse(session.endDateTime));
        let lengthInMinutes = (Date.parse(session.endDateTime) - Date.parse(session.startDateTime)) / 1000 / 60;
        let heightClass = `time-block-${lengthInMinutes}`;
        let cssClassExists = !!CSS_CLASS_DICTIONARY[`.${heightClass}`];

        let speakers = [];
        session.sessionParts.forEach((sessionPart) => {
            speakers = [
                ...speakers,
                ...sessionPart.speakers,
            ];
        });

        return (
            <div
                className={classNames("session-card", heightClass)}
                style={!cssClassExists ? { height: `${(lengthInMinutes / 60 * HOUR_HEIGHT).toString()}em` } : null}
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
            </div>
        )
    }

}

SessionCard.propTypes = {
    session: PropTypes.object,
};