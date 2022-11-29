import sinon from "sinon";
import { expect } from "chai";
import log from "../src/utils/logging.js";
import ServiceError from "../src/classes/ServiceError.js";
import * as UserService from "../src/services/user-service.js";
import pool from "../src/utils/database.js";

describe("Testing user service", () => {
    const fakeUser = {
        id: "e99bf9b122caaac6eb9b7ef4b438bf5e83eb2e1d3e",
        name: "Fake User",
        email: "encrypted_email@encrypted.com",
        password: "H@SH3D_p@ssw0rd",
        school: "Fake School",
        level_of_education: "Secondary 3",
        telegram: "telegram_fake",
        bio: "This is a test user therefore, I'm faked",
        referral: "Reddit"
    }

    before(() => {
        const fakeClient = { query: () => ({ rows: [] }), release: () => { } };

        sinon.stub(log);
        sinon.stub(pool, "connect").resolves(fakeClient);
    })

    after(async () => {
        sinon.restore();
    })

    describe("Creating user", () => {
        it("should not create user due to missing name", async () => {
            try {
                const res = await UserService.create({});
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-invalid-name");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not create user due to length (> 3)", async () => {
            try {
                const res = await UserService.create({
                    name: "d"
                });

                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-invalid-name");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not create user due to length (< 32)", async () => {
            try {
                const res = await UserService.create({
                    name: "d".repeat(33)
                });

                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-invalid-name");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not create user due to missing email", async () => {
            try {
                const res = await UserService.create({
                    name: fakeUser.name
                });

                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-invalid-email");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not create user due to missing password", async () => {
            try {
                const res = await UserService.create({
                    name: fakeUser.name,
                    email: fakeUser.email
                });

                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-weak-password");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not create user due to weak password", async () => {
            try {
                const res = await UserService.create({
                    name: fakeUser.name,
                    email: fakeUser.email,
                    password: "weak password"
                });

                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-weak-password");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not create user due to missing school", async () => {
            try {
                const res = await UserService.create({
                    name: fakeUser.name,
                    email: fakeUser.email,
                    password: fakeUser.password
                });

                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-no-school");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not create user due to missing education", async () => {
            try {
                const res = await UserService.create({
                    name: fakeUser.name,
                    email: fakeUser.email,
                    password: fakeUser.password,
                    school: fakeUser.school
                });

                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-invalid-education");

                expect(err.code).to.equal(expectedError.code);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })


        it("should not create user due to invalid education stream, etc.", async () => {
            try {
                const res = await UserService.create({
                    name: fakeUser.name,
                    email: fakeUser.email,
                    password: fakeUser.password,
                    school: fakeUser.school,
                    level_of_education: "Invalid"
                });

                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-invalid-education");

                expect(err.code).to.equal(expectedError.code);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not create user due to missing Telegram handle", async () => {
            try {
                const res = await UserService.create({
                    name: fakeUser.name,
                    email: fakeUser.email,
                    password: fakeUser.password,
                    school: fakeUser.school,
                    level_of_education: fakeUser.level_of_education
                });

                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-no-telegram");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not create user due to invalid Telegram handle (length < 5)", async () => {
            try {
                const res = await UserService.create({
                    name: fakeUser.name,
                    email: fakeUser.email,
                    password: fakeUser.password,
                    school: fakeUser.school,
                    level_of_education: fakeUser.level_of_education,
                    telegram: "ddd"
                });

                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-no-telegram");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not create user due to invalid Telegram handle (length > 32)", async () => {
            try {
                const res = await UserService.create({
                    name: fakeUser.name,
                    email: fakeUser.email,
                    password: fakeUser.password,
                    school: fakeUser.school,
                    level_of_education: fakeUser.level_of_education,
                    telegram: "d".repeat(33)
                });

                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-no-telegram");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not create user due to invalid bio length", async () => {
            try {
                const res = await UserService.create({
                    name: fakeUser.name,
                    email: fakeUser.email,
                    password: fakeUser.password,
                    school: fakeUser.school,
                    level_of_education: fakeUser.level_of_education,
                    telegram: fakeUser.telegram,
                    bio: "d".repeat(501)
                });

                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-invalid-bio");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should create user", async () => {
            try {
                await UserService.create(fakeUser);
            } catch (err) {
                expect(err).to.be.undefined();
            }
        })
    })

    describe("User login", () => {
        it("should not login as missing email parameter", async () => {
            try {
                const res = await UserService.login()
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-login-invalid");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not login as missing password parameter", async () => {
            try {
                const res = await UserService.login(fakeUser.email);
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-login-invalid");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not login as user does not exist", async () => {
            try {
                const res = await UserService.login("fake_email@email.com", fakeUser.password);
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-login-failed");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not login due to wrong password", async () => {
            try {
                const res = await UserService.login(fakeUser.email, fakeUser.password);
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-login-failed");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })
    })

    describe("User update", () => {
        it("should not update user name due to missing parameters", async () => {
            try {
                const res = await UserService.update(fakeUser.id);
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-invalid");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not update user name due to missing update attributes", async () => {
            try {
                const newAttributes = {}

                const res = await UserService.update(fakeUser.id, newAttributes);
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-invalid");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not update user name due to length (> 3)", async () => {
            try {
                const newAttributes = { name: "d" }

                const res = await UserService.update(fakeUser.id, newAttributes);
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-invalid-name");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not update user name due to length (< 32)", async () => {
            try {
                const newAttributes = { name: "d".repeat(33) }

                const res = await UserService.update(fakeUser.id, newAttributes);
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-invalid-name");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not update user name due to invalid education stream", async () => {
            try {
                const newAttributes = {
                    name: "New Fake User Name",
                    school: "New Fake School",
                    level_of_education: "Invalid"
                }

                const res = await UserService.update(fakeUser.id, newAttributes);
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-invalid-education");

                expect(err.code).to.equal(expectedError.code);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not create user due to invalid Telegram handle (length < 5)", async () => {
            try {
                const newAttributes = {
                    name: "New Fake User Name",
                    school: "New Fake School",
                    level_of_education: "Secondary 4",
                    telegram: "ddd"
                }

                const res = await UserService.update(fakeUser.id, newAttributes);
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-no-telegram");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not create user due to invalid Telegram handle (length < 32)", async () => {
            try {
                const newAttributes = {
                    name: "New Fake User Name",
                    school: "New Fake School",
                    level_of_education: "Secondary 4",
                    telegram: "d".repeat(33)
                }

                const res = await UserService.update(fakeUser.id, newAttributes);
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-no-telegram");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should not create user due to invalid bio length", async () => {
            try {
                const newAttributes = {
                    name: "New Fake User Name",
                    school: "New Fake School",
                    level_of_education: "Secondary 4",
                    telegram: "new_telegram_fake",
                    bio: "d".repeat(501)
                }

                const res = await UserService.update(fakeUser.id, newAttributes);
                expect(res).to.be.undefined();
            } catch (err) {
                const expectedError = new ServiceError("user-invalid-bio");

                expect(err.code).to.equal(expectedError.code);
                expect(err.details).to.equal(expectedError.details);
                expect(err.message).to.equal(expectedError.message);
                expect(err.status).to.equal(expectedError.status);
            }
        })

        it("should update user attributes", async () => {
            try {
                const newAttributes = {
                    name: "New Fake User Name",
                    school: "New Fake School",
                    level_of_education: "Secondary 4",
                    telegram: "new_telegram_fake",
                    bio: "New user bio"
                }

                await UserService.update(fakeUser.id, newAttributes);
            } catch (err) {
                expect(err).to.be.undefined();
            }
        })
    })
})