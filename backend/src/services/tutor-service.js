import ServiceError from "../classes/ServiceError.js";
import { query } from "../utils/database.js";
import { notifyTuteeAcceptance, notifyTuteeDeclination } from "./email-service.js";

/**
 * Rejects a tutee's request by deleing the request
 * @param {string} relationshipID Tutor-tutee relationship ID
 * @returns {{success: true, message: string}} Success message
 */
export async function acceptTutee(relationshipID) {
    if (!relationshipID) throw new ServiceError("invalid-tutee-tutor-relationship");

    const { rows } =
        await query(
            "UPDATE tutee_tutor_relationship SET relationship_status = 1 WHERE id = $1",
            [relationshipID]
        );

    if (!rows.length) throw new ServiceError("invalid-tutee-tutor-relationship");
    const { tutee_id, tutor_id, subjects } = rows[0];

    // notify tutee of acceptance
    await notifyTuteeAcceptance(tutee_id, tutor_id, subjects);

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
    const { tutee_id, tutor_id, subjects } = rows[0];

    // notify tutee of rejection
    await query(`DELETE ${queryText}`, [relationshipID]);
    await notifyTuteeDeclination(tutee_id, tutor_id, subjects, reason);

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
export async function removeTutee(tuteeID, tutorID, reason) {
    if (!tuteeID || !tutorID || !reason) throw new ServiceError("invalid-tutee-tutor-relationship");

    const relationshipID = `${tuteeID}:${tutorID}`;
    const queryText = "FROM tutee_tutor_relationship WHERE id = $1";
    const { rows } = await query(`SELECT * ${queryText}`, [relationshipID]);

    if (!rows.length) throw new ServiceError("invalid-tutee-tutor-relationship");
    const { tutee_id, tutor_id, subjects } = rows[0];

    // notify tutee of removal
    await query(`DELETE ${queryText}`, [relationshipID]);
    await notifyTuteeDeclination(tutee_id, tutor_id, subjects, reason);

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
    const queryText = "SELECT * FROM tutee_tutor_relationship WHERE tutor_id = $1";
    const { rows } = await query(queryText, [tutorID]);

    if (!rows.length) throw new ServiceError("invalid-tutee-tutor-relationship");

    for (let i = 0; i < rows.length; i++) {
        const { success } = await removeTutee(relationship.tutee_id, tutorID, reason);
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