import $ from "jquery";

const baseURL = "http://nf.aaoinfo.org/mapi/api/";
const eventEndpoint = "events";
const sessionEndpoint = "sessions";

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

export async function getEventByIDWithSessions(eventID) {
    let url = `${baseURL}/${eventEndpoint}/${eventID}/${sessionEndpoint}`;
    let response = await $.ajax({
        type: "GET",
        url: url,
    });
    return response && response.sessions ? response.sessions : null;
}