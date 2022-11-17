
import errorMappings from "../error_mapping.json" assert { type: "json" };

/**
 * @typedef {object} errorMapping
 * @property {number} status Status code for the API to response with
 * @property {string} name Long error name
 * @property {string} message Descriptive error message
 * @property {string} details Steps to fix request and avoid the error
 */

/**
 * @typedef {errorMapping[]} errorMappings
 */

/**
 * Detailed service error for exceptional error handling
 * @module ServiceError
 */
export default class ServiceError extends Error {
    /**
     * Detailed service error for exceptional error handling
     * @param {string} errorCode Unique identifier for error codes
     * @param {string=} errorMessage Descriptive error message
     */
    constructor(errorCode, errorMessage) {
        /** @type {errorMapping} */
        const errorMapping = errorMappings[errorCode];
        const message = errorMapping.message || errorMessage;
        const { status, name, details } = errorMapping;

        super(message);

        /** @type {number} Status code for the API to response with */
        this.status = status;

        /** @type {string} Unique identifier for error codes */
        this.code = errorCode;

        /** @type {string} Long error name */
        this.name = name;

        /** @type {string} Descriptive error message */
        this.message = message;

        /** @type {string} Steps to fix request and avoid the error*/
        this.details = details;

        this.timestamp = new Date();
    }
}