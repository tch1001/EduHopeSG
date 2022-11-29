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
