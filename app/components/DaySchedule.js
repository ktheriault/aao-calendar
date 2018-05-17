import React, { Component } from "react";
import PropTypes from "prop-types";

export default class DaySchedule extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { sessions } = this.props;
        return sessions && sessions.length > 0 ? (
            <div>
                {sessions.map((session, i) => {
                    return (
                        <div key={session.id}>
                            {i+1}. {session.title}
                        </div>
                    )
                })}
            </div>
        ) : (
            <div>No sessions yet!</div>
        )
    }

}

DaySchedule.propTypes = {
    view: PropTypes.string,
    sessions: PropTypes.array,
};

DaySchedule.defaultProps = {
    view: null,
    sessions: [],
};