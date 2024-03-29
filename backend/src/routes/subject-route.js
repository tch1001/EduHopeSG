import { Router } from "express";
import RouteError from "../classes/RouteError.js";
import { standardRouteErrorCallback } from "../index.js";
import * as subjectService from "../services/subject-service.js";
import * as userService from "../services/user-service.js"

const router = Router();

router.get("/", (req, res) => {
    subjectService.getCourses()
        .then((response) => res.status(200).send(response))
        .catch((err) => standardRouteErrorCallback(res, req, err));
});

router.get("/all", (req, res) => {
    subjectService.getSubjects()
        .then((response) => res.status(200).send(response))
        .catch((err) => standardRouteErrorCallback(res, req, err));
});

router.get("/:course", (req, res) => {
    const { course } = req.params;

    if (!course) {
        const error = new RouteError("missing-arguments", req.originalUrl);
        return standardRouteErrorCallback(res, req, error);
    }

    subjectService.getCourseSubjects(course)
        .then((response) => res.status(200).send(response))
        .catch((err) => standardRouteErrorCallback(res, req, err));
});

router.get("/:course/:subject/tutors", (req, res) => {
    const { course, subject } = req.params;

    if (!course || !subject) {
        const error = new RouteError("missing-arguments", req.originalUrl);
        return standardRouteErrorCallback(res, req, error);
    }

    const user = userService.verifyAuthentication(req.cookies.user); // If logged in, get the user id

    subjectService.getTutorsByCourseAndSubjectName(course, subject, user?.payload?.id || "")
        .then((response) => res.status(200).send(response))
        .catch((err) => standardRouteErrorCallback(res, req, err));
});

export default router;
