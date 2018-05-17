import React, { Component } from "react";
import EventSchedule from "../components/EventSchedule";
import * as api from "../api";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            eventList: null,
            selectedEventID: null,
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
        return () => {
            this.setState({
                selectedEventID: eventID,
            });
        }
    }

    render() {
        let { eventList, selectedEventID, isLoading } = this.state;
        return isLoading ? (
            <div style={{padding: "2em"}}>Loading event list...</div>
        ) : (
            <div style={{padding: "2em"}}>
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
                {selectedEventID ? (
                    <EventSchedule
                        eventID={selectedEventID}
                    />
                ) : (
                    <div>Select an event to see data!</div>
                )}
            </div>
        );
    }

}

export default App;