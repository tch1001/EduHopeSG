"use strict";

import nodePackage from "../../package.json" assert { type: "json" };
import ServiceError from "./ServiceError.js";

export default class RouteError extends ServiceError {
    /**
     * Detailed route error class
     * @param {ServiceError|string} error Either a ServiceError object or the error code
     * @param {string} path Route request path
     */
    constructor(error, path) {
        super(error?.code ? error.code : error);

        this.path = path;
        this.apiVersion = nodePackage.version
    }
}