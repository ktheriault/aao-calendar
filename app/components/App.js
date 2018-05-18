import React, { Component } from "react";
import EventSchedule from "../components/EventSchedule";
import { EVENT_ID } from "../global";

class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div style={{padding: "2em"}}>
                <EventSchedule
                    eventID={EVENT_ID}
                />
            </div>
        );
    }

}

export default App;