import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Nav, NavItem } from "react-bootstrap";
import DaySchedule from "../components/DaySchedule";
import * as api from "../api";
import { SCHEDULE_VIEWS, ABBR_MONTHS, ABBR_DAYS } from "../global";

export default class EventSchedule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            eventDays: [],
            eventSessions: {},
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
            let { eventDays, parsedEventSessions } = eventData;

            this.setState({
                eventDays: eventDays,
                eventSessions: parsedEventSessions,
                selectedDayKey: eventDays.length > 0 ? eventDays[0] : null,
                isLoading: false,
            });
        }

    }

    onDaySelected = (dayKey) => {
        this.setState({
            selectedDayKey: dayKey,
            selectedRoomIndex: 0,
        })
    };

    onViewChanged = (viewKey) => {
        this.setState({
            selectedViewKey: viewKey,
            selectedRoomIndex: 0,
        })
    };

    onRoomIncrement = () => {
        let { eventSessions, selectedDayKey, selectedViewKey, selectedRoomIndex } = this.state;
        let numberOfRooms = Object.keys(eventSessions[selectedDayKey][selectedViewKey].sessions).length;
        this.setState({
            selectedRoomIndex: (selectedRoomIndex + 1 + numberOfRooms) % numberOfRooms,
        });
    };

    onRoomDecrement = () => {
        let { eventSessions, selectedDayKey, selectedViewKey, selectedRoomIndex } = this.state;
        let numberOfRooms = Object.keys(eventSessions[selectedDayKey][selectedViewKey].sessions).length;
        this.setState({
            selectedRoomIndex: (selectedRoomIndex - 1 + numberOfRooms) % numberOfRooms,
        });
    };

    render() {
        let {
            selectedDayKey,
            selectedViewKey,
            selectedRoomIndex,
            eventDays,
            eventSessions,
            isLoading
        } = this.state;

        if (isLoading) {
            return (
                <div>Loading event data...</div>
            );
        }

        let { sessions, dayStartTime, dayEndTime } = eventSessions[selectedDayKey][selectedViewKey];

        return (
            <div>
                <Nav
                    bsStyle="pills"
                    className={classNames("event-day-selector")}
                    activeKey={selectedDayKey}
                    onSelect={this.onDaySelected}
                >
                    {eventDays.map((eventDay) => {
                        let date = new Date(eventDay);
                        let dateString = `${ABBR_DAYS[date.getDay()]}, ${ABBR_MONTHS[date.getMonth()]} ${date.getDate()}`
                        return (
                            <NavItem key={eventDay} eventKey={eventDay}>
                                {dateString}
                            </NavItem>
                        );
                    })}
                </Nav>
                <DaySchedule
                    viewKey={selectedViewKey}
                    onViewChanged={this.onViewChanged}
                    selectedRoomIndex={selectedRoomIndex}
                    onRoomIncrement={this.onRoomIncrement}
                    onRoomDecrement={this.onRoomDecrement}
                    dayStartTime={dayStartTime}
                    dayEndTime={dayEndTime}
                    sessionsByRoom={sessions}
                />
            </div>
        );
    }
}

EventSchedule.propTypes = {
    eventID: PropTypes.string,
};
