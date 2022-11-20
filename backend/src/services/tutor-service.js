import ServiceError from "../classes/ServiceError.js";
import { query } from "../utils/database.js";
import { getByID } from "./user-service.js";

export async function acceptTutee(tuteeID, tutorID) {
    /**
     * Tutor accepts request -> Both parties are agreeable
     * Creates the relationship in PostgreSQL
     * They have each other contacts/telegram handle, and can arrange their questions/Zoom meetings
     * 
     * Add them in the Telegram group chat? Unsure how this one works ATM
     */
}

/**
 * Rejects a tutee's request by deleing the request
 * @param {string} relationshipID Tutor-tutee relationship ID
 * @returns {{success: true, message: string}} Success message
 */
export async function rejectTutee(relationshipID) {
    if (!relationshipID) throw new ServiceError("invalid-tutee-tutor-relationship");

    const { rowCount } =
        await query("DELETE FROM tutee_tutor_relationship WHERE id = $1", [relationshipID]);

    if (!rowCount) throw new ServiceError("invalid-tutee-tutor-relationship");

    // TODO: notify tutee of reject

    return {
        success: true,
        message: "Rejected tutee"
    }
}
