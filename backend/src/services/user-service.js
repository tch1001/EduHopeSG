import crypto from "crypto";
import validator from "validator";
import jwt from "jsonwebtoken";
import { query } from "../utils/database.js";
import log from "../utils/logging.js";
import ServiceError from "../classes/ServiceError.js";
import { notifyPasswordChange, sendEmailUpdateConfirmation, sendEmailUpdateNotification } from "./email-service.js";
import { getSubjectsByIDs } from "./subject-service.js";
import * as tutorService from "./tutor-service.js";

const EDUCATION_TYPES = [
    'SEC_1',
    'SEC_2',
    'SEC_3',
    'SEC_4',
    'SEC_5',
    'JC_1',
    'JC_2',
    'PRIVATE_O_LEVEL',
    'PRIVATE_A_LEVEL',
    'IP_1',
    'IP_2',
    'IP_3',
    'IP_4',
    'IP_5',
    'IP_6',
    'IB_1',
    'IB_2',
    'POLYTECHNIC_0',
    'POLYTECHNIC_1',
    'POLYTECHNIC_2',
    'POLYTECHNIC_3',
    'UNI_UNDERGRADUATE',
    'UNI_GRADUATE'
];

const REFERRAL = [
    "Reddit",
    "Instagram",
    "TikTok",
    "Telegram",
    "Word of mouth",
    "Online search"
]

const COMMUNICATIONS = [
    'Texting',
    'Virtual Consultation',
    'Face-to-Face'
]

const JWT_OPTIONS = {
    expiresIn: "14d",
    audience: "ALL_USERS",
    issuer: "EDUHOPE.SG",
    subject: "AUTHENTICATION"
};

/**
 * Check if a password is string via preset requirements
 * @param {string} password Password
 * @returns {boolean} Whether strong or not strong
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

/* c8 ignore start */

/**
 * Convert raw password to hashed key for storing user passwords
 * @param {string} password User password to be hashed
 * @param {string=} salt Salt (Optional)
 * @returns {Promise<HashedPass>} Hashed key with salt promise
 */
export function hashPassword(password, salt = crypto.randomBytes(512)) {
    if (!password) throw new ServiceError("funcs-hash-password-invalid");

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
 * @returns {Promise<boolean>} Returns boolean whether the 2 password matches
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
 * @returns {string} Encrypted string
 */
export function encrypt(text) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, "base64");
    const iv = Buffer.from(process.env.ENCRYPTION_IV, "base64");
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return encrypted.toString("hex");
}

/**
 * Decrypts encrypted text
 * @param {string} text Encrypted text to decrypt to UTF8 readable tet
 * @returns {string} Decrypted string
 */
export function decrypt(text) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, "base64");
    const iv = Buffer.from(process.env.ENCRYPTION_IV, "base64");
    const bufferText = Buffer.from(text, "hex")
    const decipher = crypto.createDecipheriv(process.env.ENCRYPTION_ALGO, key, iv);

    const decrypted = Buffer.concat([decipher.update(bufferText), decipher.final()]);
    return decrypted.toString("utf8");
}

/**
 * @typedef {Object} BasicUser
 * @property {string} id User's ID
 * @property {string} given_name User's given name
 * @property {string} family_name User's family name
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
 * Get a user object by their ID
 * @param {string} id User ID
 * @param {string=} additionalFields Fields to request from database separated by a single space
 * @returns {Promise<User?|Error>} Returns possible User with fields requested ONLY
 */
export async function getByID(id, additionalFields = "") {
    if (!id) throw new ServiceError("user-by-id");

    const fields = additionalFields ? additionalFields.split(" ") : [];
    fields.unshift("given_name", "family_name", "id");

    const { rows } = await query({
        text: `SELECT ${fields.join(", ")} FROM eduhope_user WHERE id = $1`,
        values: [id]
    });

    return rows[0];
}

/* c8 ignore stop */

/**
 * 
 * @param {string} email User email address
 * @param {string=} fields Fields to request from database separated by a single space
 * @param {{encrypted: boolean}=} options
 * @returns {Promise<User>?|Error>} Returns possible User with fields requested ONLY
 */
