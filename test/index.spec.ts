import chai from "chai";
const expect = chai.expect;

import message from "../src/index";

describe("Valid test case", () => {
    let expectedMessage = "Test: dSafe is going make Safe and fee";
    it("Should return correct message", () => {
        expect(message).to.equal(expectedMessage);
    })
})
