import { Router } from "express";
import { standardRouteErrorCallback } from "../index.js";
import RouteError from "../classes/RouteError.js";
import * as userService from "../services/user-service.js";

const router = Router();

router.post("/", (req, res) => {
    userService.create(req.body)
        .then(() => res.status(201).send({}))
        .catch((err) => standardRouteErrorCallback(res, req, err));
})

router.post("/login", (req, res) => {
    userService.login(req.body?.email, req.body?.password)
        .then(({ cookie, expireAt, ...payload }) => {
            const cookieOptions = {
                expires: new Date(expireAt * 1000),
                secure: process.env.NODE_ENV === "production"
            }

            res.status(200)
                .cookie("user", cookie, cookieOptions)
                .send(payload)
                .end();
        })
        .catch((err) => standardRouteErrorCallback(res, req, err));
})

router.post("/signup", (req, res) => {
    userService.signup(req.body)
        .then(() => res.status(201).send({}))
        .catch((err) => standardRouteErrorCallback(res, req, err));
})


router.patch("/", (req, res) => {
    const user = userService.verifyAuthentication(req.cookies.user);

    if (!user) {
        return standardRouteErrorCallback(
            res, req, new RouteError("user-unauthenticated", req.originalUrl)
        );
    }

    userService.update(user.payload.id, req.body)
        .then(response => res.status(200).send(response))
        .catch((err) => standardRouteErrorCallback(res, req, err));
})

router.patch("/password", (req, res) => {
    const user = userService.verifyAuthentication(req.cookies.user);

    if (!user) {
        return standardRouteErrorCallback(
            res, req, new RouteError("user-unauthenticated", req.originalUrl)
        );
    }

    const { password, new_password } = req.body;

    userService.updatePassword(user.payload.id, password, new_password)
        .then(response => res.status(200).send(response))
        .catch((err) => standardRouteErrorCallback(res, req, err));
})

router.post("/tutor", (req, res) => {
    const user = userService.verifyAuthentication(req.cookies.user);

    if (!user) {
        return standardRouteErrorCallback(
            res, req, new RouteError("user-unauthenticated", req.originalUrl)
        );
    }

    userService.registerTutor(user.payload.id, req.body)
        .then(response => res.status(200).send(response))
        .catch((err) => standardRouteErrorCallback(res, req, err));
})

export default router;