export async function getByEmail(email, additionalFields = "", options = { encrypted: false }) {
    if (!email) throw new ServiceError("user-by-email");
    if (!options.encrypted) email = encrypt(email);

    const fields = additionalFields ? additionalFields.split(" ") : [];
    fields.unshift("given_name", "family_name", "id");

    const { rows } = await query({
        text: `SELECT ${fields.join(", ")} FROM eduhope_user WHERE email = $1`,
        values: [email]
    });

    return rows[0];
}

/**
 * 
 * @param {string} cookie JWT cookie token
 * @returns {{
 *     header: jwt.JwtHeader,
 *     payload: jwt.JwtPayload & { id: string, given_name: string, family_name: string },
 *     signature: string
 * }?} JWT token object
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
 * Validates a object
 * @param {User} user User object
 * @param {[key: string]: boolean} validate
 * @returns {true} True only if validate, not valid throws errors
 */
export function validateUserObject(user, validate = {
    given_name: true,
    family_name: true,
    email: true,
    password: true,
    school: true,
    level_of_education: true,
    telegram: true,
    bio: true,
    referral: true,
    subjects: false,
    tutee_limit: false,
    commitment_end: false,
    preferred_communications: false,
    description: false,
    average_response_time: false
}) {
    // validate user input
    if (validate.given_name) {
        if (!validator.isLength(user.given_name || "", { min: 2, max: 32 })) {
            throw new ServiceError("user-invalid-first-name");
        }
    }
    if (validate.family_name) {
        if (!validator.isLength(user.family_name || "", { min: 1, max: 32 })) {
            throw new ServiceError("user-invalid-last-name");
        }
    }
    // TODO: Validate school in the future
    if (validate.school && !user.school) throw new ServiceError("user-no-school");

    if (validate.level_of_education) {
        if (!EDUCATION_TYPES.includes(user.level_of_education || "")) {
            const error = new ServiceError("user-invalid-education");
            error.details += EDUCATION_TYPES.join(", ");

            throw error;
        }
    }

    if (validate.telegram) {
        if (!user.telegram) throw new ServiceError("user-no-telegram");

        if (!validator.isLength(user.telegram, { min: 5, max: 32 }) ||
            !validator.isAlphanumeric(user.telegram, undefined, { ignore: "_" })) {
            throw new ServiceError("user-invalid-telegram")
        }

        if (!user.telegram == user.telegram.toLowerCase()) {
            throw new Error("Telegram handle must be in lowercase")
        }
    }

    if (validate.email) {
        if (!validator.isEmail(user.email || "")) {
            throw new ServiceError("user-invalid-email");
        }
    }

    if (validate.password) {
        if (!isStrongPassword(user.password || "")) {
            throw new ServiceError("user-weak-password");
        }
    }

    if (validate.bio && !validator.isLength(user.bio || "", { min: 0, max: 500 })) {
        throw new ServiceError("user-invalid-bio")
    }

    if (validate.referral && user.referral) {
        if (!REFERRAL.includes(user.referral || "")) {
            const error = new ServiceError("user-invalid-referral");
            error.details += REFERRAL.join(", ");

            throw error;
        }
    }

    // Tutor object validation    
    if (validate.commitment_end) {
        // at least roughly a month (here is 29 days due to > instead of >= in date comparison)
        const minimumCommitment = new Date(Date.now() + 2.5056e+9).toString();
        const validCommitment = validator.isAfter(user?.commitment_end?.toString() || "", minimumCommitment)

        if (!validCommitment) throw new ServiceError("user-invalid-commitment");
    }

    if (validate.tutee_limit) {
        if (!user?.tutee_limit || !(user?.tutee_limit >= 1 && user?.tutee_limit <= 5)) {
            throw new ServiceError("user-invalid-tutee-limit");
        }
    }

    if (validate.subjects) {
        if (!user?.subjects?.length) throw new ServiceError("user-invalid-subjects");
        // TODO: add validation for subjects from tickninja
    }

    if (validate.preferred_communications) {
        const invalid = !user?.preferred_communications?.length ||
            user.preferred_communications?.some((communication) => (
                !COMMUNICATIONS.includes(communication
                )));

        if (invalid) {
            const error = new ServiceError("user-invalid-communications");
            error.details += COMMUNICATIONS.join(", ");

            throw error;
        }
    }

    if (validate.description && !validator.isLength(user.description || "", { min: 0, max: 500 })) {
        throw new ServiceError("user-invalid-bio")
    }

    if (validate.average_response_time) {
        //
    }
    return true;
}

