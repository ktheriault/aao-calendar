import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Nav, NavItem } from "react-bootstrap";
import Timeline from '../components/Timeline';
import RoomSchedule from "../components/RoomSchedule";
import { SCHEDULE_VIEWS } from "../global";
import "../style/App.css";

export default class DaySchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            singleColumnView: false,
            selectedRoomIndex: 0,
        };
    }

    componentDidMount() {
        this.updateScreenSize();
        window.addEventListener('resize', this.updateScreenSize);
    }

    componentDidUnmount() {
        window.removeEventListener('resize', this.updateScreenSize);
    }

    updateScreenSize = () => {
        this.setState({
            singleColumnView: window.innerWidth <= 768,
        });
    };

    render() {
        let { viewKey, onViewChanged, sessionsByRoom, dayStartTime, dayEndTime } = this.props;
        let { singleColumnView, selectedRoomIndex } = this.state;
        let rooms = Object.keys(sessionsByRoom);
        if (singleColumnView) {
            rooms = rooms.slice(selectedRoomIndex, selectedRoomIndex + 1);
        }

        return sessionsByRoom && Object.keys(sessionsByRoom).length > 0 ? (
            <div>
                <Nav
                    bsStyle="tabs"
                    className={classNames("day-schedule-filters")}
                    activeKey={viewKey}
                    onSelect={onViewChanged}
                >
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
                <div>
                    <div className={classNames("room-names")}>
                        <div className={classNames("timeline-placeholder")}/>
                        {rooms && rooms.map((room) => {
                            return (
                                <div className={classNames("room-name-column")}>
                                    <div className={classNames("room-name", "overflow-text")}>
                                        {room}
                                    </div>
                                </div>
                            );
                        })}
                        <div className={classNames("scrollbar-placeholder")}/>
                    </div>
                    <div className={classNames("room-schedules")}>
                        <Timeline
                            startTime={dayStartTime}
                            endTime={dayEndTime}
                        />
                        {rooms && rooms.map((room) => {
                            let sessions = sessionsByRoom[room];
                            return (
                                <div className={classNames("room-calendar-column")}>
                                    <RoomSchedule
                                        room={room}
                                        sessions={sessions}
                                        dayStartTime={dayStartTime}
                                        dayEndTime={dayEndTime}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        ) : (
            <div>No sessions yet!</div>
        )
    }

}

DaySchedule.propTypes = {
    viewKey: PropTypes.string,
    onViewChanged: PropTypes.func,
    dayStartTime: PropTypes.object,
    dayEndTime: PropTypes.object,
    sessionsByRoom: PropTypes.object,
};

DaySchedule.defaultProps = {
    viewKey: SCHEDULE_VIEWS.FOR_DOCTORS.key,
    dayStartTime: {},
    dayEndTime: {},
    sessionsByRoom: {},
};
