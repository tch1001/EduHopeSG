import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import FormData from "form-data";
import Mailgun from "mailgun.js";
import validator from "validator";
import { compile } from "html-to-text";

import ServiceError from "../classes/ServiceError.js";
import log from "../utils/logging.js";

import * as UserService from "./user-service.js";
import { getSubjectsByIDs } from "./subject-service.js";

const { isEmail } = validator;

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
    username: process.env.MAILGUN_USERNAME,
    key: process.env.MAILGUN_API_KEY
})

// HTML templates
const htmlToText = compile({ wordwrap: 80 });
const __dirname = dirname(fileURLToPath(import.meta.url));
const TemplateNotificationCTA = fs.readFileSync(resolve(__dirname, "../assets/notification-cta.html"), { encoding: "utf-8" });
const TemplateNotification = fs.readFileSync(resolve(__dirname, "../assets/notification.html"), { encoding: "utf-8" });

/**
 * TODO: update website URL links accordingly to front end changes. These are just (un)planned URLs
 * they are unplanned and some may not work before production release. Update before and double
 * check before pushing to production for a public release.
 */

// TODO: User reporting and "Manage notifications" page, and email verification

const reportLink = `${process.env.WEBSITE_URL}/how-to-report`;
const unsubLink = `${process.env.WEBSITE_URL}/settings/notifications`;

/**
 * @typedef {object} EmailResponse
 * @property {string?} id
 * @property {string?} message
 * @property {number} status
 * @property {string?} details
 */

/**
 * 
 * @param {string} email Email address to send to
 * @param {string} subject Email subject
 * @param {string} text Email text fallback when HTML not working/don't have
 * @param {string} html HTML to render in user's browser or email client application
 * @returns {EmailResponse}
 */
async function sendEmail(email, subject, text, html) {
    if (!isEmail(email)) throw new ServiceError("user-invalid-email")

    try {
        const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
            to: email,
            from: `EduhopeSG Notifications <notifications@${process.env.MAILGUN_DOMAIN}>`,
            // "o:testmode": process.env.NODE_ENV === "development",
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
 * @param {number[]} subjectIDs Array of subjects IDss from TickNinja
 * @returns {EmailResponse}
 */
export async function sendTuitionRequest(tutee, tutor, subjectIDs) {
    if (!tutee || !tutor || !subjectIDs) throw new ServiceError("missing-arguments");

    const subjects = await getSubjectsByIDs(subjectIDs);
    const formattedSubjects = subjects.map(d => `${d.course} ${d.name}`).join(", ");

    const message = "You have a new tuition request";
    const acceptLink = `${process.env.WEBSITE_URL}/api/v0.1/tutor/accept/${tutee.id}`;
    const declineLink = `${process.env.WEBSITE_URL}/api/v0.1/tutor/reject/${tutee.id}`;

    // preparing HTML file
    const hydratedHTML = TemplateNotificationCTA
        .replace(/{{ NOTIFICATION_BANNER }}/gi, message)
        .replace(/{{ PRIMARY_CTA }}/gi, "Accept")
        .replace(/{{ SECONDARY_CTA }}/gi, "Decline")
        .replace(/{{ PRIMARY_CTA_HREF }}/gi, acceptLink)
        .replace(/{{ SECONDARY_CTA_HREF }}/gi, declineLink)
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `${message} from <strong>${tutee.name}</strong> for <u>${formattedSubjects}</u>.<br/><br/>`,
            "Please consider the following for the above tuition request:",
            "<ul><li>You have enough bandwidth to take on another tutee</li>",
            `<li>Who needs help with <strong>${subjectIDs.length}</strong> subjects</li>`,
            "<li>You will reply their questions within a reasonable time frame</li>",
            "<li>Enjoy teaching the subjects and helping out a fellow student :)</li></ul>",
            `<br/>As always, stay safe and <a href=${reportLink}>report any inappropriateness`,
            "to our site admins</a> from any user on the platform to safeguard their privacy and security.",
            "<br/><br/>Thank you for volunteering your time and effort,"
        ].join(" "));

    return await sendEmail(
        UserService.decrypt(tutor.email.trim().toString()),
        `EduhopeSG: ${message}!`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
}

/**
 * Sends an email notification to Tutor about subject changes in
 * a tutee-tutor relationship
 * @param {UserService.BasicUser} tutee Tutee object
 * @param {UserService.User} tutor Tutor object
 * @param {number[]} newSubjectIDs Array of subject IDs from TickNinja
 * @returns {EmailResponse}
 */
export async function notifyTuitionSubjectChange(tutee, tutor, newSubjectIDs) {
    if (!tutee || !tutor || !subjectIDs) throw new ServiceError("missing-arguments");

    // NOTE: should we change the status of the relationship back to 0
    // when the tutee changes subjects
    const message = "A tutee changed subjects";
    const newSubjects = await getSubjectsByIDs(newSubjectIDs);
    const formattedSubjects = newSubjects.map(d => `${d.course} ${d.name}`).join(", ");

    // preparing HTML file
    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, message)
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `${message}! <strong>${tutee.name}</strong> is now requesting for <u>${formattedSubjects}</u>.`,
            "to be tutored by you.<br/><br/>",
            "If these changes are not suitable for you, please message your tutee",
            "such that both of you are agreeable to a tuition plan/schedule.",
            `<br/><br/>As always, stay safe and <a href=${reportLink}>report any inappropriateness`,
            "to our site admins</a> from any user on the platform to safeguard their privacy and security.",
            "<br/><br/>Thank you for volunteering your time and effort,"
        ].join(" "));

    return await sendEmail(
        UserService.decrypt(tutor.email.trim().toString()),
        `EduhopeSG: ${message}!`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
}

