import FormData from "form-data";
import Mailgun from "mailgun.js";
import { isEmail } from "validator";
import ServiceError from "../classes/ServiceError.js";
import { BasicUser, User, decrypt, getSubjects } from "./user-service.js";
import log from "../utils/logging.js";

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
 * @param {BasicUser} tutee Tutee object
 * @param {User} tutor Tutor object
 * @param {number[]} subjectIDs Array of subjects IDs
 */
export async function sendTuitionRequest(tutee, tutor, subjectIDs) {
    if (!tutee || !tutor) throw new ServiceError("missing-arguments");

    const subjects = getSubjects(subjectIDs);
    const formattedSubjects = subjects.map(d => `${d.name} at ${d.course}`).join(", ");

    const text = [
        `You have a tuition request from ${tutee.name} for ${formattedSubjects}.\n\n`,
        `To accept, click http://localhost:5000/api/v0.1/tutor/accecpt/${tutee.id}\n`,
        `To reject, click http://localhost:5000/api/v0.1/tutor/reject/${tutee.id}`
    ]

    console.log(
        decrypt(tutor.email), `EduhopeSG: You have a new tuition request!`,
        text.join(" ")
    )
}