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
        let { room, sessions } = this.props;
        return (
            <div>
                <div className={classNames("overflow-text")}>
                    {room}
                </div>
                <div>
                    {sessions && sessions.map((session) => {
                        return (
                            <SessionCard
                                session={session}
                            />
                        );
                     })}
                </div>
            </div>
    )
    }

}

RoomSchedule.propTypes = {
    room: PropTypes.string,
    sessions: PropTypes.array,
};

RoomSchedule.defaultProps = {
    room: "",
    sessions: [],
};