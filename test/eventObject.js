let assert = require("assert");
let parseEventData = require("../app/api").parseEventData;

let eventData_empty = {};

let eventData_emptyEvent = {
    event: {}
};

describe("Parse event data", function() {
    describe("Empty eventData", function() {
        it("should return null when eventData is empty", async function() {
            let result = await parseEventData(eventData_empty);
            assert.equal(result, null);
        });
    });
    describe("Empty eventData.event", async function() {
        it("should return null when eventData has empty event", async function() {
            let result = await parseEventData(eventData_emptyEvent);
            assert.equal(result, null);
        });
    });
});