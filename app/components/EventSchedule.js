import React, { Component } from "react";
import PropTypes from "prop-types";
import { Nav, NavItem } from "react-bootstrap";
import DaySchedule from "../components/DaySchedule";
import * as api from "../api";

export default class EventSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedDayKey: 0,
            isLoading: true,
        }
    }

    async componentDidMount() {
        let { eventID } = this.props;
        let eventData = await api.getEventByID(eventID, false, false, true);

        // TODO: Move this to API.
        let eventInfo = eventData && eventData.event ? {
            ...eventData.event,
            startDate: new Date(Date.parse(eventData.event.startDate)),
            endDate: new Date(Date.parse(eventData.event.endDate))
        } : null;

        let eventSessions = eventData && eventData.related ? eventData.related.sessions : null;
        let eventSessionsByDay = {};
        eventSessions.forEach((session) => {
            let startDay = (new Date(Date.parse(session.startDateTime))).toDateString();
            if (eventSessionsByDay[startDay]) {
                eventSessionsByDay[startDay] = [
                    ...eventSessionsByDay[startDay],
                    session,
                ];
            } else {
                eventSessionsByDay[startDay] = [
                    session,
                ];
            }
        });
        let eventDays = Object.keys(eventSessionsByDay).map((eventDayString) => {
            return Date.parse(eventDayString);
        });
        eventDays.sort();
        eventDays = eventDays.map((eventMsString) => {
            return (new Date(eventMsString)).toDateString();
        });

        this.setState({
            eventInfo: eventInfo,
            eventDays: eventDays,
            eventSessions: eventSessions,
            eventSessionsByDay: eventSessionsByDay,
            isLoading: false,
        });
    }

    onDaySelected = (selectedKey) => {
        this.setState({
            selectedDayKey: selectedKey,
        })
    };

    render() {
        let { selectedDayKey, eventInfo, eventDays, eventSessions, eventSessionsByDay, isLoading } = this.state;
        return isLoading ? (
            <div>Loading event data...</div>
        ) : (
            <div>
                <div>Name: {eventInfo.title}</div>
                <div>Start date: {eventInfo.startDate.toDateString()}</div>
                <div>End date: {eventInfo.endDate.toDateString()}</div>
                <div>Number of sessions: {eventSessions ? eventSessions.length : "Unknown"}</div>
                <Nav bsStyle="pills" activeKey={selectedDayKey} onSelect={this.onDaySelected}>
                    {eventDays.map((eventDay, i) => {
                        return (
                            <NavItem key={eventDay} eventKey={i}>
                                {(new Date(Date.parse(eventDay)).toDateString())}
                            </NavItem>
                        );
                    })}
                </Nav>
                <DaySchedule
                    view=""
                    onViewChanged={() => {}}
                    sessions={eventSessionsByDay[eventDays[selectedDayKey]]}
                />
            </div>
        )
    }
}

EventSchedule.propTypes = {
    eventID: PropTypes.string,
};