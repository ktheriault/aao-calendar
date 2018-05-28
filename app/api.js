// jquery only works on client side, so tests can pass in another request function to API calls
let $ = require("jquery");

const EVENT_ID = "213800ffda91408c9266c28b954e95f6";
module.exports.EVENT_ID = EVENT_ID;

const SCHEDULE_VIEWS = {
    FOR_DOCTORS: {
        key: "forDoctors",
        title: "For Doctors",
    },
    FOR_STAFF: {
        key:"forStaff",
        title: "For Staff"
    },
};
module.exports.SCHEDULE_VIEWS = SCHEDULE_VIEWS;

const baseURL = "http://nf.aaoinfo.org/mapi/api";
const eventEndpoint = "events";
const speakerEndpoint = "speakers";

async function getEventByID(
    eventID,
    includeSponsors=false,
    includeSpeakers=false,
    includeSessions=false,
    includeExhibitors=false,
    includeExhibitorInfo=false,
    serverSideRequest=null,
) {
    let url = `${baseURL}/${eventEndpoint}/${eventID}`;
    if (includeSponsors || includeSpeakers || includeSessions || includeExhibitors || includeExhibitorInfo) {
        url += "?Include=";
        if (includeSponsors) {
            // 500 error
            url += "Sponsors%2C";
        }
        if (includeSpeakers) {
            url += "Speakers%2C";
        }
        if (includeSessions) {
            url += "Sessions%2C";
        }
        if (includeExhibitors) {
            url += "Exhibitors%2C";
        }
        if (includeExhibitorInfo) {
            url += "ExhibitorInfo%2C";
        }
    }
    let response;
    if (serverSideRequest) {
        let options = {
            uri: url,
            json: true,
        };
        response = await serverSideRequest(options);
    } else {
        response = await $.ajax({
            type: "GET",
            url: url,
        });
    }
    return response ? response : null;
}
module.exports.getEventByID = getEventByID;


async function getSpeakerForEvent(eventID, speakerID, serverSideRequest=null) {
    let url = `${baseURL}/${eventEndpoint}/${eventID}/${speakerEndpoint}/${speakerID}`;
    let response;
    if (serverSideRequest) {
        let options = {
            uri: url,
            json: true,
        };
        response = await serverSideRequest(options);
    } else {
        response = await $.ajax({
            type: "GET",
            url: url,
        });
    }
    return response && response.speaker ? response.speaker : null;
}