/**
 * Creates a user in the database
 * @param {BasicUser} user User object
 * @returns {{success: true, message: string}} Success message
 */
export async function create(user) {
    // reformat user input
    for (const property in user) {
        user[property] = validator.trim(user[property]);
    }

    //user.telegram = validator.whitelist(user?.telegram || "", "abcdefghijklmnopqrstuvwxyz0123456789_");
    user.telegram = user.telegram.toLowerCase()

    // validate user input
    const valid = validateUserObject(user);
    if (!valid) throw new ServiceError("user-invalid");

    const hashedPass = await hashPassword(user.password);
    const encryptedEmail = encrypt(validator.normalizeEmail(user.email));

    try {
        const queryText = `
        INSERT INTO eduhope_user(given_name, family_name, email, password, school, level_of_education, telegram, bio, referral)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
        `

        const values = [
            user.given_name, user.family_name, encryptedEmail, hashedPass, user.school,
            user.level_of_education, user.telegram, user.bio, user.referral
        ]

        await query(queryText, values);

        return {
            success: true,
            message: "Created user"
        }
    } catch (err) {
        if (err.routine === "_bt_check_unique") {
            // NOTE: this error message exposes to attacks that an account with
            // a valid email of {user.email} is inside the database.
            // Solution: spoof/fake the success response
            throw new ServiceError("user-create-unique");
        }

        throw new ServiceError("user-create");
    }
}

/**
 * Login to a user with email and password, creates a JWT cookie if success
 * @param {string} email User email
 * @param {string} password User password
 * @returns {{ id: User.id, given_name: User.given_name, family_name: User.family_name expireAt: number, cookie: string}} Success body with JWT cookie
 */
export async function login(email, password) {
    if (!email || !password || !validator.isEmail(email) || !isStrongPassword(password)) {
        throw new ServiceError("user-login-invalid");
    }

    email = validator.normalizeEmail(validator.trim(email));
    password = validator.trim(password);

    const user = await getByEmail(email, "password", { encrypted: false });
    if (!user) throw new ServiceError("user-login-failed");

    // verify password
    const correct = await verifyPassword(password, user.password);
    if (!correct) throw new ServiceError("user-login-failed");

    // figure out if the user is a tutor or tutee
    const is_tutor = await tutorService.getByID(user.id)

    // update last login records
    await query("UPDATE eduhope_user SET last_login = now() WHERE id = $1", [user.id]);

    // returning cookie and success object
    const payload = {
        id: user.id,
        given_name: user.given_name,
        family_name: user.family_name,
        is_tutor: !!is_tutor
    };

    const cookie = jwt.sign(
        payload,
        process.env.JWT_KEY,
        JWT_OPTIONS
    )

    return {
        ...payload,
        expireAt: jwt.decode(cookie).exp,
        cookie
    }
}

/**
 * Update user attributes in the database
 * @param {string} userID User ID
 * @param {User} attributes User object
 * @returns {{success: true, message: string}} Success message
 */
