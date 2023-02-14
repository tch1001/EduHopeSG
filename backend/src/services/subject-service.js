import { query } from "../utils/database.js";

/**
 * Convert an array of subjects to names
 * @param {number[]} subjects List of subject IDs
 * @returns {Promise<Subject[]>} Array of subject(s) information
 */
export async function getSubjects(subjects) {
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

export async function getSubjectsByID(subjects) {
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

    return {
        success: true,
        message: `${subjects.length} rows returned from database`,
        subjects: data.filter((d) => d)
    };
}

/**
 * Get subjects by stream
 * @param {number} course Course ID
 * @returns {Promise<Subject[]>}
 */
export async function getSubjectsByCourse(course) {
    const queryText =
        (`\
        SELECT C.id AS course_id, C.name AS course, S.id AS subject_id, S.name AS subject
            FROM courses C
            INNER JOIN subjects S ON S.course = C.id
            WHERE C.id = $1
        `);

    const { rows: subjects } = await query(queryText, [course]);
    
    return {
        success: true,
        message: `${subjects.length} rows returned from database`,
        subjects
    }
}