async function parseEventData(eventData, serverSideRequest=null) {

    if (!eventData || !eventData.event || !eventData.related || !eventData.related.sessions) {
        return null;
    }

    let eventSessions = eventData.related.sessions.length > 0 ? eventData.related.sessions : null;
    if (!eventSessions) {
        return null;
    }

    let eventID = eventData.event.id;
    let eventSessionsByDay = {};
    await Promise.all(eventSessions.map(async (session) => {
        let { speakers } = session.sessionParts && session.sessionParts.length > 0 ? session.sessionParts[0] : { speakers: [] };
        if (!speakers) {
            speakers = [];
        }
        let speakerIDs = speakers.map(speaker => speaker.id);
        let dedupedSpeakers = speakers.filter((speaker, i) => {
            return speakerIDs.indexOf(speaker.id) === i;
        });
        let speakersWithSpeakerData = await Promise.all(dedupedSpeakers.map(async (speaker) => {
            let speakerID = speaker.id;
            let speakerData = speakerID ? await getSpeakerForEvent(eventID, speakerID, serverSideRequest) : null;
            return speakerData ? {
                id: speakerID,
                firstName: speakerData.firstName,
                lastName: speakerData.lastName,
                prefix: speakerData.prefix,
                fullName: speakerData.fullName,
                hasFinancialInterest: speakerData.hasFinancialInterest,
                speakerBio: speakerData.speakerBio,
                pictureURL: speakerData.pictureUrl,
            } : speaker;
        }));
        let sessionWithSpeakerData = {
            ...session,
            speakers: speakersWithSpeakerData,
        };

        let startDay = (new Date(session.startDateTime)).toDateString();
        if (eventSessionsByDay[startDay]) {
            eventSessionsByDay[startDay] = [
                ...eventSessionsByDay[startDay],
                sessionWithSpeakerData,
            ];
        } else {
            eventSessionsByDay[startDay] = [
                sessionWithSpeakerData,
            ];
        }
    }));

    let eventSessionsByDayAndViewKey = {};
    Object.keys(eventSessionsByDay).map((startDay) => {
        eventSessionsByDayAndViewKey[startDay] = {};
        let sessionsForDay = eventSessionsByDay[startDay];
        Object.keys(SCHEDULE_VIEWS).forEach((view) => {
            let viewKey = SCHEDULE_VIEWS[view].key;
            let sessionsForDayAndView = sessionsForDay.filter((session) => {
                return session[viewKey];
            });

            if (sessionsForDayAndView.length < 1) {
                eventSessionsByDayAndViewKey[startDay][viewKey] = {};
                eventSessionsByDayAndViewKey[startDay][viewKey].sessions = {};
                eventSessionsByDayAndViewKey[startDay][viewKey].dayStartTime = null;
                eventSessionsByDayAndViewKey[startDay][viewKey].dayEndTime = null;
                return;
            }

            let dayStartTime = new Date(sessionsForDayAndView[0].startDateTime);
            let dayEndTime = new Date(sessionsForDayAndView[0].endDateTime);

            let sessionsByRoom = {};
            sessionsForDayAndView.forEach((session) => {
                let roomName = session.roomNumber;
                if (!roomName) {
                    return;
                }
                if (sessionsByRoom[roomName]) {
                    sessionsByRoom[roomName] = [
                        ...sessionsByRoom[roomName],
                        session,
                    ];
                } else {
                    sessionsByRoom[roomName] = [
                        session
                    ];
                }

                let startTime = new Date(session.startDateTime);
                let endTime = new Date(session.endDateTime);
                if (startTime < dayStartTime) {
                    dayStartTime = startTime;
                }
                if (endTime > dayEndTime) {
                    dayEndTime = endTime;
                }

            });

            if (dayStartTime.getMinutes() !== 0) {
                dayStartTime.setMinutes(0);
            }
            if (dayEndTime.getMinutes() !== 0) {
                dayEndTime.setHours(dayEndTime.getHours() + 1);
                dayEndTime.setMinutes(0);
            }

            eventSessionsByDayAndViewKey[startDay][viewKey] = {};
            eventSessionsByDayAndViewKey[startDay][viewKey].sessions = sessionsByRoom;
            eventSessionsByDayAndViewKey[startDay][viewKey].dayStartTime = dayStartTime;
            eventSessionsByDayAndViewKey[startDay][viewKey].dayEndTime = dayEndTime;
        });
    });


    let eventDays = Object.keys(eventSessionsByDay).map((eventDayString) => {
        return Date.parse(eventDayString);
    });
    eventDays.sort();
    eventDays = eventDays.map((eventMsString) => {
        return (new Date(eventMsString)).toDateString();
    });

    return {
        eventDays,
        parsedEventSessions: eventSessionsByDayAndViewKey,
    };

}
module.exports.parseEventData = parseEventData;

// https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/
const getContent = function(url) {
    // return new pending promise
    return new Promise((resolve, reject) => {
        // select http or https module, depending on reqested url
        const lib = url.startsWith('https') ? require('https') : require('http');
        const request = lib.get(url, (response) => {
            // handle http errors
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load page, status code: ' + response.statusCode));
            }
            // temporary data holder
            const body = [];
            // on every content chunk, push it to the data array
            response.on('data', (chunk) => body.push(chunk));
            // we are done, resolve promise with those joined chunks
            response.on('end', () => resolve(body.join('')));
        });
        // handle connection errors of the request
        request.on('error', (err) => reject(err))
    })
};