export async function update(userID, attributes = {}) {
    if (!userID || !attributes || !Object.keys(attributes).length) {
        throw new ServiceError("user-invalid")
    }


    if (attributes.telegram) {
        attributes.telegram = attributes.telegram.toLowerCase()
        /*
        attributes.telegram = validator.whitelist(
            attributes.telegram || "",
            "abcdefghijklmnopqrstuvwxyz0123456789_"
        );
        */
    }

    const valid = validateUserObject(attributes, Object.fromEntries(Object.keys(attributes).map(field => [field, true])));
    if (!valid) throw new ServiceError("user-invalid");

    try {
        if (attributes.given_name) {
            await query("UPDATE eduhope_user SET given_name = $1 WHERE id = $2", [attributes.given_name, userID]);
        }

        if (attributes.family_name) {
            await query("UPDATE eduhope_user SET family_name = $1 WHERE id = $2", [attributes.family_name, userID]);
        }

        if (attributes.school) {
            // TODO: validate schools
            await query("UPDATE eduhope_user SET school = $1 WHERE id = $2", [attributes.school, userID]);
        }

        if (attributes.level_of_education) {
            await query(
                "UPDATE eduhope_user SET level_of_education = $1 WHERE id = $2",
                [attributes.level_of_education, userID]
            );
        }

        if (attributes.telegram) {
            const { rows: users } = await query("SELECT id FROM eduhope_user WHERE telegram = $1", [attributes.telegram])

            if (users[0].id != userID) throw new ServiceError("telegram-update-unique")
            await query("UPDATE eduhope_user SET telegram = $1 WHERE id = $2", [attributes.telegram, userID]);
        }

        if (attributes.email) {
            await emailChange(userID, attributes.email)
        }

        if (attributes.bio) {
            await query("UPDATE eduhope_user SET bio = $1 WHERE id = $2", [attributes.bio, userID]);
        }

        if (attributes.commitment_end) {
            await query("UPDATE eduhope_user SET commitment_end = $1 WHERE id = $2", [attributes.commitment_end, userID])
        }

        if (attributes.preferred_communications) {
            await query("UPDATE eduhope_user SET preferred_communications = $1 WHERE id = $2", [attributes.preferred_communications, userID])
        }

        if (attributes.tutee_limit) {
            await query("UPDATE eduhope_user SET tutee_limit = $1 WHERE id = $2", [attributes.tutee_limit, userID])
        }

        if (attributes.subjects) {
            await query("UPDATE eduhope_user SET subjects = $1 WHERE id = $2", [attributes.subjects, userID])
        }

        if (attributes.average_response_time) {
            await query("UPDATE eduhope_user SET average_response_time = $1 WHERE id = $2", [attributes.average_response_time, userID])
        }

        if (attributes.description) {
            await query("UPDATE eduhope_user SET description = $1 WHERE id = $2", [attributes.description, userID])
        }

        await query("UPDATE eduhope_user SET updated_on = now() WHERE id = $1", [userID]);

        return {
            success: true,
            message: `Updated the following attributes: ${Object.keys(attributes)}`
        }
    } catch (err) {
        // If the error has a mapping, propagate it upwards. Otherwise, throw the generic error        
        if (err.details) throw err
        throw new ServiceError("user-update");
    }
}

/**
 * Changes user password
 * @param {User.id} userID 
 * @param {User.password} currentPassword Old password to verify
 * @param {User.password} newPassword New password
 * @returns {{success: true, message: string}} Success message
 */
export async function updatePassword(userID, currentPassword, newPassword) {
    if (!userID || !currentPassword || !newPassword)
        throw new ServiceError("user-change-password-missing");

    currentPassword = validator.trim(currentPassword);
    newPassword = validator.trim(newPassword);

    if (currentPassword === newPassword) throw new ServiceError("user-same-password");

    if (!isStrongPassword(newPassword))
        throw new ServiceError("user-weak-password");

    const user = await getByID(userID, "password email");
    if (!user) throw new ServiceError("user-login-failed");

    // verify password
    const correct = await verifyPassword(currentPassword, user.password);
    if (!correct) throw new ServiceError("user-invalid-password");

    // change password
    const updatedPassword = await hashPassword(newPassword);
    await query("UPDATE eduhope_user SET password = $1 WHERE id = $2", [updatedPassword, userID]);
    await query("UPDATE eduhope_user SET updated_on = now() WHERE id = $1", [userID]);

    // email notify the user
    //await notifyPasswordChange(user);

    return {
        success: true,
        message: "Updated user password"
    }
}

/**
 * Changes user email
 * @param {User.id} userID 
 * @param {User.email} newEmail New email address to update
 * @returns {{success: true, message: string}} Success message
 */