/**
 * Sends an email notification to Tutee about being accepted by
 * the request tutor and subjects
 * @param {UserService.BasicUser} tutee Tutee object
 * @param {UserService.User} tutor Tutor object
 * @param {number[]} subjectIDs Array of subjects IDss from TickNinja
 * @returns {EmailResponse}
 */
export async function notifyTuteeAcceptance(tutee, tutor, subjectIDs) {
    if (!tutee || !tutor || !subjectIDs) throw new ServiceError("missing-arguments");

    const message = "Congratulations, are you enrolled";
    const subjects = await getSubjectsByIDs(subjectIDs);
    const formattedSubjects = subjects.map(d => `<li>${d.course} ${d.name}</li>`).join("\n");

    // preparing HTML file
    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, message)
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `${message}! <strong>${tutor.name}</strong> has accepted your tuition request`,
            `for the following subjects: <ol>${formattedSubjects}</ol>`
                `<br/><br/>As always, stay safe and <a href=${reportLink}>report any inappropriateness`,
            "to our site admins</a> from any user on the platform to safeguard their privacy and security.",
            "<br/><br/>Thank you for using our platform,"
        ].join(" "));

    return await sendEmail(
        UserService.decrypt(tutor.email.trim().toString()),
        `EduhopeSG: ${message}!`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
}

/**
 * Sends an email notification to Tutee about being declined by
 * the request tutor and subjects
 * @param {UserService.BasicUser} tutee Tutee object
 * @param {UserService.User} tutor Tutor object
 * @param {number[]} subjectIDs Array of subjects IDss from TickNinja
 * @param {string} reason Tutor's reason for rejecting
 * @returns {EmailResponse}
 */
export async function notifyTuteeDeclination(tutee, tutor, subjectIDs, reason) {
    if (!tutee || !tutor || !subjectIDs || !reason) throw new ServiceError("missing-arguments");

    const message = "Sorry, your tuition request has been declined";
    const subjects = await getSubjectsByIDs(subjectIDs);
    const formattedSubjects = subjects.map(d => `<li>${d.course} ${d.name}</li>`).join("\n");

    // preparing HTML file
    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, message)
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `${message}. <strong>${tutor.name}</strong> has rejected your tuition request`,
            `for the following subjects: <ol>${formattedSubjects}</ol>`,
            `<br/>Your tutor's reason: ${reason}`,
            "<br/><br/>Please keep in mind that our tutors are volunteer tutors.",
            "They may have rejected your request for the following reasons:",
            "<ul><li>They may not have enough bandwidth to take on another tutee at the moment</li>",
            `<li>You may have requested too many subjects for the tutor</li>`,
            "<li>The tutor cannot make it via your preferred communications channel</li><ul/>",
            "<br/>Wishing you the best in finding your next tutor.",
            "<br/><br/>Thank you for using our platform,"
        ].join(" "));

    return await sendEmail(
        UserService.decrypt(tutor.email.trim().toString()),
        `EduhopeSG: ${message}!`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
}

