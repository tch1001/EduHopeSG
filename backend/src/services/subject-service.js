import { query } from "../utils/database.js";

/**
 * @typedef {Object} Subject
 * @property {string} id Subject's ID in the database
 * @property {string} name Subject name
 * @property {string} course Subject's course ID
 */

/**
 * @typedef {Object} CourseSubject
 * @property {string} subject_id Subject's ID in the database
 * @property {string} course_id Subject's course ID in the database
 * @property {string} name Subject name
 * @property {string} course Subject's course name
 */

/**
 * @typedef {Object} Tutor
 * @property {string} id User ID
 * @property {string} name User name
 * @property {string} school User's current institution
 * @property {string} level_of_education Current/highest level of education
 * @property {string} bio Tutor's biography/teaching style/description
 */

/**
 * Convert an array of subjects to names
 * @param {number[]} subjects List of subject IDs
 * @returns {Promise<Subject[]>} Array of subject(s) information
 */
export async function getSubjects(subjects = []) {
    const queryText =
        (`\
        SELECT S.id, S.name, C.name AS course
            FROM subjects as S
            INNER JOIN courses C ON S.course = C.id
            WHERE S.id = $1;\
        `);

    const queries = subjects.map(subjectsID => query(queryText, [subjectsID]));
    const results = await Promise.all(queries);
    const data = results.map(({ rows }) => rows[0]);

    return data.filter((d) => d);
}

/**
 * Convert an array of subjects to names
 * @param {number[]} subjects List of subject IDs
 * @returns {{Promise<success: boolean, message: string, subjects: Subject[]}>} Response object
 */
export async function getSubjectsByID(subjects) {
    return {
        success: true,
        message: `${subjects.length} rows returned from database`,
        subjects: await getSubjects(subjects)
    };
}

/**
 * Get subjects by stream
 * @param {number} course Course ID
 * @returns {{Promise<success: boolean, message: string, subjects: CourseSubject[]}>} Response object
 */
export async function getSubjectsByCourse(course = 0) {
    const queryText =
        (`\
        SELECT C.id AS course_id, C.name AS course, S.id AS subject_id, S.name AS subject
            FROM courses C
            INNER JOIN subjects S ON S.course = C.id
            WHERE C.id = $1\
        `);

    const { rows: subjects } = await query(queryText, [course]);

    return {
        success: true,
        message: `${subjects.length} rows returned from database`,
        subjects
    }
}

/**
 * 
 * @param {number} subject Subject ID
 * @returns {Promise<{success: boolean, message: string, tutors: Tutor[]}>} Response object
 */
export async function getTutorsBySubject(subject = 0) {
    const queryText =
        (`\
            SELECT id, name, school, level_of_education, bio  FROM eduhope_user
	            WHERE is_tutor = TRUE and tutor_terms = 'yes' AND $1 = ANY(subjects)\
        `);

    const { rows: tutors } = await query(queryText, [subject]);

    return {
        success: true,
        message: `${tutors.length} rows returned from database`,
        tutors
    }
}