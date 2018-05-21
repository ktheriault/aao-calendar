import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Nav, NavItem, DropdownButton, MenuItem } from "react-bootstrap";
import ScrollbarSize from "react-scrollbar-size";
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
            scrollbarWidth: 0,
        };
    }

    componentDidMount() {
        this.updateScreenSize();
        window.addEventListener('resize', this.updateScreenSize);
    }

    componentDidUnmount() {
        window.removeEventListener('resize', this.updateScreenSize);
    }

    onScrollbarLoad = (measurements) => {
        this.setState({
            scrollbarWidth: measurements.scrollbarWidth,
        })
    };

    onScrollbarChange = (measurements) => {
        this.setState({
            scrollbarWidth: measurements.scrollbarWidth,
        })
    };

    updateScreenSize = () => {
        this.setState({
            singleColumnView: window.innerWidth <= 768,
        });
    };

    render() {
        let {
            viewKey,
            onViewChanged,
            selectedRoomIndex,
            getOnRoomChangedHandler,
            sessionsByRoom,
            dayStartTime,
            dayEndTime
        } = this.props;
        let { singleColumnView, scrollbarWidth } = this.state;
        let roomList = Object.keys(sessionsByRoom);
        let roomsToDisplay = singleColumnView ? roomList.slice(selectedRoomIndex, selectedRoomIndex + 1) : roomList;

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
                {singleColumnView && (
                    <div className={classNames("room-selector")}>
                        <DropdownButton
                            bsStyle="info"
                            title={roomList[selectedRoomIndex]}
                            key={selectedRoomIndex}
                        >
                            {roomList.map((room, i) => {
                                return (
                                    <MenuItem
                                        eventKey={i}
                                        onClick={getOnRoomChangedHandler(i)}
                                    >
                                        {room}
                                    </MenuItem>
                                );
                            })}
                        </DropdownButton>
                    </div>
                )}
                <div>
                    <div className={classNames("room-names")}>
                        <div className={classNames("timeline-placeholder")}/>
                        {roomsToDisplay && roomsToDisplay.map((room) => {
                            return (
                                <div className={classNames("room-name-column")}>
                                    <div className={classNames("room-name", "overflow-text")}>
                                        {room}
                                    </div>
                                </div>
                            );
                        })}
                        <div style={{ width: `${scrollbarWidth}px` }}/>
                    </div>
                    <div className={classNames("room-schedules")}>
                        <Timeline
                            startTime={dayStartTime}
                            endTime={dayEndTime}
                        />
                        {roomsToDisplay && roomsToDisplay.map((room) => {
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
                        <ScrollbarSize
                            onLoad={this.onScrollbarLoad}
                            onChange={this.onScrollbarChange}
                        />
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
    selectedRoomIndex: PropTypes.number,
    getOnRoomChangedHandler: PropTypes.func,
    dayStartTime: PropTypes.object,
    dayEndTime: PropTypes.object,
    sessionsByRoom: PropTypes.object,
};

DaySchedule.defaultProps = {
    viewKey: SCHEDULE_VIEWS.FOR_DOCTORS.key,
    selectedRoomIndex: 0,
    dayStartTime: {},
    dayEndTime: {},
    sessionsByRoom: {},
};
