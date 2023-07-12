import ServiceError from "../classes/ServiceError.js";
import { query } from "../utils/database.js";
import { sendTuitionRequest, notifyTuitionSubjectChange } from "./email-service.js";
import * as userService from "../services/user-service.js";
import { getByID } from "./user-service.js";

/**
 * Get the tutee objects associated with a given tutor id.
 * @param {string} id Tutor ID
 * @returns {Promise<Users?|Error>} Returns all Tutee objects linked to the Tutor ID.
 */
export async function getTutors(tuteeID) {
    if (!tuteeID) throw new ServiceError("tutee-tutor-not-found");

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
                s.level || ' ' || s.name AS subject,
                t.preferred_communications
            FROM tutee_tutor_relationship AS ttr
            INNER JOIN eduhope_user AS u
            ON ttr.tutor = u.id
            INNER JOIN tutor AS t
            ON ttr.tutor = t.user_id
            INNER JOIN subject AS s
            ON s.id = ttr.subject
            AND ttr.tutee = $1`,
            [tuteeID]
        );
    rows.forEach(tutor => {
        tutor.email = userService.decrypt(tutor.email)
        tutor.preferred_communications = tutor.preferred_communications.slice(1, -1).split(",")
            .map(type => type.replace(/"/g, ''))
    });
    return rows;
}

/**
 * Tutee requests for a tutor for selected subject(s)
 * @param {string} tutorID Tutor's user ID 
 * @param {string} tuteeID Tutee's user ID
 * @param {number[]} subjects List of subject IDs
 * @returns {{success: true, message: string}} Success message
 */
export async function requestTutor(tuteeID, tutorID, subjects = []) {
    if (!tuteeID || !tutorID || !subjects.length)
        throw new ServiceError("user-request-tutor-missing");

    if (tuteeID === tutorID) throw new ServiceError("tutee-tutor-same");

    const user = await getByID(tuteeID, "email");
    const tutor = await getByID(tutorID, "is_tutor subjects email");

    if (!user || !tutor) throw new ServiceError("tutee-tutor-not-found");
    if (!tutor.is_tutor) throw new ServiceError("user-not-tutor");

    // check if subjects being requested is offered by tutor
    const notOffered = subjects.some(subject => !tutor.subjects.includes(subject));
    const relationshipID = `${tuteeID}:${tutorID}`
    if (notOffered) throw new ServiceError("tutee-tutor-subject-unoffered");

    // check if tutor has hit the limit
    const { rows: count } = await query(
        "SELECT count(id) FROM tutee_tutor_relationship WHERE id = $1",
        [relationshipID]
    )

    if (parseInt(count[0].count) >= tutor.tutee_limit)
        throw new ServiceError("tutor-hit-tutee-limit");

    // check already a request with the same subjects
    const { rows: requests } = await query(
        "SELECT * FROM tutee_tutor_relationship WHERE id = $1",
        [relationshipID]
    );

    if (requests.length) {
        const { subjects: tutoredSubjects } = requests[0];
        const requestedSubjects = subjects.length === tutoredSubjects.length &&
            subjects.every(subject => tutoredSubjects.includes(subject));

        if (!requestedSubjects) {
            // update subjects

            await query(
                `UPDATE tutee_tutor_relationship SET subjects = $1 WHERE id = $2`,
                [subjects, relationshipID]
            )

            await notifyTuitionSubjectChange(user, tutor, subjects, tutoredSubjects);

            return {
                success: true,
                message: "Updated tuition subjects. Your tutor is notified of the changes"
            }
        } else {
            // throw duplicate error
            throw new ServiceError("tutee-request-tutor-unique")
        }
    };

    // change status of relationship if accepted, delete row if decline
    const queryText = `
        INSERT INTO tutee_tutor_relationship(tutee_id, tutor_id, subjects)
        VALUES($1, $2, $3) RETURNING *
    `

    const queryValues = [tuteeID, tutorID, subjects];
    await query(queryText, queryValues)
    await sendTuitionRequest(user, tutor, subjects);

    return {
        success: true,
        message: "Request for tuition sent to tutor"
    }
}

/**
 * TODO: survey/review/feedback/reason why withdrawing see {@link reviewTutor} func
 * Tutee withdraws a tutor
 * @param {string} relationshipID Tutor's user ID
 * @returns {{success: true, message: string}} Success message
 */
export async function withdrawTutor(relationshipID) {
    if (!relationshipID) throw new ServiceError("invalid-tutee-tutor-relationship");

    const { rowCount } =
        await query("DELETE FROM tutee_tutor_relationship WHERE id = $1 RETURNING *", [relationshipID]);

    if (!rowCount) throw new ServiceError("invalid-tutee-tutor-relationship");

    return {
        success: true,
        message: "Terminated the Tutee-Tutor relationship. Your tutor has been notified of this change"
    }
}

/**
 * Review a tutor
 * @param {string} tutorID Tutor's user ID
 * @param {string} tuteeID Tutor's user ID
 */
export async function reviewTutor(tutorID, tuteeID) {

}