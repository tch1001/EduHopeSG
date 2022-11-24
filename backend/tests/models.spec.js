import sinon from "sinon";
import { expect } from "chai";
import log from "../src/utils/logging.js";
import { setup as setupDatabase, query } from "../src/utils/database.js";

describe("Testing database models", () => {
    const fakeUser = {
        id: "e99bf9b122caaac6eb9b7ef4b438bf5e83eb2e1d3e",
        name: "Fake User",
        email: "encrypted_email@encrypted.com",
        password: "hashed_password",
        school: "Fake School",
        level_of_education: "Secondary 3",
        telegram: "telegram_fake",
        bio: "This is a test user therefore, I'm faked",
        referral: "Reddit"
    }

    before(() => {
        setupDatabase();
        sinon.stub(log);
    })

    after(async () => {
        // delete fake user
        await query("DELETE FROM eduhope_user WHERE name = 'Fake User'");
        sinon.restore();
    })

    describe("Testing EduHope User model constraints", () => {
        it("should not accept due to missing name", (done) => {
            const queryText = "INSERT INTO eduhope_user(name) VALUES ($1)";
            const queryValues = [null];

            query(queryText, queryValues)
                .then(() => done(new Error("Unexpected success")))
                .catch((err) => {
                    expect(err.schema).to.equal("public");
                    expect(err.table).to.equal("eduhope_user");
                    expect(err.column).to.equal("name");
                    expect(err.routine).to.equal("ExecConstraints");

                    done()
                });
        })

        it("should not accept due to missing email", (done) => {
            const queryText = "INSERT INTO eduhope_user(name, email) VALUES ($1, $2)";
            const queryValues = [fakeUser.name, null];

            query(queryText, queryValues)
                .then(() => done(new Error("Unexpected success")))
                .catch((err) => {
                    expect(err.schema).to.equal("public");
                    expect(err.table).to.equal("eduhope_user");
                    expect(err.column).to.equal("email");
                    expect(err.routine).to.equal("ExecConstraints");

                    done()
                });
        })

        it("should not accept due to missing password", (done) => {
            const queryText = `INSERT INTO eduhope_user(name, email, password) VALUES ($1, $2, $3)`;
            const queryValues = [fakeUser.name, fakeUser.email, null];

            query(queryText, queryValues)
                .then(() => done(new Error("Unexpected success")))
                .catch((err) => {
                    expect(err.schema).to.equal("public");
                    expect(err.table).to.equal("eduhope_user");
                    expect(err.column).to.equal("password");
                    expect(err.routine).to.equal("ExecConstraints");

                    done()
                });
        })

        it("should not accept due to missing school", (done) => {
            const queryText = `
                INSERT INTO eduhope_user(name, email, password, school)
                VALUES ($1, $2, $3, $4)
            `;

            const queryValues = [fakeUser.name, fakeUser.email, fakeUser.password, null];

            query(queryText, queryValues)
                .then(() => done(new Error("Unexpected success")))
                .catch((err) => {
                    expect(err.schema).to.equal("public");
                    expect(err.table).to.equal("eduhope_user");
                    expect(err.column).to.equal("school");
                    expect(err.routine).to.equal("ExecConstraints");

                    done()
                });
        })

        it("should not accept due to missing education", (done) => {
            const queryText = `
                INSERT INTO eduhope_user(name, email, password, school, level_of_education)
                VALUES ($1, $2, $3, $4, $5)
            `;

            const queryValues = [
                fakeUser.name, fakeUser.email, fakeUser.password, fakeUser.school, null
            ];

            query(queryText, queryValues)
                .then(() => done(new Error("Unexpected success")))
                .catch((err) => {
                    expect(err.schema).to.equal("public");
                    expect(err.table).to.equal("eduhope_user");
                    expect(err.column).to.equal("level_of_education");
                    expect(err.routine).to.equal("ExecConstraints");

                    done()
                });
        })

        it("should not accept due to missing telegram", (done) => {
            const queryText = `
                INSERT INTO eduhope_user(name, email, password, school, level_of_education, telegram)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;

            const queryValues = [
                fakeUser.name, fakeUser.email, fakeUser.password, fakeUser.school,
                fakeUser.level_of_education, null
            ];

            query(queryText, queryValues)
                .then(() => done(new Error("Unexpected success")))
                .catch((err) => {
                    expect(err.schema).to.equal("public");
                    expect(err.table).to.equal("eduhope_user");
                    expect(err.column).to.equal("telegram");
                    expect(err.routine).to.equal("ExecConstraints");

                    done()
                });
        })

        it("should accept username length", (done) => {
            const queryText = `
                INSERT INTO eduhope_user(name, email, password, school, level_of_education, telegram)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;

            const queryValues = [
                fakeUser.name, fakeUser.email, fakeUser.password, fakeUser.school,
                fakeUser.level_of_education, fakeUser.telegram
            ];

            query(queryText, queryValues)
                .then((result) => {
                    expect(result.command).to.equal("INSERT");
                    expect(result.rowCount).to.equal(1);

                    done();
                })
                .catch(done);
        })

        it("should not accept username length below 3 characters", (done) => {
            const queryText = `
                INSERT INTO eduhope_user(name, email, password, school, level_of_education, telegram)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;

            const queryValues = [
                "", fakeUser.email, fakeUser.password, fakeUser.school,
                fakeUser.level_of_education, fakeUser.telegram
            ];

            query(queryText, queryValues)
                .then(() => done(new Error("Unexpected success")))
                .catch((err) => {
                    expect(err.schema).to.equal("public");
                    expect(err.table).to.equal("eduhope_user");
                    expect(err.constraint).to.equal("eduhope_user_name_check");
                    expect(err.routine).to.equal("ExecConstraints");

                    done()
                });
        })
    })
})