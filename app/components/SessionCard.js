import React, { Component } from "react";
import PropTypes from "prop-types";
import { HOUR_HEIGHT } from "../global";

export default class SessionCard extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        let { session } = this.props;
        let startTime = new Date(Date.parse(session.startDateTime));
        let endTime = new Date(Date.parse(session.endDateTime));
        let sessionLength = (Date.parse(session.endDateTime) - Date.parse(session.startDateTime)) / 1000 / 3600;
        let height = `${(sessionLength * HOUR_HEIGHT).toString()}em`;

        let speakers = [];
        session.sessionParts.forEach((sessionPart) => {
            speakers = [
                ...speakers,
                ...sessionPart.speakers,
            ];
        });

        return (
            <div style={{border: "1px solid black", height: height}}>
                {speakers.map((speaker) => {
                    let speakerName = `${speaker.firstName} ${speaker.lastName}`;
                    if (speaker.prefix) { speakerName = `${speaker.prefix} ${speakerName}`; }
                    return (
                        <div style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "10px"}}>
                            {speakerName}
                        </div>
                    )
                })}
                <div style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "10px"}}>{session.title}</div>
            </div>
        )
    }

}

SessionCard.propTypes = {
    session: PropTypes.object,
};