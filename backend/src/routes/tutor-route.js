import { Router } from "express";
import RouteError from "../classes/RouteError.js";
import { standardRouteErrorCallback } from "../index.js";
import { verifyAuthentication } from "../services/user-service.js";
import * as tutorService from "../services/tutor-service.js";

const router = Router();

router.get("/reject/:tuteeID", (req, res) => {
    const user = verifyAuthentication(req.cookies.user);

    if (!user) {
        return standardRouteErrorCallback(
            res, req, new RouteError("user-unauthenticated", req.originalUrl)
        );
    }

    const relationshipID = `${req.params.tuteeID}:${user.payload.id}`

    tutorService.rejectTutee(relationshipID)
        .then(response => res.status(200).send(response))
        .catch((err) => standardRouteErrorCallback(res, req, err));
})

router.delete("/relationship/:tuteeID", (req, res) => {
    const user = verifyAuthentication(req.cookies.user);

    if (!user) {
        return standardRouteErrorCallback(
            res, req, new RouteError("user-unauthenticated", req.originalUrl)
        );
    }

    tutorService.removeTutee(req.params.tuteeID, user.payload.id)
        .then(response => res.status(200).send(response))
        .catch((err) => standardRouteErrorCallback(res, req, err));
})

router.delete("/relationships", (req, res) => {
    const user = verifyAuthentication(req.cookies.user);

    if (!user) {
        return standardRouteErrorCallback(
            res, req, new RouteError("user-unauthenticated", req.originalUrl)
        );
    }

    tutorService.removeAllTutees(user.payload.id)
        .then(response => res.status(200).send(response))
        .catch((err) => standardRouteErrorCallback(res, req, err));
})

export default router;