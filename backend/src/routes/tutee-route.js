import { Router } from "express";
import RouteError from "../classes/RouteError.js";
import { standardRouteErrorCallback } from "../index.js";
import { verifyAuthentication } from "../services/user-service.js";
import * as tuteeService from "../services/tutee-service.js";
import * as userService from "../services/user-service.js";

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

router.get("/relationships", (req, res) => {
    const user = verifyAuthentication(req.cookies.user);
    
    if (!user) {
        return standardRouteErrorCallback(
            res, req, new RouteError("user-unauthenticated", req.originalUrl)
        );
    }

    tuteeService.getTutors(user.payload.id)
        .then(response => {
            response.forEach(tutor => {
                tutor.email = userService.decrypt(tutor.email) 
                tutor.preferred_communications = tutor.preferred_communications.slice(1,-1).split(",")
            });            
            return response
        })
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

    tuteeService.withdrawTutor(req.query.relationshipID)
        .then(response => res.status(200).send(response))
        .catch((err) => standardRouteErrorCallback(res, req, err));
})

export default router;