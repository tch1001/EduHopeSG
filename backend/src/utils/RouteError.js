import nodePackage from "../../package.json" assert { type: "json" };
import ServiceError from "./ServiceError";

export default class RouteError extends ServiceError {
    /**
     * Detailed route error class
     * @param {string} path Route request path
     * @param {string} details Steps to fix request and avoid the error
     * @param {ServiceError} serviceError Built on top of ServiceError
     */
    constructor(path, details, serviceError) {
        super(serviceError.code, serviceError.name, serviceError.details);

        this.details = details;
        this.path = path;
        this.apiVersion = nodePackage.version
    }
}