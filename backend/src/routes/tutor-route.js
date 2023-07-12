import { Router } from "express";
import RouteError from "../classes/RouteError.js";
import { standardRouteErrorCallback } from "../index.js";
import { verifyAuthentication } from "../services/user-service.js";
import * as tutorService from "../services/tutor-service.js";
import * as userService from "../services/user-service.js";

const router = Router();

router.patch("/", (req, res) => {
    const user = userService.verifyAuthentication(req.cookies.user);

    if (!user) {
        return standardRouteErrorCallback(
            res, req, new RouteError("user-unauthenticated", req.originalUrl)
        );
    }

    tutorService.update(user.payload.id, req.body)
        .then(response => res.status(200).send(response))
        .catch((err) => standardRouteErrorCallback(res, req, err));
})

router.get("/reject/:tuteeID", (req, res) => {
    const user = verifyAuthentication(req.cookies.user);

    if (!user) {
        return standardRouteErrorCallback(
            res, req, new RouteError("user-unauthenticated", req.originalUrl)
        );
    }

    const relationshipID = req.query.relationshipID

    tutorService.rejectTutee(relationshipID, req?.query?.reason || "Reason not provided")
        .then(response => res.status(200).send(response))
        .catch((err) => standardRouteErrorCallback(res, req, err));
})

router.get("/accept/:tuteeID", (req, res) => {
    const user = verifyAuthentication(req.cookies.user);

    if (!user) {
        return standardRouteErrorCallback(
            res, req, new RouteError("user-unauthenticated", req.originalUrl)
        );
    }

    const relationshipID = req.query.relationshipID

    tutorService.acceptTutee(relationshipID)
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

    tutorService.removeTutee(
        req.query.relationshipID,
        req.body.reason || "Reason not provided"
    )
        .then(response => res.status(200).send(response))
        .catch((err) => standardRouteErrorCallback(res, req, err));
})

router.get("/relationships", (req, res) => {
    const user = verifyAuthentication(req.cookies.user);
    
    if (!user) {
        return standardRouteErrorCallback(
            res, req, new RouteError("user-unauthenticated", req.originalUrl)
        );
    }

    tutorService.getTutees(user.payload.id)
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

    tutorService.removeAllTutees(user.payload.id, req.body.reason || "Reason not provided")
        .then(response => res.status(200).send(response))
        .catch((err) => standardRouteErrorCallback(res, req, err));
})

export default router;