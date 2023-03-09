"use strict";

import { Router } from "express";
import RouteError from "../classes/RouteError.js";
import { standardRouteErrorCallback } from "../index.js";
import { verifyAuthentication } from "../services/user-service.js";
import * as tuteeService from "../services/tutee-service.js";

const router = Router();

router.post("/relationship/:tutorID", (req, res) => {
    const user = verifyAuthentication(req.cookies.user);

    if (!user) {
        return standardRouteErrorCallback(
            res, req, new RouteError("user-unauthenticated", req.originalUrl)
        );
    }

    tuteeService.requestTutor(user.payload.id, req.params.tutorID, req.body?.subjects)
        .then(response => res.status(200).send(response))
        .catch((err) => standardRouteErrorCallback(res, req, err));
})

router.delete("/relationship/:tutorID", (req, res) => {
    const user = verifyAuthentication(req.cookies.user);

    if (!user) {
        return standardRouteErrorCallback(
            res, req, new RouteError("user-unauthenticated", req.originalUrl)
        );
    }

    tuteeService.withdrawTutor(`${user.payload.id}:${req.params.tutorID}`)
        .then(response => res.status(200).send(response))
        .catch((err) => standardRouteErrorCallback(res, req, err));
})

export default router;