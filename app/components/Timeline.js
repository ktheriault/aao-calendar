import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { HOUR_HEIGHT } from '../global';
import "../style/App.css";

export default class Timeline extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { startTime, endTime } = this.props;
        let startHour = startTime.getHours();
        let numberOfHours = ((Date.parse(endTime) - Date.parse(startTime)) / 1000 / 3600) + 1;
        let hourStrings = Array.apply(null, Array(numberOfHours)).map((empty, i) => {
            let hour = startHour + i;
            return `${hour > 12 ? hour - 12 : hour}:00 ${hour > 11 ? "pm" : "am"}`;
        });
        return (
            <div className={classNames("timeline")}>
                {hourStrings.map((hourString, hoursSinceStartTime) => {
                    let timeLocationInPixels = hoursSinceStartTime * HOUR_HEIGHT;
                    return (
                        <div
                            className={classNames("time")}
                            style={{top: `${timeLocationInPixels}px`}}
                        >
                            {hourString}
                        </div>
                    )
                })}
            </div>
        )
    }

}

Timeline.propTypes = {
    startTime: PropTypes.object,
    endTime: PropTypes.object,
};