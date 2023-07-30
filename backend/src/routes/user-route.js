import { Router } from "express";
import { standardRouteErrorCallback } from "../index.js";
import RouteError from "../classes/RouteError.js";
import * as userService from "../services/user-service.js";
import * as tutorService from "../services/tutor-service.js";

const USER_FIELDS = "given_name family_name email school level_of_education telegram bio"
const TUTOR_FIELDS = "subjects tutee_limit commitment_end preferred_communications description average_response_time"

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

router.get("/logout", (req, res) => {
    res.status(204)
        .clearCookie("user")
        .end();
})

router.post("/signup", (req, res) => {
    userService.signup(req.body)
        .then(() => res.status(201).send({}))
        .catch((err) => standardRouteErrorCallback(res, req, err));
})

router.get("/profile", async (req, res) => {
    const user = userService.verifyAuthentication(req.cookies.user);

    if (!user) {
        return standardRouteErrorCallback(
            res, req, new RouteError("user-unauthenticated", req.originalUrl)
        );
    }

    try {

        const userData = await userService.getByID(user.payload.id, USER_FIELDS)
        userData.email = userService.decrypt(userData.email)

        const tutorData = await tutorService.getByID(user.payload.id, TUTOR_FIELDS)
        if (tutorData) {
            tutorData.preferred_communications = tutorData.preferred_communications.slice(1, -1).split(",") // Converts postgres array to js array
                .map(type => type.replace(/"/g, ''))
        }

        res.status(200).send({ userData, tutorData })

    } catch (err) {
        standardRouteErrorCallback(res, req, err)
    }

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

router.get("/reset-password", (req, res) => {
    const { email, originalURL } = req.query

    userService.sendResetPasswordLink(email, originalURL)
        .then(response => res.status(200).send(response))
        .catch((err) => standardRouteErrorCallback(res, req, err));
})

router.patch("/password", (req, res) => {
    const { password, new_password, passwordResetToken } = req.body;

    if (password) {
        // If password is reset via edit profile page
        var user = userService.verifyAuthentication(req.cookies.user);

        if (!user) {
            return standardRouteErrorCallback(
                res, req, new RouteError("user-unauthenticated", req.originalUrl)
            );
        }

        userService.updatePassword(user.payload.id, password, new_password)
            .then(response => res.status(200).send(response))
            .catch((err) => standardRouteErrorCallback(res, req, err));

    } else if (passwordResetToken) {
        // If password is reset via the password reset link sent to a person's email
        const user = userService.verifyPasswordResetToken(passwordResetToken)

        if (!user) {
            return standardRouteErrorCallback(
                res, req, new RouteError("invalid-password-reset-token", req.originalUrl)
            );
        }

        userService.updatePasswordUsingToken(user.payload.id, new_password)
            .then(response => res.status(200).send(response))
            .catch((err) => standardRouteErrorCallback(res, req, err));

    } else {
        return standardRouteErrorCallback(
            res, req, new RouteError("error", req.originalUrl)
        );
    }
})

router.post("/tutor", (req, res) => {
    userService.registerTutor(req.body)
        .then(response => res.status(200).send(response))
        .catch((err) => standardRouteErrorCallback(res, req, err));
})

export default router;
