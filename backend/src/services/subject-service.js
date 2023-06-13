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
 * @property {string} short_name Janky workaround for URI-friendly names
 * @property {number} tutor_count Sum of tutors tutoring for each course subject
 */

/**
 * @typedef {Object} CourseSubject
 * @property {string} subject_id Subject's ID in the database
 * @property {string} course_id Subject's course ID in the database
 * @property {string} name Subject name
 * @property {string} course Subject's course name
 * @property {number} tutor_count Number of tutors tutoring the subject
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
    // TODO: query tutors that are no longer in commitment (check date is more than commitment_end),
    // and that tutors are still under their tutee_limit. If either checks fail, don't
    // display the tutor
    const queryText = `
        SELECT u.id, u.name, u.school, u.level_of_education, u.bio AS description,
            u.commitment_end, u.preferred_communications, u.avg_response_time
        FROM eduhope_user AS u
        JOIN subjects AS s ON s.id = ANY(u.subjects)
        JOIN courses AS c ON c.id = s.course
        WHERE u.is_tutor = TRUE
            AND u.tutor_terms = 'yes'
            AND similarity(c.name, $1) >= 0.5
            AND similarity(s.name, $2) >= 0.7;
    `;

    const { rows: tutors } = await query(queryText, [courseName, subjectName]);
    const course = await getCourseInfoByName(courseName);
    const subject = await getSubjectInfoByName(subjectName);

    return {
        success: true,
        message: `${tutors.length} rows returned from database`,
        tutors,
        course,
        subject
    }
}

/**
 * Get courses with the number of subjects available from tutors (tutor_count)
 * @returns {Promise<{success: boolean, message: string, courses: Course[]}>}
 */
export async function getCourses() {
    const queryText = `
        SELECT c.id AS course_id, c.name AS course_name,
            LOWER(TRANSLATE(REGEXP_REPLACE(c.name, 'GCE ([AON]) Levels', '\\1 level', 'gi'), ' ', '-')) AS short_name, 
            COUNT(u.id)::integer AS tutor_count
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
 * @returns {Promise<{ success: boolean, message: string, subjects: CourseSubject[], course: Course }>}
 */
export async function getCourseSubjects(courseName) {
    const queryText = `
        SELECT s.id AS subject_id, s.name, COUNT(u.id)::integer AS tutor_count,
            LOWER(REGEXP_REPLACE(REGEXP_REPLACE(s.name,  '\\s*\\(([^\\)]*)\\)\\s*$', ' \\1'), '[\\W,]+', '-', 'g')) AS short_name
        FROM subjects s
        LEFT JOIN eduhope_user u ON s.id = ANY(u.subjects) AND u.is_tutor = true
        LEFT JOIN courses c ON s.course = c.id
        WHERE similarity(c.name, $1) >= 0.5
        GROUP BY s.id, c.id, s.name
        ORDER BY s.id;
    `;

    const { rows: subjects } = await query(queryText, [courseName]);
    const course = await getCourseInfoByName(courseName);

    return {
        success: true,
        message: `${subjects.length} rows returned from database`,
        subjects,
        course
    }
}

/**
 * Get course information by name
 * @param {string} courseName Name of the course
 * @returns {Promise<Course>}
 */
async function getCourseInfoByName(courseName) {
    const queryText = `
        SELECT c.id AS course_id, c.name AS course_name,
            LOWER(TRANSLATE(REGEXP_REPLACE(c.name, 'GCE ([AON]) Levels', '\\1 level', 'gi'), ' ', '-')) AS short_name
        FROM courses c
        WHERE similarity(c.name, $1) >= 0.5;
    `;

    const { rows: courses } = await query(queryText, [courseName]);
    return courses[0];
}

/**
 * Get subject information by name
 * @param {string} subjectName Name of the subject
 * @returns {Promise<Subject>}
 */
async function getSubjectInfoByName(subjectName) {
    const queryText = `
        SELECT s.name, s.id,
            LOWER(REGEXP_REPLACE(REGEXP_REPLACE(s.name,  '\\s*\\(([^\\)]*)\\)\\s*$', ' \\1'), '[\\W,]+', '-', 'g')) AS short_name
        FROM subjects s
        WHERE similarity(s.name, $1) >= 0.7;
    `;

    const { rows: subjects } = await query(queryText, [subjectName]);
    return subjects[0];
}