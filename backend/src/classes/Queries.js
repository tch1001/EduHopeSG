"use strict";

import { query } from "../utils/database.js";

export default class Queries {
    /**
     * @typedef {object} QueriesQuery
     * @property {string} text Query text
    * @property {any[]} values Query parameters
    */

    /** @type {QueriesQuery[]} */
    #queue = [];

    /**
     * Add a query
     * @param {string} text Query text
     * @param {any[]} values Query parameters
     */
    add(text, values = []) {
        if (values.length) this.#queue.push({ text, values });
        else this.#queue.push(text);
    }

    #convert() {
        /** @type {string[]} */
        const texts = [];
        const params = [];
        let parameterCount = 1;

        this.#queue.forEach(({ text, values }) => {
            const newText = text.replace(/\$\d/gm, () => `$${parameterCount++}`);
            texts.push(newText);

            if (values) params.push(...values);
        })

        return { query: texts.join(";\n"), values: params }
    }

    execute() {
        const convertedQuery = this.#convert();
        console.log(convertedQuery.query);
        console.log(convertedQuery.values);
        return query(convertedQuery.query, convertedQuery.values);
    }
}