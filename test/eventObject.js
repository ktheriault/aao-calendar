let assert = require("assert");
let request = require("request-promise");
let parseEventData = require("../app/api").parseEventData;
let SCHEDULE_VIEWS = require("../app/api").SCHEDULE_VIEWS;

let eventData_noEventData = undefined;

let eventData_noEvent = {
    event: undefined
};

let eventData_noRelated = {
    event: {},
    related: undefined
};

let eventData_noSessions = {
    event: {},
    related: {
        sessions: undefined,
    }
};

let eventData_noSessionParts = {
    event: {},
    related: {
        sessions: [
            {
                title: "Event 1.1",
                startDateTime: "June 1, 2018 08:00:00",
                endDateTime: "June 1, 2018 10:00:00",
                roomNumber: "Room 1",
                forDoctors: true,
                forStaff: false,
            },
            {
                title: "Event 1.2",
                startDateTime: "June 1, 2018 08:00:00",
                endDateTime: "June 1, 2018 10:00:00",
                roomNumber: "Room 2",
                forDoctors: false,
                forStaff: true,
            },
            {
                title: "Event 2.1",
                startDateTime: "June 2, 2018 08:00:00",
                endDateTime: "June 2, 2018 10:00:00",
                roomNumber: "Room 1",
                forDoctors: true,
                forStaff: false,
            },
            {
                title: "Event 2.2",
                startDateTime: "June 2, 2018 08:00:00",
                endDateTime: "June 2, 2018 10:00:00",
                roomNumber: "Room 2",
                forDoctors: false,
                forStaff: true,
            }
        ]
    }
};
let eventData_noSessionParts_parsed = {
    eventDays: [
        new Date("June 1, 2018 08:00:00").toDateString(),
        new Date("June 2, 2018 08:00:00").toDateString(),
    ],
    parsedEventSessions: {
        [new Date("June 1, 2018 08:00:00").toDateString()]: {
            [SCHEDULE_VIEWS.FOR_DOCTORS.key]: {
                sessions: {
                    "Room 1": [
                        {
                            title: "Event 1.1",
                            startDateTime: "June 1, 2018 08:00:00",
                            endDateTime: "June 1, 2018 10:00:00",
                            roomNumber: "Room 1",
                            forDoctors: true,
                            forStaff: false,
                            speakers: [],
                        }
                    ]
                },
                dayStartTime: new Date("June 1, 2018 08:00:00"),
                dayEndTime: new Date("June 1, 2018 10:00:00"),
            },
            [SCHEDULE_VIEWS.FOR_STAFF.key]: {
                sessions: {
                    "Room 2": [
                        {
                            title: "Event 1.2",
                            startDateTime: "June 1, 2018 08:00:00",
                            endDateTime: "June 1, 2018 10:00:00",
                            roomNumber: "Room 2",
                            forDoctors: false,
                            forStaff: true,
                            speakers: [],
                        }
                    ]
                },
                dayStartTime: new Date("June 1, 2018 08:00:00"),
                dayEndTime: new Date("June 1, 2018 10:00:00"),
            }
        },
        [new Date("June 2, 2018 08:00:00").toDateString()]: {
            [SCHEDULE_VIEWS.FOR_DOCTORS.key]: {
                sessions: {
                    "Room 1": [
                        {
                            title: "Event 2.1",
                            startDateTime: "June 2, 2018 08:00:00",
                            endDateTime: "June 2, 2018 10:00:00",
                            roomNumber: "Room 1",
                            forDoctors: true,
                            forStaff: false,
                            speakers: [],
                        }
                    ],
                },
                dayStartTime: new Date("June 2, 2018 08:00:00"),
                dayEndTime: new Date("June 2, 2018 10:00:00"),
            },
            [SCHEDULE_VIEWS.FOR_STAFF.key]: {
                sessions: {
                    "Room 2": [
                        {
                            title: "Event 2.2",
                            startDateTime: "June 2, 2018 08:00:00",
                            endDateTime: "June 2, 2018 10:00:00",
                            roomNumber: "Room 2",
                            forDoctors: false,
                            forStaff: true,
                            speakers: [],
                        }
                    ],
                },
                dayStartTime: new Date("June 2, 2018 08:00:00"),
                dayEndTime: new Date("June 2, 2018 10:00:00"),
            }
        }
    }
};

