import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import SessionCard from "../components/SessionCard";
import { HOUR_HEIGHT, TIMELINE_VERTICAL_OFFSET } from "../global";

export default class RoomSchedule extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { sessions, onSessionClickedHandler, dayStartTime, dayEndTime } = this.props;
        let numberOfHours = ((Date.parse(dayEndTime) - Date.parse(dayStartTime)) / 1000 / 3600) + 1;
        let hours = Array.apply(null, new Array(numberOfHours)).map((empty, i) => { return i; });

        return (
            <div className={classNames("sessions-container")}>
                {hours && hours.map((hour, hoursSinceStartTime) => {
                    let timeLocationInPixels = hoursSinceStartTime * HOUR_HEIGHT;
                    return (
                        <hr
                            className={classNames("hour-rule")}
                            style={{ top: `${timeLocationInPixels + TIMELINE_VERTICAL_OFFSET}px` }}
                        />
                    )
                })}
                {sessions && sessions.map((session, i) => {
                    return (
                        <SessionCard
                            session={session}
                            onSessionClicked={onSessionClickedHandler(i)}
                            dayStartTime={dayStartTime}
                        />
                    );
                })}
            </div>
        );
    }

}

RoomSchedule.propTypes = {
    sessions: PropTypes.array,
    onSessionClickedHandler: PropTypes.func,
    dayStartTime: PropTypes.object,
    dayEndTime: PropTypes.object,
};

RoomSchedule.defaultProps = {
    sessions: [],
};
