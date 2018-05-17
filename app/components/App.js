import React, { Component, PropTypes } from "react";
import * as api from "../api";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            eventList: null,
            selectedEvent: null,
            selectedSessions: null,
            isLoading: true,
        };
        this.onEventSelectedHandler = this.onEventSelectedHandler.bind(this);
    }

    async componentDidMount() {
        let response = await api.getEventList();
        this.setState({
            eventList: response.events,
            isLoading: false,
        })
    }

    onEventSelectedHandler(eventID) {
        return async () => {
            let selectedEventData = await api.getEventByID(eventID, false, false, true);
            // console.log(selectedEventData);
            let selectedEvent = selectedEventData && selectedEventData.event ? {
                ...selectedEventData.event,
                startDate: new Date(Date.parse(selectedEventData.event.startDate)),
                endDate: new Date(Date.parse(selectedEventData.event.endDate))
            } : null;
            let selectedSessions = selectedEventData && selectedEventData.related ? selectedEventData.related.sessions : null;
            this.setState({
                selectedEvent: selectedEvent,
                selectedSessions: selectedSessions,
            });
            // console.log(selectedEvent);
            // console.log(selectedSessions);
        }
    };

    render() {
        let { eventList, selectedEvent, selectedSessions, isLoading } = this.state;
        return isLoading ? (
            <div>Loading event list...</div>
        ) : (
            <div>
                <div>
                    {eventList.map((event) => {
                        return (
                            <div key={event.id}>
                                <button onClick={this.onEventSelectedHandler(event.id)}>
                                    {event.title}
                                </button>
                            </div>
                        )
                    })}
                </div>
                {selectedEvent ? (
                    <div>
                        <div>Name: {selectedEvent.title}</div>
                        <div>Start date: {selectedEvent.startDate.toLocaleString()}</div>
                        <div>End date: {selectedEvent.endDate.toLocaleString()}</div>
                        <div>Number of sessions: {selectedSessions ? selectedSessions.length : "Unknown"}</div>
                        {selectedSessions && selectedSessions.map((session, i) => {
                            return <div key={session.id}>{i+1}. {session.title}</div>
                        })}
                    </div>
                ) : (
                    <div>Select an event to see data!</div>
                )}
            </div>
        );
    }

}

export default App;