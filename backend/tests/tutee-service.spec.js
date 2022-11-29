import sinon from "sinon";
import { expect } from "chai";
import log from "../src/utils/logging.js";
import pool from "../src/utils/database.js";
import parseSQL from "../src/utils/sql-parser.js"
import ServiceError from "../src/classes/ServiceError.js";
import * as TuteeService from "../src/services/tutee-service.js";

describe("Testing tutee service", () => {
    const fakeTutee = {
        id: "e99bf9b122caaac6eb9b7ef4b438bf5e83eb2e1d3e",
        name: "Fake Tutee",
        email: "tutee@encrypted.com",
        password: "H@SH3D_p@ssw0rd as tutee",
        school: "Fake Secondary School",
        level_of_education: "Secondary 3",
        telegram: "my_tutee",
        bio: "This is a test tutee therefore, I'm faked",
        referral: "Reddit"
    }

    const fakeTutor = {
        id: "e99bf9b122caaac6eb9b7ef4b438bf5e83eb2e1d4e",
        name: "Fake Tutor",
        email: "tutor@encrypted.com",
        password: "H@SH3D_p@ssw0rd as tutor",
        school: "Fake Collage",
        level_of_education: "JC 2",
        telegram: "my_tutor",
        bio: "This is a test tutor therefore, I'm faked",
        referral: "Discord",
        is_tutor: true,
        tutoring: ['N', 'O'],
        subjects: [1, 2, 3],
        tutee_limit: 3,
        commitment_end: new Date(Date.now() + (60 ** 2) * 24 * 30.5 * 10 * 1000) // 10 months
    }

    const validSubjects = fakeTutor.subjects;
    const invalidSubjects = [...fakeTutor.subjects, 10];

    before(() => {
        function fakeQuery(query, values) {

            if (!values) {
                values = query?.values;
                query = query?.text;
            }

            if (!query || !values) return { rows: [] };

            const eduhope_users = [fakeTutee, fakeTutor];
            const parsed = parseSQL(query, values);

            // fake DB lol
            if (parsed.operation === "SELECT" && parsed.table === "eduhope_user") {
                const result = eduhope_users.find(user => {
                    const conditionsMet = parsed.conditions.every(condition => {
                        const [field, value] = condition.split(" = ");
                        return user[field] === value;
                    })

                    return conditionsMet;
                })

                return { rows: [result] }
            }
            if (parsed.operation === "SELECT" && parsed.table === "tutee_tutor_relationship") {
                if (parsed.fields[0].startsWith("count")) return { rows: [{ count: '0' }] };
            }

            return { rows: [] }
        }

        const fakeClient = { query: fakeQuery, release: () => { } };

        sinon.stub(log);
        sinon.stub(pool, "connect").resolves(fakeClient);
    })

    after(async () => {
        sinon.restore();
    })

    describe("Request tutor", () => {
        it("should not request due to missing parameters", async () => {
            try {
                const res = await TuteeService.requestTutor();
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-request-tutor-missing");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not request due to missing subjects", async () => {
            try {
                const res = await TuteeService.requestTutor(fakeTutee.id, fakeTutee.id, []);
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-request-tutor-missing");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not request due same user", async () => {
            try {
                const res = await TuteeService.requestTutor(fakeTutee.id, fakeTutee.id, validSubjects);
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("tutee-tutor-same");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not request due to tutee not found", async () => {
            try {
                const res = await TuteeService.requestTutor("not found", fakeTutor.id, validSubjects);
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("tutee-tutor-not-found");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not request due to tutor not found", async () => {
            try {
                const res = await TuteeService.requestTutor(fakeTutee.id, "not found", validSubjects);
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("tutee-tutor-not-found");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not request due to user not being a tutor", async () => {
            try {
                const res = await TuteeService.requestTutor(fakeTutor.id, fakeTutee.id, validSubjects);
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-not-tutor");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not request due to tutor not offering subject", async () => {
            try {
                const res = await TuteeService.requestTutor(fakeTutee.id, fakeTutor.id, invalidSubjects);
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("tutee-tutor-subject-unoffered");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should request tutor", async () => {
            try {
                const res = await TuteeService.requestTutor(fakeTutee.id, fakeTutor.id, validSubjects);
                expect(res.success).to.be.true;
                expect(res.message).to.be.equal("Request for tuition sent to tutor");
            } catch (err) {
                expect(err).to.be.undefined();
            }
        })
    })

    describe("withdraw from tutor", () => {
        const RELATIONSHIP_ID = `${fakeTutee.id}:${fakeTutor.id}`;

        it("should not withdraw due to missing parameters", async () => {
            try {
                const res = await TuteeService.withdrawTutor();
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("invalid-tutee-tutor-relationship");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not withdraw due to relationship not found", async () => {
            try {
                const res = await TuteeService.withdrawTutor(RELATIONSHIP_ID);
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("invalid-tutee-tutor-relationship");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })
    })
});