let eventData_noSpeakers = {
    event: {},
    related: {
        sessions: [
            {
                title: "Event 1.1",
                startDateTime: "June 1, 2018 08:00:00",
                endDateTime: "June 1, 2018 10:00:00",
                roomNumber: "Room 1",
                forDoctors: true,
                forStaff: false,
                sessionParts: [
                    {
                        speakers: undefined
                    }
                ]
            },
            {
                title: "Event 1.2",
                startDateTime: "June 1, 2018 08:00:00",
                endDateTime: "June 1, 2018 10:00:00",
                roomNumber: "Room 2",
                forDoctors: false,
                forStaff: true,
                sessionParts: [
                    {
                        speakers: undefined
                    }
                ]
            },
            {
                title: "Event 2.1",
                startDateTime: "June 2, 2018 08:00:00",
                endDateTime: "June 2, 2018 10:00:00",
                roomNumber: "Room 1",
                forDoctors: true,
                forStaff: false,
                sessionParts: [
                    {
                        speakers: undefined
                    }
                ]
            },
            {
                title: "Event 2.2",
                startDateTime: "June 2, 2018 08:00:00",
                endDateTime: "June 2, 2018 10:00:00",
                roomNumber: "Room 2",
                forDoctors: false,
                forStaff: true,
                sessionParts: [
                    {
                        speakers: undefined
                    }
                ]
            }
        ]
    }
};
let eventData_noSpeakers_parsed = {
    eventDays: [
        new Date("June 1, 2018 08:00:00").toDateString(),
        new Date("June 2, 2018 08:00:00").toDateString(),
    ],
    parsedEventSessions: {
        [new Date("June 1, 2018 08:00:00").toDateString()]: {
            [SCHEDULE_VIEWS.FOR_DOCTORS.key]: {
                sessions: {
                    "Room 1": [
                        {
                            title: "Event 1.1",
                            startDateTime: "June 1, 2018 08:00:00",
                            endDateTime: "June 1, 2018 10:00:00",
                            roomNumber: "Room 1",
                            forDoctors: true,
                            forStaff: false,
                            speakers: [],
                            sessionParts: [ { speakers: undefined} ]
                        }
                    ]
                },
                dayStartTime: new Date("June 1, 2018 08:00:00"),
                dayEndTime: new Date("June 1, 2018 10:00:00"),
            },
            [SCHEDULE_VIEWS.FOR_STAFF.key]: {
                sessions: {
                    "Room 2": [
                        {
                            title: "Event 1.2",
                            startDateTime: "June 1, 2018 08:00:00",
                            endDateTime: "June 1, 2018 10:00:00",
                            roomNumber: "Room 2",
                            forDoctors: false,
                            forStaff: true,
                            speakers: [],
                            sessionParts: [ { speakers: undefined} ]
                        }
                    ]
                },
                dayStartTime: new Date("June 1, 2018 08:00:00"),
                dayEndTime: new Date("June 1, 2018 10:00:00"),
            }
        },
        [new Date("June 2, 2018 08:00:00").toDateString()]: {
            [SCHEDULE_VIEWS.FOR_DOCTORS.key]: {
                sessions: {
                    "Room 1": [
                        {
                            title: "Event 2.1",
                            startDateTime: "June 2, 2018 08:00:00",
                            endDateTime: "June 2, 2018 10:00:00",
                            roomNumber: "Room 1",
                            forDoctors: true,
                            forStaff: false,
                            speakers: [],
                            sessionParts: [ { speakers: undefined} ]
                        }
                    ],
                },
                dayStartTime: new Date("June 2, 2018 08:00:00"),
                dayEndTime: new Date("June 2, 2018 10:00:00"),
            },
            [SCHEDULE_VIEWS.FOR_STAFF.key]: {
                sessions: {
                    "Room 2": [
                        {
                            title: "Event 2.2",
                            startDateTime: "June 2, 2018 08:00:00",
                            endDateTime: "June 2, 2018 10:00:00",
                            roomNumber: "Room 2",
                            forDoctors: false,
                            forStaff: true,
                            speakers: [],
                            sessionParts: [ { speakers: undefined} ]
                        }
                    ],
                },
                dayStartTime: new Date("June 2, 2018 08:00:00"),
                dayEndTime: new Date("June 2, 2018 10:00:00"),
            }
        }
    }
};

