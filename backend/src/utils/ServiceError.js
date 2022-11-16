export default class ServiceError extends Error {
    /**
     * Detailed service error for exceptional error handling
     * @param {string} errorCode Unique identifier for error codes
     * @param {string} errorName Long error name
     * @param {string} errorMessage Descriptive error message
     * @param {string} errorDetails Steps to fix request and avoid the error
     */
    constructor(errorCode, errorName, errorMessage, errorDetails) {
        super(errorMessage);

        this.code = errorCode;
        this.name = errorName;
        this.details = errorDetails;
    }
}