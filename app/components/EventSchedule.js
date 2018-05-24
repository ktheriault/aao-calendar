import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Nav, NavItem } from "react-bootstrap";
import DaySchedule from "../components/DaySchedule";
import * as api from "../api";
import { SCHEDULE_VIEWS } from "../global";
import "../style/App.css";

export default class EventSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            eventInfo: {},
            eventDays: [],
            eventSessions: [],
            eventSessionsByDay: {},
            selectedDayKey: null,
            selectedViewKey: SCHEDULE_VIEWS.FOR_DOCTORS.key,
            selectedRoomIndex: 0,
            isLoading: true,
        }
    }

    async componentDidMount() {
        let { eventID } = this.props;
        let eventData = await api.getEventByID(eventID, false, true, true);
        eventData = await api.parseEventData(eventData);
        if (eventData) {
            let {
                eventInfo,
                eventDays,
                eventSessions,
                eventSessionsByDay,
            } = eventData;

            this.setState({
                eventInfo: eventInfo,
                eventDays: eventDays,
                eventSessions: eventSessions,
                eventSessionsByDay: eventSessionsByDay,
                selectedDayKey: eventDays.length > 0 ? eventDays[0] : null,
                isLoading: false,
            });
        }

    }

    onDaySelected = (dayKey) => {
        this.setState({
            selectedDayKey: dayKey,
        })
    };

    onViewChanged = (viewKey) => {
        this.setState({
            selectedViewKey: viewKey,
        })
    };

    getOnRoomChangedHandler = (i) => {
        return () => {
            this.setState({
                selectedRoomIndex: i,
            });
        }
    };

    render() {
        let {
            selectedDayKey,
            selectedViewKey,
            selectedRoomIndex,
            eventInfo,
            eventDays,
            eventSessions,
            eventSessionsByDay,
            isLoading
        } = this.state;

        if (isLoading) {
            return (
                <div>Loading event data...</div>
            );
        }

        // TODO Move to API.
        let daySessions = eventSessionsByDay[selectedDayKey];
        let visibleDaySessions = daySessions.filter((session) => {
            return session[selectedViewKey];
        });
        let visibleDaySessionsByRoom = {};
        visibleDaySessions.forEach((session) => {
            let roomNumber = session.roomNumber;
            if (visibleDaySessionsByRoom[roomNumber]) {
                visibleDaySessionsByRoom[roomNumber] = [
                    ...visibleDaySessionsByRoom[roomNumber],
                    session,
                ];
            } else {
                visibleDaySessionsByRoom[roomNumber] = [
                    session,
                ];
            }
        });
        let rooms = Object.keys(visibleDaySessionsByRoom);
        rooms.sort();

        // TODO Calculate this.
        let dayStartTime = null;
        let dayEndTime = null;
        if (visibleDaySessions && visibleDaySessions.length > 0) {
            dayStartTime = new Date(visibleDaySessions[0].startDateTime);
            dayStartTime.setHours(8);
            dayStartTime.setMinutes(0);
            dayStartTime.setSeconds(0);
            dayEndTime = new Date(visibleDaySessions[visibleDaySessions.length - 1].endDateTime);
            dayEndTime.setHours(18);
            dayEndTime.setMinutes(0);
            dayEndTime.setSeconds(0);
        }

        return (
            <div>
                <div className={classNames("event-description")}>
                    <div>Name: {eventInfo.title}</div>
                    <div>Start date: {eventInfo.startDate.toDateString()}</div>
                    <div>End date: {eventInfo.endDate.toDateString()}</div>
                    <div>Number of sessions: {eventSessions ? eventSessions.length : "Unknown"}</div>
                </div>
                <Nav
                    bsStyle="pills"
                    className={classNames("event-day-selector")}
                    activeKey={selectedDayKey}
                    onSelect={this.onDaySelected}
                >
                    {eventDays.map((eventDay, i) => {
                        return (
                            <NavItem key={eventDay} eventKey={eventDay}>
                                {(new Date(Date.parse(eventDay)).toDateString())}
                            </NavItem>
                        );
                    })}
                </Nav>
                <DaySchedule
                    viewKey={selectedViewKey}
                    onViewChanged={this.onViewChanged}
                    selectedRoomIndex={selectedRoomIndex}
                    getOnRoomChangedHandler={this.getOnRoomChangedHandler}
                    dayStartTime={dayStartTime}
                    dayEndTime={dayEndTime}
                    sessionsByRoom={visibleDaySessionsByRoom}
                />
            </div>
        );
    }
}

EventSchedule.propTypes = {
    eventID: PropTypes.string,
};
