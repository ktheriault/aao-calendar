import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Nav, NavItem, Button, Glyphicon } from "react-bootstrap";
import Timeline from '../components/Timeline';
import RoomSchedule from "../components/RoomSchedule";
import SessionModal from "../components/SessionModal";
import { SCHEDULE_VIEWS } from "../api";
import { HOUR_HEIGHT, TIMELINE_VERTICAL_OFFSET, getScrollbarWidth } from "../global";

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

    componentDidMount() {
        this.updateScreenSize();
        window.addEventListener('resize', this.updateScreenSize);
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
    };

    render() {
        let {
            viewKey,
            onViewChanged,
            selectedRoomIndex,
            onRoomIncrement,
            onRoomDecrement,
            sessionsByRoom,
            dayStartTime,
            dayEndTime
        } = this.props;
        let { singleColumnView, scrollbarWidth, showModal, sessionInModal } = this.state;
        let roomList = Object.keys(sessionsByRoom);
        roomList.sort();
        let roomsToDisplay = singleColumnView ? roomList.slice(selectedRoomIndex, selectedRoomIndex + 1) : roomList;

        let calendarHeight = ((Date.parse(dayEndTime) - Date.parse(dayStartTime)) / 1000 / 3600 * HOUR_HEIGHT) + TIMELINE_VERTICAL_OFFSET;


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
                <div>
                    <div className={classNames("room-names")}>
                        <div className={classNames("timeline-placeholder")}/>
                        {roomsToDisplay && roomsToDisplay.map((room) => {
                            return (
                                <div className={classNames("room-name-column")}>
                                    {singleColumnView ? (
                                        <div className={classNames("room-name-container")}>
                                            <div className={classNames("left-pagination", "text-info", "glyphicon", "glyphicon-chevron-left")}
                                                 onClick={onRoomDecrement}/>
                                            <div className={classNames("room-selector", "overflow-text")}>
                                                {room}
                                            </div>
                                            <div className={classNames("right-pagination", "text-info", "glyphicon", "glyphicon-chevron-right")}
                                                 onClick={onRoomIncrement}/>
                                        </div>
                                    ) : (
                                        <div className={classNames("room-name-container")}>
                                            <div className={classNames("overflow-text")}>{room}</div>
                                        </div>
                                    )}
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
                {
                    <SessionModal
                        isVisible={showModal}
                        onClose={this.onModalClose}
                        session={sessionInModal}
                    />
                }
            </div>
        ) : (
            <div>No sessions yet!</div>
        );
    }

}

DaySchedule.propTypes = {
    viewKey: PropTypes.string,
    onViewChanged: PropTypes.func,
    selectedRoomIndex: PropTypes.number,
    onRoomIncrement: PropTypes.func,
    onRoomDecrement: PropTypes.func,
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
