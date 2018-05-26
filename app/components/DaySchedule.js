import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Nav, NavItem, DropdownButton, MenuItem } from "react-bootstrap";
import Timeline from '../components/Timeline';
import RoomSchedule from "../components/RoomSchedule";
import SessionModal from "../components/SessionModal";
import { SCHEDULE_VIEWS, HOUR_HEIGHT, TIMELINE_VERTICAL_OFFSET, getScrollbarWidth } from "../global";
import "../style/App.css";

export default class DaySchedule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            singleColumnView: false,
            selectedRoomIndex: 0,
            scrollbarWidth: 0,
            showModal: false,
            sessionInModal: {},
        };
    }

    componentDidCatch(error, errorInfo) {
        console.log("DaySchedule error");
        console.log(error);
        console.log(typeof error);
        console.log(Object.keys(error));
        console.log(error.stack ? error.stack : null);
    }

    componentDidMount() {
        console.log("DaySchedule.componentDidMount start");
        this.updateScreenSize();
        window.addEventListener('resize', this.updateScreenSize);
        console.log("DaySchedule.componentDidMount end");
        this.setState({
            scrollbarWidth: getScrollbarWidth(),
        })
    }

    componentDidUnmount() {
        window.removeEventListener('resize', this.updateScreenSize);
    }

    getOnSessionClickedHandler = (room) => {
        return (i) => {
            return () => {
                let sessionInModal = this.props.sessionsByRoom[room][i];
                this.setState({
                    sessionInModal: sessionInModal,
                    showModal: true,
                });
            }
        }
    };

    onModalClose = () => {
        this.setState({
            showModal: false,
        });
    };

    updateScreenSize = () => {
        this.setState({
            singleColumnView: window.innerWidth <= 768,
        });
        console.log("updateScreenSize:", window.innerWidth);
    };

    render() {
        console.log("DaySchedule.render");
        let {
            viewKey,
            onViewChanged,
            selectedRoomIndex,
            getOnRoomChangedHandler,
            sessionsByRoom,
            dayStartTime,
            dayEndTime
        } = this.props;
        let { singleColumnView, scrollbarWidth, showModal, sessionInModal } = this.state;
        let roomList = Object.keys(sessionsByRoom);
        roomList.sort();
        let roomsToDisplay = singleColumnView ? roomList.slice(selectedRoomIndex, selectedRoomIndex + 1) : roomList;

        let calendarHeight = ((Date.parse(dayEndTime) - Date.parse(dayStartTime)) / 1000 / 3600 * HOUR_HEIGHT) + TIMELINE_VERTICAL_OFFSET;

        console.log("DaySchedule.render done with calculations");

        /*
        if (sessionsByRoom && Object.keys(sessionsByRoom).length > 0) {
            let scheduleViews = Object.keys(SCHEDULE_VIEWS).map((scheduleView) => {
                let scheduleViewKey = SCHEDULE_VIEWS[scheduleView].key;
                let scheduleViewTitle = SCHEDULE_VIEWS[scheduleView].title;
                return (
                    <NavItem key={scheduleViewKey} eventKey={scheduleViewKey}>
                        {scheduleViewTitle}
                    </NavItem>
                );
            });
            console.log("DaySchedule.render done with scheduleViews");
            let nav = (
                <Nav
                    bsStyle="tabs"
                    activeKey={viewKey}
                    onSelect={onViewChanged}
                >
                    {scheduleViews}
                </Nav>
            );
            console.log("DaySchedule.render done with nav");

            let roomNames = roomsToDisplay && roomsToDisplay.map((room) => {
                return (
                    <div className={classNames("room-name-column")}>
                        <div className={classNames("room-name", "overflow-text")}>
                            {room}
                        </div>
                    </div>
                );
            });
            console.log("DaySchedule.render done with roomNames");

            let timeline = (
                <Timeline
                    startTime={dayStartTime}
                    endTime={dayEndTime}
                />
            );
            console.log("DaySchedule.render done with timeline");
            let roomSessions = roomsToDisplay && roomsToDisplay.map((room) => {
                let sessions = sessionsByRoom[room];
                return (
                    <div
                        className={classNames("room-calendar-column")}
                        style={{ height: `${calendarHeight}px` }}
                    >
                        <RoomSchedule
                            room={room}
                            sessions={sessions}
                            onSessionClickedHandler={this.getOnSessionClickedHandler(room)}
                            dayStartTime={dayStartTime}
                            dayEndTime={dayEndTime}
                        />
                    </div>
                );
            });
            console.log("DaySchedule.render done with roomSessions");
            let scrollbar = (
                <ScrollbarSize
                    onLoad={this.onScrollbarLoad}
                    onChange={this.onScrollbarChange}
                />
            );
            console.log("DaySchedule.render done with scrollbar");
            let roomSchedules = (
                <div>
                    {timeline}
                    {roomSessions}
                    {scrollbar}
                </div>
            );
            console.log("DaySchedule.render done with roomSchedules");

            let roomCalendar = (
                <div>
                    {roomNames}
                    {roomSchedules}
                </div>
            );
            console.log("DaySchedule.render done with roomCalendar");

            let modal = (
                <SessionModal
                    isVisible={showModal}
                    onClose={this.onModalClose}
                    session={sessionInModal}
                />
            );
            console.log("DaySchedule.render done with modal");

            let daySchedule = (
                <div>
                    {nav}
                    {roomCalendar}
                    {modal}
                </div>
            )
            console.log("DaySchedule.render done with daySchedule");

        }
        */

        return sessionsByRoom && Object.keys(sessionsByRoom).length > 0 ? (
            <div>
                <Nav
                    bsStyle="tabs"
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
                                <div
                                    className={classNames("room-calendar-column")}
                                    style={{height: `${calendarHeight}px`}}
                                >
                                    <RoomSchedule
                                        room={room}
                                        sessions={sessions}
                                        onSessionClickedHandler={this.getOnSessionClickedHandler(room)}
                                        dayStartTime={dayStartTime}
                                        dayEndTime={dayEndTime}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/*
                    <SessionModal
                        isVisible={showModal}
                        onClose={this.onModalClose}
                        session={sessionInModal}
                    />
                */}
            </div>
        ) : (
            <div>No sessions yet!</div>
        );

        /*
        return sessionsByRoom && Object.keys(sessionsByRoom).length > 0 ? (
            <div>
                <Nav
                    bsStyle="tabs"
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
                                <div
                                    className={classNames("room-calendar-column")}
                                    style={{ height: `${calendarHeight}px` }}
                                >
                                    <RoomSchedule
                                        room={room}
                                        sessions={sessions}
                                        onSessionClickedHandler={this.getOnSessionClickedHandler(room)}
                                        dayStartTime={dayStartTime}
                                        dayEndTime={dayEndTime}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
                <SessionModal
                    isVisible={showModal}
                    onClose={this.onModalClose}
                    session={sessionInModal}
                />
            </div>
        ) : (
            <div>No sessions yet!</div>
        );
        */
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
