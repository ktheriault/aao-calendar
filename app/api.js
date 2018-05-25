import $ from "jquery";
import { SCHEDULE_VIEWS } from "./global";

const baseURL = "http://nf.aaoinfo.org/mapi/api";
const eventEndpoint = "events";
const speakerEndpoint = "speakers";

export async function getEventByID(
    eventID,
    includeSponsors=false,
    includeSpeakers=false,
    includeSessions=false,
    includeExhibitors=false,
    includeExhibitorInfo=false
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
    let response = await $.ajax({
        type: "GET",
        url: url,
    });
    return response ? response : null;
}

async function getSpeakerForEvent(eventID, speakerID) {
    let url = `${baseURL}/${eventEndpoint}/${eventID}/${speakerEndpoint}/${speakerID}`;
    let response = await $.ajax({
        type: "GET",
        url: url,
    });
    return response && response.speaker ? response.speaker : null;
}

export async function parseEventData(eventData) {

    if (!eventData || !eventData.event || !eventData.related || !eventData.related.sessions || !eventData.related.speakers) {
        return null;
    }

    let eventID = eventData.event.id;

    let eventSessions = eventData && eventData.related ? eventData.related.sessions : null;
    let eventSessionsByDay = {};
    await Promise.all(eventSessions.map(async (session) => {
        let { speakers } = session.sessionParts[0];
        let speakerIDs = speakers.map(speaker => speaker.id);
        let dedupedSpeakers = speakers.filter((speaker, i) => {
            return speakerIDs.indexOf(speaker.id) === i;
        });
        let speakersWithSpeakerData = await Promise.all(dedupedSpeakers.map(async (speaker) => {
            let speakerID = speaker.id;
            let speakerData = await getSpeakerForEvent(eventID, speakerID);
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

            let dayStartTime = new Date(sessionsForDayAndView[0].startDateTime);
            let dayEndTime = new Date(sessionsForDayAndView[0].endDateTime);

            let sessionsByRoom = {};
            sessionsForDayAndView.forEach((session) => {
                let roomName = session.roomNumber;
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
