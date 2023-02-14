/**
 * Convert an array of subjects to names
 * @param {number[]} subjects List of subject IDs
 * @returns {Promise<Subject[]>} Array of subject(s) information
 */
export async function getSubjects(subjects) {
    const queryText = `
    SELECT subjects.id, subjects.name, courses.name AS course
    FROM subjects
    INNER JOIN courses ON courses.id = subjects.course
    WHERE subjects.id = $1;
    `;

    const queries = subjects.map(subjectsID => query(queryText, [subjectsID]));
    const results = await Promise.all(queries);
    const data = results.map(({ rows }) => rows[0]);

    return data.filter((d) => d);
}