/**
 * Sends an email notification to Tutee about being removed by
 * the request tutor
 * @param {UserService.BasicUser} tutee Tutee object
 * @param {UserService.User} tutor Tutor object
 * @param {number[]} subjectIDs Array of subjects IDss from TickNinja
 * @param {string} reason Tutor's reason for stopping
 * @returns {EmailResponse}
 */
export async function notifyTuteeRemoval(tutee, tutor, subjectIDs, reason) {
    if (!tutee || !tutor || !subjectIDs || !reason) throw new ServiceError("missing-arguments");

    const message = "Sorry, your tutor has decided to stop tutoring you";
    const subjects = await getSubjectsByIDs(subjectIDs);
    const formattedSubjects = subjects.map(d => `<li>${d.course} ${d.name}</li>`).join("\n");

    // preparing HTML file
    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, message)
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `${message}. <strong>${tutor.name}</strong> removed you from their list of tutees.`,
            `You were being taught: <ol>${formattedSubjects}</ol>`,
            `<br/>Your tutor's reason: ${reason}`,
            "<br/><br/>Please keep in mind that our tutors are volunteer tutors.",
            "They may have stopped tutoring you for the following reasons:",
            "<ul><li>They may not have enough bandwidth to take on another tutee at the moment</li>",
            `<li>You may have requested too many subjects for the tutor</li>`,
            "<li>The tutor cannot make it via your preferred communications channel</li><ul/>",
            "<br/>Wishing you the best in finding your next tutor.",
            "<br/><br/>Thank you for using our platform,"
        ].join(" "));

    return await sendEmail(
        UserService.decrypt(tutor.email.trim().toString()),
        `EduhopeSG: ${message}!`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
}

/**
 * Email user about account changes
 * @param {UserService.User} user User object
 * @returns {EmailResponse}
 */
export async function notifyPasswordChange(user) {
    if (!user) throw new ServiceError("missing-arguments");

    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, "Account password changed")
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `Dear ${user.name},`,
            "This email is to notify you that your account password have",
            "been changed. If this is an unauthorised change and you were not",
            `aware of this, please <a href="${process.env.WEBSITE_URL}/reset-password">reset your password</a>`
        ].join(" "));

    return await sendEmail(
        UserService.decrypt(user.email.trim().toString()),
        `EduhopeSG: Account password has been updated`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
}

/**
 * Email new email address to confirm transaction, and update user record
 * @param {string} newEmail To email
 * @param {string} token Token for new email address
 * @returns {EmailResponse}
 */
export async function sendEmailUpdateConfirmation(newEmail, token) {
    if (!newEmail || !token) throw new ServiceError("missing-arguments");

    const hydratedHTML = TemplateNotificationCTA
        .replace(/{{ NOTIFICATION_BANNER }}/gi, "Confirm new email address")
        .replace(/{{ PRIMARY_CTA }}/gi, "Confirm")
        .replace(/{{ SECONDARY_CTA }}/gi, "Ignore")
        .replace(/{{ PRIMARY_CTA_HREF }}/gi, `${process.env.WEBSITE_URL}/user/settings?email_confirmation=${token}`)
        .replace(/{{ SECONDARY_CTA_HREF }}/gi, '#')
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            "Confirm your new email address by clicking on the 'confirm' button. Another",
            "email will be sent to you shortly once you have confirmed the changes. Beware of",
            "phishing and, if this is an unauthorised change and you did not request for this change,",
            `please <a href="${process.env.WEBSITE_URL}/reset-password">reset your password</a>`,
        ].join(" "));

    return await sendEmail(
        newEmail,
        `EduhopeSG: Verify email update`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
}

/**
 * Email user about email address changes
 * @param {string} newEmail To email
 * @returns {EmailResponse}
 */
export async function sendEmailUpdateNotification(email) {
    if (!email) throw new ServiceError("missing-arguments");

    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, "Account email changed")
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            "This email is to notify you that your account email have",
            "been changed. If this is an unauthorised change and you were not",
            `aware of this, please <a href="${process.env.WEBSITE_URL}/reset-password">reset your password</a>`,
            "and contact our support team"
        ].join(" "));

    return await sendEmail(
        email,
        `EduhopeSG: Account email has been updated`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
}