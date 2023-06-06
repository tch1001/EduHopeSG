import { query } from "../utils/database.js";

/**
 * @typedef {Object} Subject
 * @property {string} id Subject's ID in the database
 * @property {string} name Subject name
 * @property {string} course Subject's course ID
 */

/**
 * @typedef {Object} Course
 * @property {string} course_id Course ID in the database
 * @property {string} course_name Course name in the database
 * @property {number} tutor_count Sum of tutors tutoring for each course subject
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
 * @property {string} description Tutor's biography/teaching style/description
 */

/**
 * Convert an array of subjects to names
 * @param {number[]} subjects List of subject IDs
 * @returns {Promise<Subject[]>} Array of subject(s) information
 */
export async function getSubjects(subjects = []) {
    const queryText = `
        SELECT S.id, S.name, C.name AS course
        FROM subjects as S
        INNER JOIN courses C ON S.course = C.id
        WHERE S.id = $1;
    `;

    const queries = subjects.map(subjectsID => query(queryText, [subjectsID]));
    const results = await Promise.all(queries);
    const data = results.map(({ rows }) => rows[0]);

    return data.filter((d) => d);
}

/**
 * Get tutors by course and subject names instead of IDs
 * 
 * NOTE: I feel that this is a janky way of doing things
 * might need to redesign the columns for subjects/courses
 * in the future.
 * 
 * @param {string} courseName Name of the course (e.g. 'a level')
 * @param {string} subjectName Name of the subject (e.g. 'chemistry')
 * @returns {Promise<{success: boolean, message: string, tutors: Tutor[]}>}
 */
export async function getTutorsByCourseAndSubjectName(courseName, subjectName) {
    const queryText = `
        SELECT u.id, u.name, u.school, u.level_of_education, u.bio AS description
        FROM eduhope_user AS u
        JOIN subjects AS s ON s.id = ANY(u.subjects)
        JOIN courses AS c ON c.id = s.course
        WHERE u.is_tutor = TRUE
            AND u.tutor_terms = 'yes'
            AND similarity(c.name, $1) >= 0.5
            AND similarity(s.name, $2) >= 0.2;
    `;

    const { rows: tutors } = await query(queryText, [courseName, subjectName]);

    return {
        success: true,
        message: `${tutors.length} rows returned from database`,
        tutors
    }
}

/**
 * Get courses with the number of subjects available from tutors (tutor_count)
 * 
 * @returns {Promise<{success: boolean, message: string, courses: Course[]}>}
 */
export async function getCourses() {
    const queryText = `
        SELECT c.id AS course_id, c.name AS course_name, COUNT(u.id) AS tutor_count
        FROM courses c
        LEFT JOIN subjects s ON c.id = s.course
        LEFT JOIN eduhope_user u ON s.id = ANY(u.subjects) AND u.is_tutor = TRUE
        GROUP BY c.id, c.name
        ORDER BY c.id;
    `;

    const { rows: courses } = await query(queryText);

    return {
        success: true,
        message: `${courses.length} rows returned from database`,
        courses
    }
}

/**
 * Gets all subjects by the course name with the number of available tutors
 * @param {string} courseName Name of the course (e.g. 'o level')
 * @returns {Promise<{ success: boolean, message: string, courses: Course[] }>}
 */
export async function getCourseSubjects(courseName) {
    const queryText = `
        SELECT s.id, s.name, COUNT(u.id) AS tutor_count
        FROM subjects s
        LEFT JOIN eduhope_user u ON s.id = ANY(u.subjects) AND u.is_tutor = true
        LEFT JOIN courses c ON s.course = c.id
        WHERE similarity(c.name, $1) >= 0.5
        GROUP BY s.id, s.name
        ORDER BY s.id;
    `;

    const { rows: courses } = await query(queryText, [courseName]);

    return {
        success: true,
        message: `${courses.length} rows returned from database`,
        courses
    }
}