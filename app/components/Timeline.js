import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { HOUR_HEIGHT } from '../global';
import "../style/App.css";

export default class Timeline extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidCatch(error, errorInfo) {
        console.log("Timeline error");
        console.log(error);
        console.log(errorInfo.componentStack);
    }

    render() {
        console.log("Timeline.render start");
        let { startTime, endTime } = this.props;
        let startHour = startTime.getHours();
        let numberOfHours = ((Date.parse(endTime) - Date.parse(startTime)) / 1000 / 3600) + 1;
        let hourStrings = Array.apply(null, new Array(numberOfHours)).map((empty, i) => {
            let hour = startHour + i;
            return `${hour > 12 ? hour - 12 : hour}:00 ${hour > 11 ? "pm" : "am"}`;
        });
        console.log("Timeline.render done calculating");
        let returnValue = (
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
        );
        console.log("Timeline.render end");
        return returnValue;
    }

}

Timeline.propTypes = {
    startTime: PropTypes.object,
    endTime: PropTypes.object,
};
