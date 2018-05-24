import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Modal, Badge } from "react-bootstrap";
import Img from "react-image";
import "../style/SessionModal.css";

export default class SessionModal extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let { isVisible, onClose, session } = this.props;
        if (session && Object.keys(session).length > 0) {
            let { title, credits, fee, startDateTime, endDateTime, speakers, sessionParts } = session;
            let sessionLength = (Date.parse(endDateTime) - Date.parse(startDateTime)) / 1000 / 60;
            if (sessionParts && sessionParts.length > 0) {
                let {
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
                            <div className={classNames("modal-section")}>
                                {(credits || sessionLength) && (
                                    <div>
                                        {credits && (
                                            <div className={classNames("modal-inline-item")}>
                                                <Badge>{`${credits} CE`}</Badge>
                                            </div>
                                        )}
                                        {sessionLength && (
                                            <div className={classNames("modal-inline-item")}>
                                                {`${sessionLength} minutes`}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {fee && (
                                    <div>
                                        <span className={classNames("modal-bold-text")}>Fee</span>{`: ${fee}`}
                                    </div>
                                )}
                            </div>
                            {speakers && (
                                <div className={classNames("modal-section")}>
                                    <h4 className={classNames("modal-section-title")}>Speakers</h4>
                                    {speakers.map((speaker) => {
                                        let { fullName, hasFinancialInterest, speakerBio, pictureURL } = speaker;
                                        return (
                                            <div className={classNames("modal-indent", "modal-subsection")}>
                                                <div className={classNames("modal-float-item")}>
                                                    {pictureURL && (
                                                        <Img src={pictureURL} className={classNames("modal-image")}/>
                                                    )}
                                                </div>
                                                <div>
                                                    <h5>{fullName}</h5>
                                                    {hasFinancialInterest && (
                                                        <p className={classNames("modal-small-text")}>
                                                            * Has financial interest
                                                        </p>
                                                    )}
                                                    {speakerBio && (
                                                        <p>{speakerBio}</p>
                                                    )}
                                                </div>
                                                <div className={classNames("modal-clearfix")}/>
                                            </div>
                                        );
                                    })}
                                    <div className={classNames("modal-clearfix")}/>
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