export async function emailChange(userID, newEmail) {
    newEmail = validator.normalizeEmail(validator.trim(newEmail));

    const user = await getByID(userID, "email");

    // check if email is already registered and if its the same email as current
    const currentEmail = decrypt(user.email);
    const userExists = await getByEmail(newEmail);

    if (newEmail === currentEmail) return;
    if (userExists) throw new ServiceError("email-update-unique");

    // update the email
    const updatedEmail = encrypt(newEmail);
    await query("UPDATE eduhope_user SET email = $1, updated_on = now() WHERE id = $2", [updatedEmail, userID]);

    // email to notify
    await sendEmailUpdateNotification(currentEmail);
    await sendEmailUpdateNotification(newEmail);
}


/**
 * @typedef {Object} Tutor
 * @property {string[]} subjects subject IDs corresponding from EduHope
 * @property {number} tutee_limit Maximum number of tutees to be taken on
 * @property {Date} commitment_end Expected date when tutor stops volunteering with Eduhope
 * @property {string[]} preferred_communications Array of preferred communication [Texting, Zoom, etc.] 
 * @property {string} description
 * @property {string} average_response_time Expected and usual time to reply a tutee's inquiry
 * 
 * @typedef {BasicUser & Tutor} User
 */

/**
 * Converts a normal account to a Tutor status account
 * @param {string} userID User ID
 * @param {Tutor} attributes Tutor attributes
 * @returns {{success: true, message: string}} Success message
 */
export async function registerTutor(attributes) {
    if (!attributes || !Object.keys(attributes).length) {
        throw new ServiceError("user-invalid")
    }

    // reformat user input
    for (const property in attributes) {
        if (typeof property == Array) {
            attributes[property] = attributes[property].map(str => validator.trim(str))
        } else if (typeof property == String) {
            attributes[property] = validator.trim(attributes[property]);
        }
    }

    attributes.telegram = attributes.telegram.toLowerCase()

    const valid = validateUserObject(attributes, Object.fromEntries(Object.keys(attributes).map(field => [field, true])));
    if (!valid) throw new ServiceError("user-invalid");

    const hashedPass = await hashPassword(attributes.password);
    const encryptedEmail = encrypt(validator.normalizeEmail(attributes.email));

    // filter out valid subjects
    const subjects = await getSubjectsByIDs(attributes.subjects);
    attributes.subjects = subjects.map(({ id }) => id);

    var user_id; // Depends on whether the user already exists

    try {
        // check if the user already exists
        const isExistingUser = await getByEmail(validator.normalizeEmail(attributes.email))

        if (isExistingUser) {
            // If so, update eduhope_user
            const text1 = `
            UPDATE eduhope_user SET given_name = $1, family_name = $2, school = $3, level_of_education = $4,
            telegram = $5, email = $6, password = $7, bio = $8, referral = $9
            WHERE id = $10`;

            const values1 = [
                attributes.given_name, attributes.family_name, attributes.school,
                attributes.level_of_education, attributes.telegram, encryptedEmail, hashedPass, attributes.bio, attributes.referral,
                isExistingUser.id
            ];

            await query(text1, values1);
            user_id = isExistingUser.id

        } else {
            // Otherwise, add a new row to eduhope_user
            const text1 = `
            INSERT INTO eduhope_user(given_name, family_name, email, password, school, level_of_education, telegram, bio, referral)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
            `
            const values1 = [
                attributes.given_name, attributes.family_name, encryptedEmail, hashedPass, attributes.school,
                attributes.level_of_education, attributes.telegram, attributes.bio, attributes.referral
            ]

            const { rows } = await query(text1, values1);
            user_id = rows[0].id
        }

        // add a new row to tutor table
        const text2 = `
        INSERT INTO tutor (user_id, subjects, tutee_limit, commitment_end,
        preferred_communications, average_response_time, description)
        VALUES ($1, $2, $3, $4, $5, $6, $7)`;

        const values2 = [
            user_id,
            attributes.subjects, attributes.tutee_limit,
            attributes.commitment_end, attributes.preferred_communications,
            attributes.average_response_time, attributes.description
        ];

        await query(text2, values2);



        return {
            success: true,
            message: "User is now Tutor status"
        }
    } catch (err) {
        throw new ServiceError("user-create");
    }
}