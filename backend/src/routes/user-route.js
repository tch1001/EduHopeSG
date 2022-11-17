import { Router } from "express";
import RouteError from "../classes/RouteError.js";
import * as userService from "../services/user-service.js";

const router = Router();

router.post("/", (req, res) => {
    userService.create(req.body)
        .then(() => res.status(201).send({}))
        .catch(err => {
            const routeError = new RouteError(err, req.originalUrl)

            res.status(routeError.status || 400)
                .send(routeError)
                .end();
        })
})

router.post("/login", (req, res) => {
    // userService
})

router.get("/:id", (req, res) => {

})

export default router;