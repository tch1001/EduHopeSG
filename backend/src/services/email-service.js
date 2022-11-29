import FormData from "form-data";
import Mailgun from "mailgun.js";
import validator from "validator";
import * as UserService from "./user-service.js";
import ServiceError from "../classes/ServiceError.js";
import log from "../utils/logging.js";

const { isEmail } = validator;

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
    username: process.env.MAILGUN_USERNAME,
    key: process.env.MAILGUN_API_KEY
})

/**
 * 1. Tutor receives an email request from the system with the option to decline or accept
 * 2. Tutors receive an email about this change
 * 3. Email tutee/tutor for testimonial
 */

/**
 * 
 * @param {string} email Email address to send to
 * @param {string} subject Email subject
 * @param {string} text Email text fallback when HTML not working/don't have
 * @param {string} html HTML to render in user's browser or email client application
 * @returns {{ id?: string; message?: string; status: number; details?: string; }}
 */
async function sendEmail(email, subject, text, html) {
    if (!isEmail(email)) throw new ServiceError("user-invalid-email")

    try {
        const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
            to: email,
            subject, text, html,
            "o:testmode": process.env.NODE_ENV === "development",
            "o:tracking": "yes",
            "o:tracking-clicks": "yes",
            "o:tracking-opens": "yes"
        })

        console.log(response);
        return response;
    } catch (err) {
        log.error({
            message: "Error occurred while sending email",
            parameters: [email, subject, text, html],
            err
        });
    }
}

/**
 * Sends an email request to Tutor and system notification to let Tutee know
 * of request
 * @param {UserService.BasicUser} tutee Tutee object
 * @param {UserService.User} tutor Tutor object
 * @param {number[]} subjectIDs Array of subjects IDs
 */
export async function sendTuitionRequest(tutee, tutor, subjectIDs) {
    if (!tutee || !tutor) throw new ServiceError("missing-arguments");

    const subjects = await UserService.getSubjects(subjectIDs);
    const formattedSubjects = subjects.map(d => `${d.course} ${d.name}`).join(", ");

    const text = [
        `You have a tuition request from ${tutee.name} for ${formattedSubjects}.\n\n`,
        `To accept, click http://localhost:5000/api/v0.1/tutor/accept/${tutee.id}\n`,
        `To reject, click http://localhost:5000/api/v0.1/tutor/reject/${tutee.id}`
    ]

    return await sendEmail(
        UserService.decrypt(tutor.email.trim().toString()),
        "EduhopeSG: You have a new tuition request!",
        text.join(" ")
    )
}