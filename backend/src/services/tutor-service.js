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
    if (!relationshipID) throw new ServiceError("invalid-tutee-tutor-relationship");

    const { rows } =
        await query("SELECT * FROM tutee_tutor_relationship WHERE id = $1", [relationshipID]);

    if (!rows.length) throw new ServiceError("invalid-tutee-tutor-relationship");
    const { tutee_id, tutor_id, subjects } = rows[0];

    // notify tutee of rejection
    await query("DELETE FROM tutee_tutor_relationship WHERE id = $1", [relationshipID]);
    await notifyTuteeDeclination(tutee_id, tutor_id, subjects, reason);

    return {
        success: true,
        message: "Rejected tutee. Tutee has been notified of the rejection with apologies"
    }
}

export async function removeTutee(tuteeID, tutorID, reason) {
    const relationshipID = `${tuteeID}:${tutorID}`;

    const { rows } =
        await query("SELECT * FROM tutee_tutor_relationship WHERE id = $1", [relationshipID]);

    if (!rows.length) throw new ServiceError("invalid-tutee-tutor-relationship");
    const { tutee_id, tutor_id, subjects } = rows[0];

    // notify tutee of removal
    await query("DELETE FROM tutee_tutor_relationship WHERE id = $1", [relationshipID]);
    await notifyTuteeDeclination(tutee_id, tutor_id, subjects, reason);

    return {
        success: true,
        message: "Removed tutee. Tutee has been notified of this change"
    }
}

export async function removeAllTutees(tutorID) {
    const { rowCount } =
        await query("DELETE FROM tutee_tutor_relationship WHERE tutor_id = $1", [tutorID]);

    if (!rowCount) throw new ServiceError("invalid-tutee-tutor-relationship");

    // TODO: notify tutees of removal

    return {
        success: true,
        message: "Removed tutees. All tutees has been notified of this change"
    }
}

export async function feedbackTutee(tuteeID, tutorID) {

}