import { Router } from "express";
import RouteError from "../classes/RouteError.js";
import * as userService from "../services/user-service.js";

const router = Router();

function standardRouteErrorCallback(res, req, err) {
    const routeError = new RouteError(err, req.originalUrl)

    res.status(routeError.status || 400)
        .send(routeError)
        .end();
}

router.post("/", (req, res) => {
    userService.create(req.body)
        .then(() => res.status(201).send({}))
        .catch((err) => standardRouteErrorCallback(res, req, err));
})

router.post("/login", (req, res) => {
    userService.login(req.body?.email, req.body?.password)
        .then(result => res.status(200).send(result).end())
        .catch((err) => standardRouteErrorCallback(res, req, err));
})

router.get("/:id", (req, res) => {

})

export default router;