let eventData_noSpeakerID = {
    event: {},
    related: {
        sessions: [
            {
                title: "Event 1.1",
                startDateTime: "June 1, 2018 08:00:00",
                endDateTime: "June 1, 2018 10:00:00",
                roomNumber: "Room 1",
                forDoctors: true,
                forStaff: false,
                sessionParts: [
                    {
                        speakers: [{
                            fullName: "Speaker 1.1"
                        }]
                    }
                ]
            },
            {
                title: "Event 1.2",
                startDateTime: "June 1, 2018 08:00:00",
                endDateTime: "June 1, 2018 10:00:00",
                roomNumber: "Room 2",
                forDoctors: false,
                forStaff: true,
                sessionParts: [
                    {
                        speakers: [{
                            fullName: "Speaker 1.2"
                        }]
                    }
                ]
            },
            {
                title: "Event 2.1",
                startDateTime: "June 2, 2018 08:00:00",
                endDateTime: "June 2, 2018 10:00:00",
                roomNumber: "Room 1",
                forDoctors: true,
                forStaff: false,
                sessionParts: [
                    {
                        speakers: [{
                            fullName: "Speaker 2.1"
                        }]
                    }
                ]
            },
            {
                title: "Event 2.2",
                startDateTime: "June 2, 2018 08:00:00",
                endDateTime: "June 2, 2018 10:00:00",
                roomNumber: "Room 2",
                forDoctors: false,
                forStaff: true,
                sessionParts: [
                    {
                        speakers: [{
                            fullName: "Speaker 2.2"
                        }]
                    }
                ]
            }
        ]
    }
};
let eventData_noSpeakerID_parsed = {
    eventDays: [
        new Date("June 1, 2018 08:00:00").toDateString(),
        new Date("June 2, 2018 08:00:00").toDateString(),
    ],
    parsedEventSessions: {
        [new Date("June 1, 2018 08:00:00").toDateString()]: {
            [SCHEDULE_VIEWS.FOR_DOCTORS.key]: {
                sessions: {
                    "Room 1": [
                        {
                            title: "Event 1.1",
                            startDateTime: "June 1, 2018 08:00:00",
                            endDateTime: "June 1, 2018 10:00:00",
                            roomNumber: "Room 1",
                            forDoctors: true,
                            forStaff: false,
                            speakers: [{ fullName: "Speaker 1.1" }],
                            sessionParts: [
                                {
                                    speakers: [
                                        { fullName: "Speaker 1.1" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                dayStartTime: new Date("June 1, 2018 08:00:00"),
                dayEndTime: new Date("June 1, 2018 10:00:00"),
            },
            [SCHEDULE_VIEWS.FOR_STAFF.key]: {
                sessions: {
                    "Room 2": [
                        {
                            title: "Event 1.2",
                            startDateTime: "June 1, 2018 08:00:00",
                            endDateTime: "June 1, 2018 10:00:00",
                            roomNumber: "Room 2",
                            forDoctors: false,
                            forStaff: true,
                            speakers: [{ fullName: "Speaker 1.2" }],
                            sessionParts: [
                                {
                                    speakers: [
                                        { fullName: "Speaker 1.2" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                dayStartTime: new Date("June 1, 2018 08:00:00"),
                dayEndTime: new Date("June 1, 2018 10:00:00"),
            }
        },
        [new Date("June 2, 2018 08:00:00").toDateString()]: {
            [SCHEDULE_VIEWS.FOR_DOCTORS.key]: {
                sessions: {
                    "Room 1": [
                        {
                            title: "Event 2.1",
                            startDateTime: "June 2, 2018 08:00:00",
                            endDateTime: "June 2, 2018 10:00:00",
                            roomNumber: "Room 1",
                            forDoctors: true,
                            forStaff: false,
                            speakers: [{ fullName: "Speaker 2.1" }],
                            sessionParts: [
                                {
                                    speakers: [
                                        { fullName: "Speaker 2.1" }
                                    ]
                                }
                            ]
                        }
                    ],
                },
                dayStartTime: new Date("June 2, 2018 08:00:00"),
                dayEndTime: new Date("June 2, 2018 10:00:00"),
            },
            [SCHEDULE_VIEWS.FOR_STAFF.key]: {
                sessions: {
                    "Room 2": [
                        {
                            title: "Event 2.2",
                            startDateTime: "June 2, 2018 08:00:00",
                            endDateTime: "June 2, 2018 10:00:00",
                            roomNumber: "Room 2",
                            forDoctors: false,
                            forStaff: true,
                            speakers: [{ fullName: "Speaker 2.2" }],
                            sessionParts: [
                                {
                                    speakers: [
                                        { fullName: "Speaker 2.2" }
                                    ]
                                }
                            ]
                        }
                    ],
                },
                dayStartTime: new Date("June 2, 2018 08:00:00"),
                dayEndTime: new Date("June 2, 2018 10:00:00"),
            }
        }
    }
};

let eventData_noViewKey = {
    event: {},
    related: {
        sessions: [
            {
                title: "Event 1.1",
                startDateTime: "June 1, 2018 08:00:00",
                endDateTime: "June 1, 2018 10:00:00",
                roomNumber: "Room 1",
                sessionParts: [
                    {
                        speakers: [{
                            fullName: "Speaker 1.1"
                        }]
                    }
                ]
            },
            {
                title: "Event 1.2",
                startDateTime: "June 1, 2018 08:00:00",
                endDateTime: "June 1, 2018 10:00:00",
                roomNumber: "Room 2",
                forDoctors: false,
                forStaff: true,
                sessionParts: [
                    {
                        speakers: [{
                            fullName: "Speaker 1.2"
                        }]
                    }
                ]
            },
            {
                title: "Event 2.1",
                startDateTime: "June 2, 2018 08:00:00",
                endDateTime: "June 2, 2018 10:00:00",
                roomNumber: "Room 1",
                forDoctors: true,
                forStaff: false,
                sessionParts: [
                    {
                        speakers: [{
                            fullName: "Speaker 2.1"
                        }]
                    }
                ]
            },
            {
                title: "Event 2.2",
                startDateTime: "June 2, 2018 08:00:00",
                endDateTime: "June 2, 2018 10:00:00",
                roomNumber: "Room 2",
                forDoctors: false,
                forStaff: true,
                sessionParts: [
                    {
                        speakers: [{
                            fullName: "Speaker 2.2"
                        }]
                    }
                ]
            }
        ]
    }
};
let eventData_noViewKey_parsed = {
    eventDays: [
        new Date("June 1, 2018 08:00:00").toDateString(),
        new Date("June 2, 2018 08:00:00").toDateString(),
    ],
    parsedEventSessions: {
        [new Date("June 1, 2018 08:00:00").toDateString()]: {
            [SCHEDULE_VIEWS.FOR_DOCTORS.key]: {
                sessions: {},
                dayStartTime: null,
                dayEndTime: null,
            },
            [SCHEDULE_VIEWS.FOR_STAFF.key]: {
                sessions: {
                    "Room 2": [
                        {
                            title: "Event 1.2",
                            startDateTime: "June 1, 2018 08:00:00",
                            endDateTime: "June 1, 2018 10:00:00",
                            roomNumber: "Room 2",
                            forDoctors: false,
                            forStaff: true,
                            speakers: [{ fullName: "Speaker 1.2" }],
                            sessionParts: [
                                {
                                    speakers: [
                                        { fullName: "Speaker 1.2" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                dayStartTime: new Date("June 1, 2018 08:00:00"),
                dayEndTime: new Date("June 1, 2018 10:00:00"),
            }
        },
        [new Date("June 2, 2018 08:00:00").toDateString()]: {
            [SCHEDULE_VIEWS.FOR_DOCTORS.key]: {
                sessions: {
                    "Room 1": [
                        {
                            title: "Event 2.1",
                            startDateTime: "June 2, 2018 08:00:00",
                            endDateTime: "June 2, 2018 10:00:00",
                            roomNumber: "Room 1",
                            forDoctors: true,
                            forStaff: false,
                            speakers: [{ fullName: "Speaker 2.1" }],
                            sessionParts: [
                                {
                                    speakers: [
                                        { fullName: "Speaker 2.1" }
                                    ]
                                }
                            ]
                        }
                    ],
                },
                dayStartTime: new Date("June 2, 2018 08:00:00"),
                dayEndTime: new Date("June 2, 2018 10:00:00"),
            },
            [SCHEDULE_VIEWS.FOR_STAFF.key]: {
                sessions: {
                    "Room 2": [
                        {
                            title: "Event 2.2",
                            startDateTime: "June 2, 2018 08:00:00",
                            endDateTime: "June 2, 2018 10:00:00",
                            roomNumber: "Room 2",
                            forDoctors: false,
                            forStaff: true,
                            speakers: [{ fullName: "Speaker 2.2" }],
                            sessionParts: [
                                {
                                    speakers: [
                                        { fullName: "Speaker 2.2" }
                                    ]
                                }
                            ]
                        }
                    ],
                },
                dayStartTime: new Date("June 2, 2018 08:00:00"),
                dayEndTime: new Date("June 2, 2018 10:00:00"),
            }
        }
    }
};

let eventData_noRoomNumber = {
    event: {},
    related: {
        sessions: [
            {
                title: "Event 1.1",
                startDateTime: "June 1, 2018 08:00:00",
                endDateTime: "June 1, 2018 10:00:00",
                forDoctors: true,
                forStaff: false,
                sessionParts: [
                    {
                        speakers: [{
                            fullName: "Speaker 1.1"
                        }]
                    }
                ]
            },
            {
                title: "Event 1.2",
                startDateTime: "June 1, 2018 08:00:00",
                endDateTime: "June 1, 2018 10:00:00",
                roomNumber: "Room 2",
                forDoctors: false,
                forStaff: true,
                sessionParts: [
                    {
                        speakers: [{
                            fullName: "Speaker 1.2"
                        }]
                    }
                ]
            },
            {
                title: "Event 2.1",
                startDateTime: "June 2, 2018 08:00:00",
                endDateTime: "June 2, 2018 10:00:00",
                roomNumber: "Room 1",
                forDoctors: true,
                forStaff: false,
                sessionParts: [
                    {
                        speakers: [{
                            fullName: "Speaker 2.1"
                        }]
                    }
                ]
            },
            {
                title: "Event 2.2",
                startDateTime: "June 2, 2018 08:00:00",
                endDateTime: "June 2, 2018 10:00:00",
                roomNumber: "Room 2",
                forDoctors: false,
                forStaff: true,
                sessionParts: [
                    {
                        speakers: [{
                            fullName: "Speaker 2.2"
                        }]
                    }
                ]
            }
        ]
    }
};
let eventData_noRoomNumber_parsed = {
    eventDays: [
        new Date("June 1, 2018 08:00:00").toDateString(),
        new Date("June 2, 2018 08:00:00").toDateString(),
    ],
    parsedEventSessions: {
        [new Date("June 1, 2018 08:00:00").toDateString()]: {
            [SCHEDULE_VIEWS.FOR_DOCTORS.key]: {
                sessions: {},
                dayStartTime: new Date("June 1, 2018 08:00:00"),
                dayEndTime: new Date("June 1, 2018 10:00:00"),
            },
            [SCHEDULE_VIEWS.FOR_STAFF.key]: {
                sessions: {
                    "Room 2": [
                        {
                            title: "Event 1.2",
                            startDateTime: "June 1, 2018 08:00:00",
                            endDateTime: "June 1, 2018 10:00:00",
                            roomNumber: "Room 2",
                            forDoctors: false,
                            forStaff: true,
                            speakers: [{ fullName: "Speaker 1.2" }],
                            sessionParts: [
                                {
                                    speakers: [
                                        { fullName: "Speaker 1.2" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                dayStartTime: new Date("June 1, 2018 08:00:00"),
                dayEndTime: new Date("June 1, 2018 10:00:00"),
            }
        },
        [new Date("June 2, 2018 08:00:00").toDateString()]: {
            [SCHEDULE_VIEWS.FOR_DOCTORS.key]: {
                sessions: {
                    "Room 1": [
                        {
                            title: "Event 2.1",
                            startDateTime: "June 2, 2018 08:00:00",
                            endDateTime: "June 2, 2018 10:00:00",
                            roomNumber: "Room 1",
                            forDoctors: true,
                            forStaff: false,
                            speakers: [{ fullName: "Speaker 2.1" }],
                            sessionParts: [
                                {
                                    speakers: [
                                        { fullName: "Speaker 2.1" }
                                    ]
                                }
                            ]
                        }
                    ],
                },
                dayStartTime: new Date("June 2, 2018 08:00:00"),
                dayEndTime: new Date("June 2, 2018 10:00:00"),
            },
            [SCHEDULE_VIEWS.FOR_STAFF.key]: {
                sessions: {
                    "Room 2": [
                        {
                            title: "Event 2.2",
                            startDateTime: "June 2, 2018 08:00:00",
                            endDateTime: "June 2, 2018 10:00:00",
                            roomNumber: "Room 2",
                            forDoctors: false,
                            forStaff: true,
                            speakers: [{ fullName: "Speaker 2.2" }],
                            sessionParts: [
                                {
                                    speakers: [
                                        { fullName: "Speaker 2.2" }
                                    ]
                                }
                            ]
                        }
                    ],
                },
                dayStartTime: new Date("June 2, 2018 08:00:00"),
                dayEndTime: new Date("June 2, 2018 10:00:00"),
            }
        }
    }
};

let eventData_duplicateSpeakers = {
    event: { id: "213800ffda91408c9266c28b954e95f6" },
    related: {
        sessions: [
            {
                title: "Event 1.1",
                startDateTime: "June 1, 2018 08:00:00",
                endDateTime: "June 1, 2018 10:00:00",
                roomNumber: "Room 1",
                forDoctors: true,
                forStaff: false,
                sessionParts: [
                    {
                        speakers: [
                            {
                                id: "400dbea167484031b7eff2ca71d42b0e",
                                fullName: "Speaker 1.1"
                            },
                            {
                                id: "400dbea167484031b7eff2ca71d42b0e",
                                fullName: "Speaker 1.1"
                            }
                        ]
                    }
                ]
            },
            {
                title: "Event 1.2",
                startDateTime: "June 1, 2018 08:00:00",
                endDateTime: "June 1, 2018 10:00:00",
                roomNumber: "Room 2",
                forDoctors: false,
                forStaff: true,
                sessionParts: [
                    {
                        speakers: [{
                            fullName: "Speaker 1.2"
                        }]
                    }
                ]
            },
            {
                title: "Event 2.1",
                startDateTime: "June 2, 2018 08:00:00",
                endDateTime: "June 2, 2018 10:00:00",
                roomNumber: "Room 1",
                forDoctors: true,
                forStaff: false,
                sessionParts: [
                    {
                        speakers: [{
                            fullName: "Speaker 2.1"
                        }]
                    }
                ]
            },
            {
                title: "Event 2.2",
                startDateTime: "June 2, 2018 08:00:00",
                endDateTime: "June 2, 2018 10:00:00",
                roomNumber: "Room 2",
                forDoctors: false,
                forStaff: true,
                sessionParts: [
                    {
                        speakers: [{
                            fullName: "Speaker 2.2"
                        }]
                    }
                ]
            }
        ]
    }
};
let eventData_duplicateSpeakers_parsed = {
    eventDays: [
        new Date("June 1, 2018 08:00:00").toDateString(),
        new Date("June 2, 2018 08:00:00").toDateString(),
    ],
    parsedEventSessions: {
        [new Date("June 1, 2018 08:00:00").toDateString()]: {
            [SCHEDULE_VIEWS.FOR_DOCTORS.key]: {
                sessions: {
                    "Room 1": [
                        {
                            title: "Event 1.1",
                            startDateTime: "June 1, 2018 08:00:00",
                            endDateTime: "June 1, 2018 10:00:00",
                            roomNumber: "Room 1",
                            forDoctors: true,
                            forStaff: false,
                            speakers: [{
                                firstName: "James",
                                fullName: "James A. McNamara DDS, PhD",
                                hasFinancialInterest: false,
                                id: "400dbea167484031b7eff2ca71d42b0e",
                                lastName: "McNamara",
                                pictureURL: "https://nf.aaoinfo.org/iweb/photos/4986.jpg",
                                prefix: "Dr.",
                                speakerBio: "Dr. Jim McNamara is the Thomas M. and Doris Graber Endowed Professor Emeritus in the Department of Orthodontics at the University of Michigan.  He was the recipient of the Albert H. Ketcham Memorial Award in 2008 and delivered the Jacob salzmann Memorial Award in 1992, the John V. Mershon Memorial Lecture in 2002 and the Edward H. Angle Lecture in 2014.  Dr. McNamara has published over 300 scientific articles, has written, edited or contributed to 78 books, has lectured in 43 countries and has treated over 13,000 patients.  He is past president of the Midwest Angle Society.\r\n",
                            }],
                            sessionParts: [
                                {
                                    speakers: [
                                        {
                                            id: "400dbea167484031b7eff2ca71d42b0e",
                                            fullName: "Speaker 1.1"
                                        },
                                        {
                                            id: "400dbea167484031b7eff2ca71d42b0e",
                                            fullName: "Speaker 1.1"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                dayStartTime: new Date("June 1, 2018 08:00:00"),
                dayEndTime: new Date("June 1, 2018 10:00:00"),
            },
            [SCHEDULE_VIEWS.FOR_STAFF.key]: {
                sessions: {
                    "Room 2": [
                        {
                            title: "Event 1.2",
                            startDateTime: "June 1, 2018 08:00:00",
                            endDateTime: "June 1, 2018 10:00:00",
                            roomNumber: "Room 2",
                            forDoctors: false,
                            forStaff: true,
                            speakers: [{ fullName: "Speaker 1.2" }],
                            sessionParts: [
                                {
                                    speakers: [
                                        { fullName: "Speaker 1.2" }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                dayStartTime: new Date("June 1, 2018 08:00:00"),
                dayEndTime: new Date("June 1, 2018 10:00:00"),
            }
        },
        [new Date("June 2, 2018 08:00:00").toDateString()]: {
            [SCHEDULE_VIEWS.FOR_DOCTORS.key]: {
                sessions: {
                    "Room 1": [
                        {
                            title: "Event 2.1",
                            startDateTime: "June 2, 2018 08:00:00",
                            endDateTime: "June 2, 2018 10:00:00",
                            roomNumber: "Room 1",
                            forDoctors: true,
                            forStaff: false,
                            speakers: [{ fullName: "Speaker 2.1" }],
                            sessionParts: [
                                {
                                    speakers: [
                                        { fullName: "Speaker 2.1" }
                                    ]
                                }
                            ]
                        }
                    ],
                },
                dayStartTime: new Date("June 2, 2018 08:00:00"),
                dayEndTime: new Date("June 2, 2018 10:00:00"),
            },
            [SCHEDULE_VIEWS.FOR_STAFF.key]: {
                sessions: {
                    "Room 2": [
                        {
                            title: "Event 2.2",
                            startDateTime: "June 2, 2018 08:00:00",
                            endDateTime: "June 2, 2018 10:00:00",
                            roomNumber: "Room 2",
                            forDoctors: false,
                            forStaff: true,
                            speakers: [{ fullName: "Speaker 2.2" }],
                            sessionParts: [
                                {
                                    speakers: [
                                        { fullName: "Speaker 2.2" }
                                    ]
                                }
                            ]
                        }
                    ],
                },
                dayStartTime: new Date("June 2, 2018 08:00:00"),
                dayEndTime: new Date("June 2, 2018 10:00:00"),
            }
        }
    }
};

let eventData_normal = {

};

describe("Parse event data", function() {

    describe("No eventData", function() {
        it("should return null when eventData is undefined", async function() {
            let result = await parseEventData(eventData_noEventData);
            assert.equal(result, null);
        });
    });

    describe("No eventData.event", function() {
        it("should return null when eventData.event is undefined", async function() {
            let result = await parseEventData(eventData_noEvent);
            assert.equal(result, null);
        });
    });

    describe("No eventData.related", function() {
        it("should return null when eventData.event.related is undefined", async function() {
            let result = await parseEventData(eventData_noRelated);
            assert.equal(result, null);
        });
    });

    describe("No eventData.related.sessions", function() {
        it("should return null when eventData.event.related.sessions is undefined", async function() {
            let result = await parseEventData(eventData_noSessions);
            assert.equal(result, null);
        });
    });

    describe("No eventData.related.sessions[i].sessionParts", function() {
        it("should return parsed data without extra speaker data for session i when eventData.related.sessions[i].sessionParts is undefined", async function() {
            let result = await parseEventData(eventData_noSessionParts);
            assert.deepEqual(result, eventData_noSessionParts_parsed);
        });
    });

    describe("No eventData.related.sessions[i].sessionParts[0].speakers", function() {
        it("should return parsed data without extra speaker data for session i when eventData.related.sessions[i].sessionParts[0].speakers is undefined", async function() {
            let result = await parseEventData(eventData_noSpeakers);
            assert.deepEqual(result, eventData_noSpeakers_parsed);
        });
    });

    describe("No speaker.id", function() {
        it("should return the parsed data without extra speaker data if speaker.id is undefined", async function() {
            let result = await parseEventData(eventData_noSpeakerID);
            assert.deepEqual(result, eventData_noSpeakerID_parsed);
        });
    });

    describe("No view key", function() {
        it("should throw out sessions without a view key", async function() {
            let result = await parseEventData(eventData_noViewKey);
            assert.deepEqual(result, eventData_noViewKey_parsed);
        });
    });

    describe("No room number", function() {
        it("should throw out sessions without a room number", async function() {
            let result = await parseEventData(eventData_noRoomNumber);
            assert.deepEqual(result, eventData_noRoomNumber_parsed);
        });
    });

    describe("Duplicate speakers", function() {
        it("should remove duplicate speakers from sessions[i].speakers", async function() {
            let result = await parseEventData(eventData_duplicateSpeakers, serverSideRequest=request);
            assert.deepEqual(result, eventData_duplicateSpeakers_parsed);
        });
    });

});
