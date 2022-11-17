export default class ServiceError extends Error {
    /**
     * Detailed service error for exceptional error handling
     * @param {number} statusCode Status code for the API to response with
     * @param {string} errorCode Unique identifier for error codes
     * @param {string} errorName Long error name
     * @param {string} errorMessage Descriptive error message
     * @param {string} errorDetails Steps to fix request and avoid the error
     */
    constructor(statusCode, errorCode, errorName, errorMessage, errorDetails) {
        super();

        this.status = statusCode;
        this.code = errorCode;
        this.name = errorName;
        this.details = errorDetails;
        this.message = errorMessage

        this.timestamp = new Date();
    }
}