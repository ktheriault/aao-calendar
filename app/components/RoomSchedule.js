import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import SessionCard from "../components/SessionCard";
import "../style/App.css";

export default class RoomSchedule extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { sessions, dayStartTime } = this.props;
        return (
            <div name="RoomSchedule" className={classNames("sessions-container")}>
                {sessions && sessions.map((session) => {
                    return (
                        <SessionCard
                            session={session}
                            dayStartTime={dayStartTime}
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
};

RoomSchedule.defaultProps = {
    sessions: [],
};
