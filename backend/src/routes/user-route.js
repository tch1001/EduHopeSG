import { Router } from "express";
import RouteError from "../utils/RouteError.js";
import * as userService from "../services/user-service.js";

const router = Router();

router.post("/", (req, res) => {
    userService.createUser(req.body)
        .then(() => res.status(201).send({}))
        .catch(err => {
            const routeError = new RouteError(req.originalUrl, "", err)

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