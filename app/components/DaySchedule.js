import React, { Component } from "react";
import PropTypes from "prop-types";
import { Nav, NavItem, Grid, Row, Col } from "react-bootstrap";
import RoomSchedule from "./RoomSchedule";
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
        let sessionsByRoom = {};
        visibleSessions.forEach((session) => {
            let roomNumber = session.roomNumber;
            if (sessionsByRoom[roomNumber]) {
                sessionsByRoom[roomNumber] = [
                    ...sessionsByRoom[roomNumber],
                    session,
                ];
            } else {
                sessionsByRoom[roomNumber] = [
                    session,
                ];
            }
        });
        let rooms = Object.keys(sessionsByRoom);
        rooms.sort();
        let numberOfRooms = rooms.length;
        let colSize = Math.max(numberOfRooms ? parseInt(12/numberOfRooms) : 4, 2);

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
                <Grid>
                    <Row style={{overflowX: "auto"}}>
                        {rooms && rooms.map((room) => {
                            let sessions = sessionsByRoom[room];
                            return (
                                <Col xsHidden sm={colSize}>
                                    <RoomSchedule
                                        room={room}
                                        sessions={sessions}
                                    />
                                </Col>
                            );
                        })}
                        <Col smHidden mdHidden lgHidden>
                            <RoomSchedule
                                room={rooms[0]}
                                sessions={sessionsByRoom[rooms[0]]}
                            />
                        </Col>
                    </Row>
                </Grid>
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