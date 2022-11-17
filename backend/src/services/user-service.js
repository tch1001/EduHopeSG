import crypto from "crypto";
import validator from "validator";
import ServiceError from "../classes/ServiceError.js";
import { query } from "../utils/database.js";
import log from "../utils/logging.js";

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
 * @typedef {string} HashedPass 
 * @example <caption>Format for HashedPass</caption>
 * "salt:hashed_key"
 */

/**
 * Convert raw password to hashed key for storing user passwords
 * @param {string} password User password to be hashed
 * @param {string|undefined} salt Salt (Optional)
 * @returns {Promise<HashedPass>} Hashed key with salt promise
 */
function hashPassword(password, salt) {
    if (!password) throw new ServiceError("funcs-hash-password-invalid");
    if (!salt) salt = crypto.randomBytes(512);

    return new Promise((resolve, reject) => {
        /**
         * N – iterations count (affects memory and CPU usage)
         * r – block size (affects memory and CPU usage)
         * p – parallelism factor (threads to run in parallel - affects the memory, CPU usage), usually 1
         * Memory required = 128 * N * r * p bytes
         * Current mem. required = 128 * 2048 * 8 * 1 bytes = 2097152 bytes = 2.09 MB
         * 
         * Every hashing password, user login would require 2.09 MB from system.
         * Should be able to handle 1,800 user login requests/second under 4 GB memory constraint
         * TODO: Rate limit requests
         */

        crypto.scrypt(password, salt, 128, { N: 2048, r: 8, p: 1 }, (err, result) => {
            if (err) {
                log.error({ err, salt })
                reject(new ServiceError("funcs-hash-password-error", err.message));
            }

            resolve(`${salt.toString("hex")}:${result.toString("hex")}`);
        })
    })
}

/**
 * Verify a login request by comparing user's input to stored user's HashedPass in database
 * @param {string} password User password request
 * @param {HashedPass} hashedKey Hashed key, can be HashedPass format
 */
function verifyPassword(password, hashedPass) {
    if (!password || !hashedPass) throw new ServiceError("funcs-verify-password-invalid");

    const [salt] = hashedPass.split(":");

    return new Promise((resolve, reject) => {
        hashPassword(password, salt)
            .then((result) => resolve(hashedPass === result))
            .catch(reject);
    })
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
 */
export async function create(user) {
    // reformat user input
    for (const property in user) {
        user[property] = validator.trim(user[property]);
    }

    user.telegram = validator.whitelist(user?.telegram || "", "abcdefghijklmnopqrstuvwxyz0123456789_");

    // validate user input
    if (!validator.isLength(user.name || "", { min: 3, max: 32 })) {
        throw new ServiceError("user-invalid-name");
    }

    if (!validator.isEmail(user.email || "")) {
        throw new ServiceError("user-invalid-email");
    }

    if (!isStrongPassword(user.password || "")) {
        throw new ServiceError("user-weak-password");
    }

    if (!user.school) {
        // TODO: Validate school in the future
        throw new ServiceError("user-no-school");
    }

    if (!EDUCATION_TYPES.includes(user.level_of_education || "")) {
        const error = new ServiceError("user-invalid-education");
        error.details += EDUCATION_TYPES.join(", ");

        throw error;
    }

    if (!user.telegram) {
        throw new ServiceError("user-no-telegram",);
    }

    if (!REFERRAL.includes(user.referral || "")) {
        const error = new ServiceError("user-invalid-referral");
        error.details += REFERRAL.join(", ");

        throw error;
    }

    const hashedPass = await hashPassword(user.password);

    try {
        const queryText = `
        INSERT INTO eduhope_user(name, email, password, school, level_of_education, telegram, bio, referral)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
        `

        const values = [
            user.name, validator.normalizeEmail(user.email), hashedPass, user.school,
            user.level_of_education, user.telegram, user.bio, user.referral
        ]

        await query(queryText, values);
    } catch (err) {
        if (err.routine === "_bt_check_unique") {
            // NOTE: this error message exposes to attacks that an account with
            // a valid email of {user.email} is inside the database.
            // Solution: spoof/fake the success response
            throw new ServiceError("user-create-unique");
        }

        log.error({
            error: err,
            user: { ...user, password: '' }
        });

        throw new ServiceError("user-create");
    }
}

// export async function getByID(id, excludedFields = ["email", "password"]) {
//     if (!id) throw new ServiceError();

//     return query({
//         name: "fetch-user-by-id",
//         text: "SELECT * FROM user WHERE id $1",
//         values: [id]
//     });
// }

// export async function getByEmail(email)

// export async function login(email, password) {
//     if (!email && !password) throw new ServiceError();


// }