import $ from "jquery";

const baseURL = "http://nf.aaoinfo.org/mapi/api/";
const eventEndpoint = "events";
const speakerEndpoint = "speakers";

export async function getEventList() {
    let url = `${baseURL}/${eventEndpoint}`;
    let response = await $.ajax({
        type: "GET",
        url: url,
    });
    return response ? response : null;
}

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

    let eventInfo = eventData.event ? {
        ...eventData.event,
        startDate: new Date(Date.parse(eventData.event.startDate)),
        endDate: new Date(Date.parse(eventData.event.endDate))
    } : null;

    let eventSessions = eventData && eventData.related ? eventData.related.sessions : null;
    let eventSessionsByDay = {};
    await Promise.all(eventSessions.map(async (session, i) => {
        let { speakers } = session.sessionParts[0];
        let speakersWithSpeakerData = await Promise.all(speakers.map(async (speaker) => {
            let speakerID = speaker.id;
            let speakerData = await getSpeakerForEvent(eventID, speakerID);
            return speakerData ? {
                id: speakerID,
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

        let startDay = (new Date(Date.parse(session.startDateTime))).toDateString();
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
    let eventDays = Object.keys(eventSessionsByDay).map((eventDayString) => {
        return Date.parse(eventDayString);
    });
    eventDays.sort();
    eventDays = eventDays.map((eventMsString) => {
        return (new Date(eventMsString)).toDateString();
    });

    return {
        eventInfo,
        eventDays,
        eventSessions,
        eventSessionsByDay,
    };

}
