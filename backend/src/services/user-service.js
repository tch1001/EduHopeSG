import crypto from "crypto";
import validator from "validator";
import jwt from "jsonwebtoken";
import ServiceError from "../classes/ServiceError.js";
import { query } from "../utils/database.js";
import log from "../utils/logging.js";

const EDUCATION_TYPES = ["Secondary 3", "Secondary 4", "Secondary 5", "JC 1", "JC 2", "O level Private candidate", "A level Private candidate"];
const STREAMS = ['N', 'O', 'A', 'P', 'B', 'i']; // n', o', a'lvl, pri, BI, IP
const REFERRAL = ["Reddit", "Instagram", "TikTok", "Telegram", "Google", "Word of mouth"];

const JWT_OPTIONS = {
    expiresIn: "14d",
    audience: "ALL_USERS",
    issuer: "EDUHOPE.SG",
    subject: "AUTHENTICATION"
};

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
 * @param {string} inputPassword User password request (to check)
 * @param {HashedPass} hashedPass Hashed key, can be HashedPass format (correct)
 * @returns {Promise<boolean>}
 */
function verifyPassword(inputPassword, hashedPass) {
    if (!inputPassword || !hashedPass) throw new ServiceError("funcs-verify-password-invalid");

    const [salt, key] = hashedPass.split(":");

    return new Promise((resolve, reject) => {
        hashPassword(inputPassword, Buffer.from(salt, "hex"))
            .then((result) => {
                const input = Buffer.from(result.split(":")[1], "hex");
                const userPassword = Buffer.from(key, "hex");

                resolve(crypto.timingSafeEqual(input, userPassword))
            })
            .catch(reject);
    })
}

/**
 * Encrypt raw UTF8 text to hex for database storage
 * @param {string} text Raw UTF8 text to encrypt
 * @returns {string}
 */
function encrypt(text) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, "base64");
    const iv = Buffer.from(process.env.ENCRYPTION_IV, "base64");
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return encrypted.toString("hex")
}

/**
 * Decrypts encrypted text
 * @param {string} text Encrypted text to decrypt to UTF8 readable tet
 * @returns {string}
 */
function decrypt(text) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, "base64");
    const iv = Buffer.from(process.env.ENCRYPTION_IV, "base64");
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);

    const decrypted = Buffer.concat([decipher.update(text), decipher.final()]);
    return decrypted.toString("utf8");
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
 * Get a user object by their ID
 * @param {string} id User ID
 * @param {string} fields Fields to request from database separated by a single space
 * @returns {Promise<Some<User>?|Error>}
 */
async function getByID(id, fields = "id name") {
    if (!id) throw new ServiceError("user-by-id");
    fields = fields.split(" ").join(", ")

    const { rows } = await query({
        name: "fetch-user-by-id",
        text: `SELECT ${fields} FROM eduhope_user WHERE id = $1`,
        values: [id]
    });

    return rows[0];
}

/**
 * 
 * @param {string} email User email address
 * @param {string=} fields Fields to request from database separated by a single space
 * @param {{encrypted: boolean}=} options
 * @returns {Promise<Some<User>?|Error>}
 */
async function getByEmail(email, fields = "id name", options = { encrypted: false }) {
    if (!email) throw new ServiceError("user-by-email");
    if (!options.encrypted) email = encrypt(email);

    fields = fields.split(" ").join(", ")

    const { rows } = await query({
        name: "fetch-user-by-email",
        text: `SELECT ${fields} FROM eduhope_user WHERE email = $1`,
        values: [email]
    });

    return rows[0];
}

/**
 * 
 * @param {string} cookie JWT cookie token
 * @returns {{ id: string, name : string}?}
 */
export function verifyAuthentication(cookie) {
    if (!cookie) return null;

    try {
        const token = jwt.verify(cookie, process.env.JWT_KEY, { complete: true, ...JWT_OPTIONS });
        return token;
    } catch (err) {
        return null;
    }
}

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
    const encryptedEmail = encrypt(validator.normalizeEmail(user.email));

    try {
        const queryText = `
        INSERT INTO eduhope_user(name, email, password, school, level_of_education, telegram, bio, referral)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *
        `

        const values = [
            user.name, encryptedEmail, hashedPass, user.school,
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
            message: "Failed to execute create user in user service",
            error: err,
            user: { ...user, password: '' }
        });

        throw new ServiceError("user-create");
    }
}

/**
 * Login to a user with email and password, creates a JWT cookie if success
 * @param {string} email User email
 * @param {string} password User password
 * @returns {string} Cookie
 */
export async function login(email, password) {
    if (!email || !password || !validator.isEmail(email) || !isStrongPassword(password)) {
        throw new ServiceError("user-login-invalid");
    }

    email = validator.normalizeEmail(validator.trim(email));
    password = validator.trim(password);

    const user = await getByEmail(email, "id name password", { encrypted: false });
    if (!user) throw new ServiceError("user-login-failed");

    // verify password
    const correct = await verifyPassword(password, user.password);
    if (!correct) throw new ServiceError("user-login-failed");

    // update last login records
    query("UPDATE eduhope_user SET last_login = now() WHERE id = $1", [user.id]);

    // returning cookie and success object
    const cookie = jwt.sign(
        {
            id: user.id,
            name: user.name
        },
        process.env.JWT_KEY, JWT_OPTIONS
    )

    return {
        expireAt: jwt.decode(cookie).exp,
        cookie
    }
}

/**
 * Tutee requesting for tutor
 * @param {string} tutorID Tutor's user ID 
 * @param {string} tuteeID Tutee's user ID
 */
export async function requestTutor(tutorID, tuteeID) {
    
}