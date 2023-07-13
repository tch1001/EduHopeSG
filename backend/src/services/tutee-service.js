import ServiceError from "../classes/ServiceError.js";
import { query } from "../utils/database.js";
import { sendTuitionRequest, notifyTuitionSubjectChange } from "./email-service.js";
import * as userService from "../services/user-service.js";
import * as tutorService from "../services/tutor-service.js";

const  MAX_TUTOR_PER_SUBJECT = 1

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
                s.id AS subject_id,
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

    // check if the request for the same tutor, subject, and requesting student has already been made
    const { rows: existingMatchingRequests } = await query(
        `SELECT * FROM tutee_tutor_relationship 
            WHERE tutor = $1
            AND tutee = $2
            AND subject = $3 `,
        [tutorID, tuteeID, subjects[0]]
    );

    if (existingMatchingRequests.length > 0) {
        throw new ServiceError("tutee-request-tutor-unique")
    }


    // check if the tutee has hit the requesting limit (on a per subject basis)
    const tutors = await getTutors(tuteeID)
    const relevantTutors = tutors.filter(tutor=> tutor.subject_id == subjects[0] )

    if (relevantTutors.filter(tutor=> tutor.status == "PENDING").length >= MAX_TUTOR_PER_SUBJECT) {
        throw new ServiceError("tutee-hit-request-tutor-limit")
    }
    if (relevantTutors.filter(tutor=> tutor.status == "ACCEPTED").length >= MAX_TUTOR_PER_SUBJECT) {
        throw new ServiceError("tutee-hit-accepted-tutor-limit")
    }   
    if (relevantTutors.length >= MAX_TUTOR_PER_SUBJECT) {
        throw new ServiceError("tutee-hit-total-tutor-limit")
    }     


    const user = await userService.getByID(tuteeID, "email");
    const tutor_user_data = await userService.getByID(tutorID, "email");
    const tutor_data = await tutorService.getByID(tutorID, "subjects tutee_limit");
    const tutor = {...tutor_user_data, ...tutor_data}

    if (!user || !tutor) throw new ServiceError("tutee-tutor-not-found");
    if (!tutor.subjects) throw new ServiceError("user-not-tutor");

    // check if subjects being requested is offered by tutor
    const notOffered = subjects.some(subject => !tutor.subjects.includes(subject));
    if (notOffered) throw new ServiceError("tutee-tutor-subject-unoffered");

    // check if tutor has hit the limit
    const { rows: count } = await query(
        `SELECT count(tutor) FROM tutee_tutor_relationship 
            WHERE tutor = $1
            AND status = 'ACCEPTED'`,
        [tutorID]
    )

    if (parseInt(count[0].count) >= tutor.tutee_limit)
        throw new ServiceError("tutor-hit-tutee-limit");


    // add a pending tutor request in the ttr table
    const queryText = `
        INSERT INTO tutee_tutor_relationship(tutee, tutor, subject, status)
        VALUES($1, $2, $3, $4) RETURNING *
    `

    const queryValues = [tuteeID, tutorID, subjects[0], 'PENDING'];
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