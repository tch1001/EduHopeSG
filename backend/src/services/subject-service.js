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
        SELECT S.id, S.level || ' ' || S.name AS name, C.name AS course
        FROM subject as S
        INNER JOIN course C ON S.course = C.id
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
 * @returns {Promise<{success: boolean, message: string, tutors: Tutor[], course: Course, subject: Subject}>}
 */
export async function getTutorsByCourseAndSubjectName(courseName, subjectName) {
    const queryText = `
    SELECT u.id, u.given_name, u.family_name, u.school, u.level_of_education, u.bio AS description,
    t.commitment_end, t.preferred_communications, t.average_response_time, s.id AS subject_id, s.level || ' ' || s.name AS subject
    FROM (
        SELECT ttr.tutor AS tutor_id, COUNT(ttr.tutor) AS num_tutees
        FROM tutee_tutor_relationship AS ttr 
        WHERE ttr.status = 'ACCEPTED'
        GROUP BY ttr.tutor   
    ) AS filtered_tutor_ids
    RIGHT JOIN tutor AS t on t.user_id = filtered_tutor_ids.tutor_id 
        AND filtered_tutor_ids.num_tutees < t.tutee_limit
        AND t.commitment_end >= now()   
    LEFT JOIN subject AS s ON s.id = ANY(t.subjects) AND similarity(s.level || ' ' || s.name, $2) >= 0.7
    LEFT JOIN course AS c ON c.id = s.course AND c.name = $1
    LEFT JOIN eduhope_user AS u ON u.id = t.user_id   
    ORDER BY num_tutees     
    `
    const { rows: tutors } = await query(queryText, [courseName, subjectName]);
    tutors.forEach(tutor => {
        tutor.preferred_communications = tutor.preferred_communications.slice(1,-1).split(",") // Converts postgres array to js array
                                                                        .map(type=>type.replace(/"/g, ''))
    });

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
            c.name AS short_name, 
            COUNT(t.id)::integer AS tutor_count
        FROM course c
        LEFT JOIN subject s ON c.id = s.course
        LEFT JOIN tutor t ON s.id = ANY(t.subjects)
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
        SELECT s.id AS subject_id, s.level || ' ' || s.name AS name, COUNT(t.id)::integer AS tutor_count,
            LOWER(REGEXP_REPLACE(REGEXP_REPLACE(s.name,  '\\s*\\(([^\\)]*)\\)\\s*$', ' \\1'), '[\\W,]+', '-', 'g')) AS short_name
        FROM subject s
        LEFT JOIN tutor t ON s.id = ANY(t.subjects)
        LEFT JOIN course c ON s.course = c.id
        WHERE c.name = $1
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
        FROM course c
        WHERE c.name = $1
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
        SELECT s.level || ' ' || s.name AS name, s.id,
            LOWER(REGEXP_REPLACE(REGEXP_REPLACE(s.name,  '\\s*\\(([^\\)]*)\\)\\s*$', ' \\1'), '[\\W,]+', '-', 'g')) AS short_name
        FROM subject s
        WHERE similarity(s.level || ' ' || s.name, $1) >= 0.7;
    `;

    const { rows: subjects } = await query(queryText, [subjectName]);
    return subjects[0];
}