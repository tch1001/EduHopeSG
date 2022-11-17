import validator from "validator";
import { query } from "../utils/database.js";
import log from "../utils/logging.js";
import ServiceError from "../utils/ServiceError.js";

const EDUCATION_TYPES = ["Secondary 3", "Secondary 4", "Secondary 5", "JC 1", "JC 2", "O level Private candidate", "A level Private candidate"];
const STREAMS = ['N', 'O', 'A', 'P', 'B', 'i'] // n', o', a'lvl, pri, BI, IP
const REFERRAL = ["Reddit", "Instagram", "TikTok", "Telegram", "Google", "Word of mouth"]

/**
 * Check if a password is string via preset requirements
 * @param {string} password Password
 * @returns Boolean
 */
function isStrongPassword(password) {
    // optional to add scoring in the future
    if (!password) return false;

    return validator.isStrongPassword(password, {
        minLength: 12,
        minLowercase: 2,
        minUppercase: 2,
        minNumbers: 2,
        minSymbols: 2
    });
}

/**
 * @typedef {Object} BasicUser
 * @property {string} name User's name
 * @property {string} email User's email address
 * @property {string} password User's account password
 * @property {string} school User's current school
 * @property {string} level_of_education Current/highest level of education
 * @property {string} telegram User's Telegram handle
 * @property {string} bio User's biography/description
 * @property {string} referral How did the user come to hear about EduHope
 * 
 * @mixin
 */

/**
 * @typedef {Object} Tutor
 * @property {boolean} is_tutor Tutor status for user
 * @property {char[]} tutoring An array of character representing courses
 * @property {string[]} subjects subject IDs corresponding from EduHope
 * @property {number} tutee_limit Maximum number of tutees to be taken on
 * @property {Date} commitment_end Expected date when tutor stops volunteering with Eduhope
 * @property {string[]} preferred_communications Array of preferred communication [Texting, Zoom, etc.] 
 * @property {string} avg_response_time Expected and usual time to reply a tutee's inquiry
 * 
 * @typedef {BasicUser & Tutor} User
 */

/**
 * Creates a user in the database
 * @param {BasicUser} user User object
 * TODO: hash password and encrypt email
 */
export async function createUser(user) {
    // reformat user input
    for (const property in user) {
        user[property] = validator.trim(user[property]);
    }

    user.telegram = validator.whitelist(user?.telegram || "", "abcdefghijklmnopqrstuvwxyz0123456789_");

    // validate user input
    if (!validator.isLength(user.name || "", { min: 3, max: 32 })) {
        throw new ServiceError(
            400, "user-invalid-name", "Invalid name",
            "Name cannot be less than 3 or more than 32 in length",
            "Provide a name ranging from 3 to 32 characters in length"
        );
    }

    if (!validator.isEmail(user.email || "")) {
        throw new ServiceError(
            400, "user-invalid-email", "Invalid email",
            "Invalid email address format",
            "Provide a valid email address: name@example.com"
        );
    }

    if (!isStrongPassword(user.password || "")) {
        throw new ServiceError(
            400, "user-weak-password", "Weak password",
            "Password does not meet the requirements of a strong password",
            "Provide a strong password of at least 12 characters in length"
        );
    }

    if (!user.school) {
        // TODO: Validate school in the future
        throw new ServiceError(
            400, "user-no-school", "No school provided",
            "No school or institution is provided",
            "Provide your current institution in full (e.g. Anglo-Chinese IB Junior College)"
        );
    }

    if (!EDUCATION_TYPES.includes(user.level_of_education || "")) {
        throw new ServiceError(
            "user-invalid-education", "Invalid education",
            "No education provided or is invalid",
            `Provide a valid education type with correct case: ${EDUCATION_TYPES.join(", ")}`
        );
    }

    if (!user.telegram) {
        throw new ServiceError(
            400, "user-no-telegram", "Invalid Telegram handle",
            "No Telegram handle provided or invalid Telegram handle (a-z, 0-9 and underscores)",
            "Provide a valid Telegram handle without the '@' at the start"
        );
    }

    if (!REFERRAL.includes(user.referral || "")) {
        throw new ServiceError(
            400, "user-invalid-referral", "Invalid referral",
            "No referral provided or is invalid",
            `Provide a valid referral: ${REFERRAL.join(", ")}`
        );
    }

    try {
        const queryText = `
        INSERT INTO eduhope_user(name, email, password, school, level_of_education, telegram, bio, referral)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
        `

        // TODO: hash password and encrypt email

        await query('BEGIN');

        await query(queryText, [
            user.name, validator.normalizeEmail(user.email), user.password, user.school,
            user.level_of_education, user.telegram, user.bio, user.referral
        ]);

        await query('COMMIT');
    } catch (err) {
        await query('ROLLBACK');

        if (err.routine === "_bt_check_unique") {
            // NOTE: this error message exposes to attacks that an account with
            // a valid email of {user.email} is inside the database.
            // Solution: fake the success response
            throw new ServiceError(
                409, "user-create", "Error creating user",
                "User with the same email address has already registered",
                "Create a new account with a different email address"
            );
        }

        log.error({
            error: err,
            user
        });

        throw new ServiceError(
            400, "user-create", "Error creating user",
            "Error occurred while trying to create user",
            "Contact the site developers or site admins if the problem persists"
        );
    }
}