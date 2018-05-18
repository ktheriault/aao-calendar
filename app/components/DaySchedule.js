import React, { Component } from "react";
import PropTypes from "prop-types";
import { Nav, NavItem } from "react-bootstrap";
import { SCHEDULE_VIEWS } from "../global";

export default class DaySchedule extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { viewKey, onViewChanged, sessions } = this.props;
        let visibleSessions = sessions.filter((session) => {
            return session[viewKey];
        });
        return visibleSessions && visibleSessions.length > 0 ? (
            <div>
                <Nav bsStyle="tabs" activeKey={viewKey} onSelect={onViewChanged}>
                    {Object.keys(SCHEDULE_VIEWS).map((scheduleView) => {
                        let scheduleViewKey = SCHEDULE_VIEWS[scheduleView].key;
                        let scheduleViewTitle = SCHEDULE_VIEWS[scheduleView].title;
                        return (
                            <NavItem key={scheduleViewKey} eventKey={scheduleViewKey}>
                                {scheduleViewTitle}
                            </NavItem>
                        );
                    })}
                </Nav>
                {visibleSessions.map((session, i) => {
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
    viewKey: PropTypes.string,
    onViewChanged: PropTypes.func,
    sessions: PropTypes.array,
};

DaySchedule.defaultProps = {
    viewKey: SCHEDULE_VIEWS.FOR_DOCTORS.key,
    sessions: [],
};