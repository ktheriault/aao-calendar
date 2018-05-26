import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { CSS_CLASS_DICTIONARY, HOUR_HEIGHT, TIMELINE_VERTICAL_OFFSET } from "../global";
import "../style/App.css";

export default class SessionCard extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidCatch(error, errorInfo) {
        console.log("SessionCard error");
        console.log(error);
        console.log(errorInfo.componentStack);
    }

    render() {
        console.log("SessionCard.render");
        let { session, onSessionClicked, dayStartTime } = this.props;
        let speakers = session.speakers;

        let startTime = new Date(session.startDateTime);
        let endTime = new Date(session.endDateTime);

        let startTimeHours = startTime.getHours();
        let endTimeHours = endTime.getHours();
        let startTimeMinutes = startTime.getMinutes();
        let endTimeMinutes = endTime.getMinutes();
        let startTimeString = `${startTimeHours > 12 ? startTimeHours - 12 : startTimeHours}:${startTimeMinutes < 10 ? `0${startTimeMinutes}` : startTimeMinutes}${startTimeHours > 11 ? "pm" : "am"}`;
        let endTimeString = `${endTimeHours > 12 ? endTimeHours - 12 : endTimeHours}:${endTimeMinutes < 10 ? `0${endTimeMinutes}` : endTimeMinutes}${endTimeHours > 11 ? "pm" : "am"}`;

        let lengthInMinutes = (Date.parse(endTime) - Date.parse(startTime)) / 1000 / 60;
        let heightClass = `time-block-${lengthInMinutes}`;
        let heightClassExists = !!CSS_CLASS_DICTIONARY[`.${heightClass}`];

        let minutesSinceDayStartTime = (Date.parse(session.startDateTime) - Date.parse(dayStartTime)) / 1000 / 60;
        let sessionLocationInPixels = minutesSinceDayStartTime * HOUR_HEIGHT / 60;

        let tooltip = (
            <Tooltip>
                {speakers.map((speaker) => {
                    let speakerName = `${speaker.firstName} ${speaker.lastName}`;
                    if (speaker.prefix) { speakerName = `${speaker.prefix} ${speakerName}`; }
                    return (
                        <div className={classNames("session-speaker-text")}>
                            {speakerName}
                        </div>
                    )
                })}
                <div className={classNames("session-title-text")}>
                    {session.title}
                </div>
                <div className={classNames("session-time-text")}>
                    {`${startTimeString} - ${endTimeString}`}
                </div>
            </Tooltip>
        );

        return (
            <OverlayTrigger overlay={tooltip} placement="top" delayShow={500}>
                <div
                    name="Session"
                    className={classNames("session-card", heightClass)}
                    style={!heightClassExists ? {
                        height: `${lengthInMinutes / 60 * HOUR_HEIGHT}px`,
                        top: `${sessionLocationInPixels + TIMELINE_VERTICAL_OFFSET}px`,
                    } : {
                        top: `${sessionLocationInPixels + TIMELINE_VERTICAL_OFFSET}px`
                    }}
                    onClick={onSessionClicked}
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
                        {`${startTimeString} - ${endTimeString}`}
                    </div>
                </div>
            </OverlayTrigger>
        );
    }

}

SessionCard.propTypes = {
    session: PropTypes.object,
    onSessionClicked: PropTypes.func,
    dayStartTime: PropTypes.object,
};
