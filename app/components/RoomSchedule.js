import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import SessionCard from "../components/SessionCard";
import { HOUR_HEIGHT } from "../global";
import "../style/App.css";

export default class RoomSchedule extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { sessions, dayStartTime, dayEndTime } = this.props;
        let numberOfHours = ((Date.parse(dayEndTime) - Date.parse(dayStartTime)) / 1000 / 3600) + 1;
        let hours = Array.apply(null, Array(numberOfHours)).map((empty, i) => { return i; });

        // TODO Un-hard-code this. Depends on font size of times.
        let verticalOffset = 10;
        return (
            <div name="RoomSchedule" className={classNames("sessions-container")}>
                {hours && hours.map((hour, hoursSinceStartTime) => {
                    let timeLocationInPixels = hoursSinceStartTime * HOUR_HEIGHT;
                    return (
                        <hr
                            className={classNames("hour-rule")}
                            style={{ top: `${timeLocationInPixels + verticalOffset}px` }}
                        />
                    )
                })}
                {sessions && sessions.map((session) => {
                    return (
                        <SessionCard
                            session={session}
                            dayStartTime={dayStartTime}
                            verticalOffset={verticalOffset}
                        />
                    );
                })}
            </div>
    )
    }

}

RoomSchedule.propTypes = {
    sessions: PropTypes.array,
    dayStartTime: PropTypes.object,
    dayEndTime: PropTypes.object,
};

RoomSchedule.defaultProps = {
    sessions: [],
};
