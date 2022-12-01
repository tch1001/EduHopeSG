import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
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
            from: `EduhopeSG Notifications <notifications@${process.env.MAILGUN_DOMAIN}>`,
            "o:testmode": process.env.NODE_ENV === "development",
            "o:tracking": "yes",
            "o:tracking-clicks": "yes",
            "o:tracking-opens": "yes",
            subject, text, html,
        })

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

    const message = "You have a new tuition request";
    const acceptLink = `${process.env.WEBSITE_URL}/api/v0.1/tutor/accept/${tutee.id}`;
    const declineLink = `${process.env.WEBSITE_URL}/api/v0.1/tutor/reject/${tutee.id}`;

    // TODO: User reporting
    const reportLink = `${process.env.WEBSITE_URL}/how-to-report`;

    const text = [
        `${message} from ${tutee.name} for ${formattedSubjects}.\n\n`,
        `To accept, click ${acceptLink}\n`,
        `To decline, click ${declineLink}`
    ]

    // preparing HTML file
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const PATH = resolve(__dirname, "../assets/notification-cta.html");

    let hydratedHTML = await fs.readFile(PATH, { encoding: "utf-8" });

    hydratedHTML = hydratedHTML.replace(/{{ NOTIFICATION_BANNER }}/gi, message);
    hydratedHTML = hydratedHTML.replace(/{{ NOTIFICATION_TEXT }}/gi, [
        `${message} from <strong>${tutee.name}</strong> for <u>${formattedSubjects}</u>.\n\n`,
        "Please consider the following for the above tuition request:",
        "<ul><li>You have enough bandwidth to take on another tutee</li>",
        `<li>Who needs help with <strong>${subjectIDs.length}</strong> subjects</li>`,
        "<li>You will reply their questions within a reasonable time frame</li>",
        "<li>Enjoy teaching the subjects and helping out a fellow student :)</li></ul>",
        `<br/>As always, stay safe and <a href=${reportLink}>report any inappropriateness`,
        "to our site admins</a> from any user on the platform to safeguard their privacy and security.",
        "<br/><br/>Thank you for volunteering your time and effort,"
    ].join(" ").replace(/\\n/gi, "<br/>"));
    hydratedHTML = hydratedHTML.replace(/{{ PRIMARY_CTA }}/gi, "Accept");
    hydratedHTML = hydratedHTML.replace(/{{ SECONDARY_CTA }}/gi, "Decline");
    hydratedHTML = hydratedHTML.replace(/{{ PRIMARY_CTA_HREF }}/gi, acceptLink);
    hydratedHTML = hydratedHTML.replace(/{{ SECONDARY_CTA_HREF }}/gi, declineLink);

    // TODO: make a "manage system notifications" thing, and also email verification
    hydratedHTML = hydratedHTML.replace(/{{ UNSUB_HREF }}/gi, "");

    return await sendEmail(
        UserService.decrypt(tutor.email.trim().toString()),
        `EduhopeSG: ${message}!`,
        text.join(" "),
        hydratedHTML
    );
}

export async function notifyTuitionSubjectChange(tutee, tutor, newSubjectIDs) {
    try {
        if (!tutee || !tutor) throw new ServiceError("missing-arguments");

        const newSubjects = await UserService.getSubjects(newSubjectIDs);
        const formattedSubjects = newSubjects.map(d => `${d.course} ${d.name}`).join(", ");

        // NOTE: should we change the status of the relationship back to 0
        // when the tutee changes subjects
        const message = `${tutee.name} changed tuition subjects`;

        // TODO: User reporting
        const reportLink = `${process.env.WEBSITE_URL}/how-to-report`;

        // preparing HTML file
        const __dirname = dirname(fileURLToPath(import.meta.url));
        const PATH = resolve(__dirname, "../assets/notification.html");

        let hydratedHTML = await fs.readFile(PATH, { encoding: "utf-8" });

        hydratedHTML = hydratedHTML.replace(/{{ NOTIFICATION_BANNER }}/gi, message);
        hydratedHTML = hydratedHTML.replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `${message}! <strong>${tutee.name}</strong> is now requesting for <u>${formattedSubjects}</u>`,
            "to be tutored by you. If these changes are not suitable for you, please message your tutee",
            "such that both of you are agreeable to a tuition plan.",
            `<br/><br/>As always, stay safe and <a href=${reportLink}>report any inappropriateness`,
            "to our site admins</a> from any user on the platform to safeguard their privacy and security.",
            "<br/><br/>Thank you for volunteering your time and effort,"
        ].join(" "));

        // TODO: make a "manage system notifications" thing, and also email verification
        hydratedHTML = hydratedHTML.replace(/{{ UNSUB_HREF }}/gi, "");

        return await sendEmail(
            UserService.decrypt(tutor.email.trim().toString()),
            `EduhopeSG: ${message}!`,
            "",
            hydratedHTML
        );
    } catch (err) { console.error(err) }
}