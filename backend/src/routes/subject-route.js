import { Router } from "express";
import RouteError from "../classes/RouteError.js";
import { standardRouteErrorCallback } from "../index.js";
import * as subjectService from "../services/subject-service.js";

const router = Router();

router.post("/", (req, res) => {
    const { subjects } = req.body;

    if (!subjects || !subjects.length) {
        const error = new RouteError("missing-arguments", req.originalUrl);
        return standardRouteErrorCallback(res, req, error);
    }

    subjectService.getSubjectsByID(subjects)
        .then((response) => res.status(200).send(response))
        .catch((err) => standardRouteErrorCallback(res, req, err));
});

router.get("/course/:course", (req, res) => {
    const { course } = req.params;

    if (!course) {
        const error = new RouteError("missing-arguments", req.originalUrl);
        return standardRouteErrorCallback(res, req, error);
    }

    subjectService.getSubjectsByCourse(course)
        .then((response) => res.status(200).send(response))
        .catch((err) => standardRouteErrorCallback(res, req, err));
})

// more detailed
// router.get("/:id");

export default router;
