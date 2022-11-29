export default function parseSQL(query, values) {
    if (!query) return;

    const hydratedConditions = [];

    const operation = query.split(" ")[0].trim();

    // only handling select operation
    if (operation !== "SELECT") return {
        operation,
        table: undefined,
        conditions: undefined,
        fields: undefined
    };

    const table = query.toUpperCase().split(" FROM ")[1].split(" WHERE ")[0].toLowerCase();
    const fields = query.substring(operation.length, query.indexOf(table) - " FROM ".length);
    const conditions = query.substring(query.indexOf(table) + table.length + " WHERE ".length);

    conditions.trim().split(", ").forEach((condition, i) => {
        const result = condition.replace(`$${i + 1}`, () => values[i]);
        hydratedConditions.push(result);
    })

    return {
        operation,
        table,
        conditions: hydratedConditions,
        fields: fields.trim().split(", ")
    }
}