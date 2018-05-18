import React, { Component } from "react";
import PropTypes from "prop-types";
import SessionCard from "../components/SessionCard";

export default class RoomSchedule extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { room, sessions } = this.props;
        return (
            <div>
                <div style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
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