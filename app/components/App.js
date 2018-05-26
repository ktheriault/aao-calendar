import React from "react";
import classNames from "classnames";
import EventSchedule from "../components/EventSchedule";
import { EVENT_ID } from "../global";
import "../style/App.css";

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={classNames("app-container")}>
                <EventSchedule
                    eventID={EVENT_ID}
                />
            </div>
        );
    }

}

export default App;