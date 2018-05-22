import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Modal, Badge } from "react-bootstrap";
import "../style/SessionModal.css";

export default class SessionModal extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { isVisible, onClose, session } = this.props;
        if (session && Object.keys(session).length > 0) {
            let { title, credits, fee, startDateTime, endDateTime, sessionParts } = session;
            let sessionLength = (Date.parse(endDateTime) - Date.parse(startDateTime)) / 1000 / 60;
            if (sessionParts && sessionParts.length > 0) {
                let {
                    speakers,
                    description,
                    learningObjective1,
                    learningObjective2,
                    learningObjective3
                } = sessionParts[0];
                let learningObjectives = [ learningObjective1, learningObjective2, learningObjective3 ];
                return (
                    <Modal
                        show={isVisible}
                        onHide={onClose}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>{title}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {(credits || sessionLength) && (
                                <div>
                                    {credits && (
                                        <span className={classNames("modal-inline-info")}>
                                            <Badge>{`${credits} CE`}</Badge>
                                        </span>
                                    )}
                                    {sessionLength && <span>{`${sessionLength} minutes`}</span>}
                                </div>
                            )}
                            {fee && (
                                <div className={classNames("modal-section")}>
                                    <span className={classNames("modal-bold-text")}>Fee</span>{`: ${fee}`}
                                </div>
                            )}
                            {speakers && (
                                <div className={classNames("modal-section")}>
                                    <h4>Speakers</h4>
                                    {speakers.map((speaker) => {
                                        let { fullName, hasFinancialInterest } = speaker;
                                        return (
                                            <div className={classNames("modal-indent")}>
                                                <h5>{fullName}</h5>
                                                {hasFinancialInterest && (
                                                    <p className={classNames("modal-small-text")}>
                                                        * Has financial interest
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            {description && (
                                <div className={classNames("modal-section")}>
                                    <h4>Description</h4>
                                    <p className={classNames("modal-indent")}>
                                        {description}
                                    </p>
                                </div>
                            )}
                            {learningObjectives && learningObjectives.length && (
                                <div className={classNames("modal-section")}>
                                    <h4>Learning Objectives</h4>
                                    <ul>
                                        {learningObjectives.map((learningObjective) => {
                                            return learningObjective && (
                                                <li>{learningObjective}</li>
                                                );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </Modal.Body>
                    </Modal>
                );
            }
        }
        return null;
    }
}

SessionModal.propTypes = {
    isVisible: PropTypes.bool,
    onClose: PropTypes.func,
    session: PropTypes.object,
};

SessionModal.defaultProps = {
    isVisible: false,
    session: {},
};