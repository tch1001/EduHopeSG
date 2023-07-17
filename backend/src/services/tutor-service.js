import validator from "validator";
import ServiceError from "../classes/ServiceError.js";
import { query } from "../utils/database.js";
import { notifyTuteeAcceptance, notifyTuteeDeclination } from "./email-service.js";
import * as userService from "../services/user-service.js";

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
 * Get a user object by their ID
 * @param {string} id User ID
 * @param {string=} additionalFields Fields to request from database separated by a single space
 * @returns {Promise<User?|Error>} Returns possible User with fields requested ONLY
 */
export async function getByID(id, additionalFields = "") {
    if (!id) throw new ServiceError("user-by-id");

    const fields = additionalFields ? additionalFields.split(" ") : [];
    fields.unshift("user_id");

    const { rows } = await query({
        text: `SELECT ${fields.join(", ")} FROM tutor WHERE user_id = $1`,
        values: [id]
    });

    return rows[0];
}

/**
 * Update tutor attributes in the database
 * @param {string} tutorID Tutor ID
 * @param {Tutor} attributes Tutor object
 * @returns {{success: true, message: string}} Success message
 */
export async function update(tutorID, attributes = {}) {
    if (!tutorID || !attributes || !Object.keys(attributes).length) {
        throw new ServiceError("user-invalid")
    }

    const valid = userService.validateUserObject(attributes, attributes);
    if (!valid) throw new ServiceError("user-invalid");

    try {
        if (attributes.commitment_end) {
            await query("UPDATE tutor SET commitment_end = $1 WHERE user_id = $2", [attributes.commitment_end, tutorID])
        }

        await query("UPDATE tutor SET updated_on = now() WHERE user_id = $1", [tutorID]);

        return {
            success: true,
            message: `Updated the following attributes: ${Object.keys(attributes)}`
        }
    } catch (err) {
        throw new ServiceError("user-update");
    }
}

/**
 * Get the tutee objects associated with a given tutor id.
 * @param {string} id Tutor ID
 * @returns {Promise<Users?|Error>} Returns all Tutee objects linked to the Tutor ID.
 */
export async function getTutees(tutorID) {
    if (!tutorID) throw new ServiceError("tutee-tutor-not-found");

    const { rows } =
        await query(
            `SELECT 
                u.id, 
                u.given_name, 
                u.family_name, 
                u.school, 
                u.level_of_education,
                u.bio AS description,
                u.email,
                u.telegram,
                ttr.id AS relationship_id,                
                ttr.status, 
                s.level || ' ' || s.name AS subject
            FROM tutee_tutor_relationship AS ttr
            INNER JOIN eduhope_user AS u
            ON ttr.tutee = u.id
            INNER JOIN subject AS s
            ON s.id = ttr.subject            
            AND ttr.tutor = $1`,
            [tutorID]
        );
    rows.forEach(tutee => {
        tutee.email = userService.decrypt(tutee.email)
    });
    return rows;
}

/**
 * Rejects a tutee's request by deleing the request
 * @param {string} relationshipID Tutor-tutee relationship ID
 * @returns {{success: true, message: string}} Success message
 */
export async function acceptTutee(relationshipID, tutorID) {
    if (!relationshipID) throw new ServiceError("invalid-tutee-tutor-relationship");

    // check if the tutee limit has been reached
    const { rows: limitHit } = await query(
        `SELECT t.user_id 
        FROM (
            SELECT ttr.tutor AS tutor_id, COUNT(ttr.tutor) AS num_tutees
            FROM tutee_tutor_relationship AS ttr 
            WHERE ttr.status = 'ACCEPTED' AND ttr.tutor = $1
            GROUP BY ttr.tutor   
        ) AS filtered_tutor_id
        INNER JOIN tutor AS t on t.user_id = filtered_tutor_id.tutor_id 
        AND filtered_tutor_id.num_tutees >= t.tutee_limit`
    , [tutorID])

    if (!!limitHit.length) throw new ServiceError("tutor-hit-tutee-limit2")

    const { rows } =
        await query(
            "UPDATE tutee_tutor_relationship SET status = 'ACCEPTED' WHERE id = $1 RETURNING *",
            [relationshipID]
        );

    if (!rows.length) throw new ServiceError("invalid-tutee-tutor-relationship");
    const { tutee, tutor, subject } = rows[0];

    // notify tutee of acceptance
    //await notifyTuteeAcceptance(tutee, tutor, subject);

    return {
        success: true,
        message: "Rejected tutee. Tutee has been notified of the rejection with apologies"
    }
}

/**
 * Rejects a tutee's request by deleing the request
 * @param {string} relationshipID Tutor-tutee relationship ID
 * @returns {{success: true, message: string}} Success message
 */
export async function rejectTutee(relationshipID, reason) {
    if (!relationshipID || !reason) throw new ServiceError("invalid-tutee-tutor-relationship");

    const queryText = "FROM tutee_tutor_relationship WHERE id = $1";
    const { rows } = await query(`SELECT * ${queryText}`, [relationshipID]);

    if (!rows.length) throw new ServiceError("invalid-tutee-tutor-relationship");
    const { tutee, tutor, subject } = rows[0];

    // notify tutee of rejection
    await query(`DELETE ${queryText}`, [relationshipID]);
    //await notifyTuteeDeclination(tutee, tutor, subject, reason);

    return {
        success: true,
        message: "Rejected tutee. Tutee has been notified of the rejection with apologies"
    }
}

/**
 * Removes tutee from tutor's tutee list
 * @param {string} tuteeID Tutee ID
 * @param {string} tutorID Tutor ID
 * @param {string} reason Tutor's reason for removing tutee
 * @returns {{ success: true, message: string}} Success message
 */
export async function removeTutee(relationshipID, reason) {
    if (!relationshipID || !reason) throw new ServiceError("invalid-tutee-tutor-relationship");

    const queryText = "FROM tutee_tutor_relationship WHERE id = $1";
    const { rows } = await query(`SELECT * ${queryText}`, [relationshipID]);

    if (!rows.length) throw new ServiceError("invalid-tutee-tutor-relationship");
    const { tutee, tutor, subjects } = rows[0];

    // notify tutee of removal
    await query(`DELETE ${queryText}`, [relationshipID]);
    //await notifyTuteeDeclination(tutee, tutor, subjects, reason);

    return {
        success: true,
        message: "Removed tutee. Tutee has been notified of this change"
    }
}

/**
 * Removes ALL tutees from tutor's tutee list
 * @param {string} tutorID Tutor ID
 * @param {string} reason Tutor's reason for removing tutee
 * @returns {{ success: true, message: string}} Success message
 */
export async function removeAllTutees(tutorID, reason) {
    if (!tutorID || !reason) throw new ServiceError("invalid-tutee-tutor-relationship");

    const results = [];
    const queryText = "SELECT * FROM tutee_tutor_relationship WHERE tutor = $1";
    const { rows } = await query(queryText, [tutorID]);

    if (!rows.length) throw new ServiceError("invalid-tutee-tutor-relationship");

    for (let i = 0; i < rows.length; i++) {
        const { success } = await removeTutee(relationship.tutee, tutorID, reason);
        results.push(success);
    }

    if (!results.every((result) => result)) throw new ServiceError("tutee-removal-all-tutees");

    return {
        success: true,
        message: "Removed tutees. All tutees has been notified of this change"
    }
}

export async function feedbackTutee(tuteeID, tutorID) {

}