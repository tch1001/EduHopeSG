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

    describe("Testing SQL Setup", () => {
        it("should fail when no SQL file is found", () => {
            setupDatabase("./not-found.sql", (err) => {
                expect(err.errno).to.equal(-4058);
                expect(err.code).to.equal("ENOENT");
                expect(err.syscall).to.equal("open");
            });
        })
    })

    describe("Testing EduHope User model constraints", () => {
        it("should not accept due to missing name", async () => {
            const queryText = "INSERT INTO eduhope_user(name) VALUES ($1)";
            const queryValues = [null];

            try {
                await query(queryText, queryValues)
            } catch (err) {
                expect(err.schema).to.equal("public");
                expect(err.table).to.equal("eduhope_user");
                expect(err.column).to.equal("name");
                expect(err.routine).to.equal("ExecConstraints");
            }
        })

        it("should not accept due to missing email", async () => {
            const queryText = "INSERT INTO eduhope_user(name, email) VALUES ($1, $2)";
            const queryValues = [fakeUser.name, null];

            try {
                await query(queryText, queryValues)
            } catch (err) {
                expect(err.schema).to.equal("public");
                expect(err.table).to.equal("eduhope_user");
                expect(err.column).to.equal("email");
                expect(err.routine).to.equal("ExecConstraints");
            }
        })

        it("should not accept due to missing password", async () => {
            const queryText = `INSERT INTO eduhope_user(name, email, password) VALUES ($1, $2, $3)`;
            const queryValues = [fakeUser.name, fakeUser.email, null];

            try {
                await query(queryText, queryValues)
            } catch (err) {
                expect(err.schema).to.equal("public");
                expect(err.table).to.equal("eduhope_user");
                expect(err.column).to.equal("password");
                expect(err.routine).to.equal("ExecConstraints");
            }
        })

        it("should not accept due to missing school", async () => {
            const queryText = `
                INSERT INTO eduhope_user(name, email, password, school)
                VALUES ($1, $2, $3, $4)
            `;

            const queryValues = [fakeUser.name, fakeUser.email, fakeUser.password, null];

            try {
                await query(queryText, queryValues)
            } catch (err) {
                expect(err.schema).to.equal("public");
                expect(err.table).to.equal("eduhope_user");
                expect(err.column).to.equal("school");
                expect(err.routine).to.equal("ExecConstraints");
            }
        })

        it("should not accept due to missing education", async () => {
            const queryText = `
                INSERT INTO eduhope_user(name, email, password, school, level_of_education)
                VALUES ($1, $2, $3, $4, $5)
            `;

            const queryValues = [
                fakeUser.name, fakeUser.email, fakeUser.password, fakeUser.school, null
            ];

            try {
                await query(queryText, queryValues)
            } catch (err) {
                expect(err.schema).to.equal("public");
                expect(err.table).to.equal("eduhope_user");
                expect(err.column).to.equal("level_of_education");
                expect(err.routine).to.equal("ExecConstraints");
            }
        })

        it("should not accept due to missing telegram", async () => {
            const queryText = `
                INSERT INTO eduhope_user(name, email, password, school, level_of_education, telegram)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;

            const queryValues = [
                fakeUser.name, fakeUser.email, fakeUser.password, fakeUser.school,
                fakeUser.level_of_education, null
            ];

            try {
                await query(queryText, queryValues)
            } catch (err) {
                expect(err.schema).to.equal("public");
                expect(err.table).to.equal("eduhope_user");
                expect(err.column).to.equal("telegram");
                expect(err.routine).to.equal("ExecConstraints");
            }
        })

        it("should accept username length", async () => {
            const queryText = `
                INSERT INTO eduhope_user(name, email, password, school, level_of_education, telegram)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;

            const queryValues = [
                fakeUser.name, fakeUser.email, fakeUser.password, fakeUser.school,
                fakeUser.level_of_education, fakeUser.telegram
            ];

            try {
                await query(queryText, queryValues)
            } catch (err) {
                expect(result.command).to.equal("INSERT");
                expect(result.rowCount).to.equal(1);
            }
        })

        it("should not accept username length below 3 characters", async () => {
            const queryText = `
                INSERT INTO eduhope_user(name, email, password, school, level_of_education, telegram)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;

            const queryValues = [
                "", fakeUser.email, fakeUser.password, fakeUser.school,
                fakeUser.level_of_education, fakeUser.telegram
            ];

            try {
                await query(queryText, queryValues);
            } catch (err) {
                expect(err.schema).to.equal("public");
                expect(err.table).to.equal("eduhope_user");
                expect(err.constraint).to.equal("eduhope_user_name_check");
                expect(err.routine).to.equal("ExecConstraints");
            }
        })
    })

    describe("Testing Tutee-Tutor model constraints", () => {
        it("should not accept due to missing tutee ID", async () => {
            const queryText = `
                    INSERT INTO tutee_tutor_relationship(tutee_id)
                    VALUES ($1)
                `;

            const queryValues = [null];

            try {
                await query(queryText, queryValues);
            } catch (err) {
                expect(err.schema).to.equal("public");
                expect(err.table).to.equal("tutee_tutor_relationship");
                expect(err.column).to.equal("id");
                expect(err.routine).to.equal("ExecConstraints");
            }
        })

        it("should not accept due to missing tutee ID", async () => {
            const queryText = `
                    INSERT INTO tutee_tutor_relationship(tutee_id, tutor_id)
                    VALUES ($1, $2)
                `;

            const queryValues = [fakeUser.id, null];

            try {
                await query(queryText, queryValues);
            } catch (err) {
                expect(err.code).to.equal("22P02");
            }
        })

        it("should not accept due to missing subjects", async () => {
            const queryText = `
                    INSERT INTO tutee_tutor_relationship(tutee_id, tutor_id, subjects)
                    VALUES ($1, $2, $3)
                `;

            const queryValues = [fakeUser.id, fakeUser.id, null];

            try {
                await query(queryText, queryValues);
            } catch (err) {
                expect(err.code).to.equal("22P02");
            }
        })
    })
})