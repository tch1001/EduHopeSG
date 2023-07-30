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

const reportLink = `mailto:eduhopesg@gmail.com`;
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
 * @param {number} subjectID subjects ID from
 * @returns {EmailResponse}
 */
export async function sendTuitionRequest(tutee, tutor, subjectID, relationshipID) {
    if (!tutee || !tutor || !subjectID) throw new ServiceError("missing-arguments");

    const subjectArray = await getSubjectsByIDs([subjectID]);

    const message = "You have a new tuition request";
    const acceptLink = `${process.env.WEBSITE_URL}/api/v0.1/tutor/accept/${tutee.id}?relationshipID=${relationshipID}`;
    const declineLink = `${process.env.WEBSITE_URL}/api/v0.1/tutor/reject/${tutee.id}?relationshipID=${relationshipID}`;

    // preparing HTML file
    const hydratedHTML = TemplateNotificationCTA
        .replace(/{{ NOTIFICATION_BANNER }}/gi, message)
        .replace(/{{ PRIMARY_CTA }}/gi, "Accept")
        .replace(/{{ SECONDARY_CTA }}/gi, "Decline")
        .replace(/{{ PRIMARY_CTA_HREF }}/gi, acceptLink)
        .replace(/{{ SECONDARY_CTA_HREF }}/gi, declineLink)
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `${message} from <strong>${tutee.given_name} ${tutee.family_name}</strong> for <strong>${subjectArray[0].name}</strong>.<br/><br/>`,
            "Please consider the following for the above tuition request:",
            "<ul><li>You have enough bandwidth to take on another tutee (if you currently have any)</li>",
            `<li>Who needs help with <strong>${subjectArray[0].name}</strong> subjects</li>`,
            "<li>You will reply their questions within a reasonable time frame</li>",
            "<li>Enjoy teaching the subjects and helping out a fellow student :)</li></ul>",
            `<br/>As always, stay safe and <a href=${reportLink}>report any inappropriateness`,
            "to our site admins</a> from any user on the platform to safeguard their privacy and security.",
            "<br/><br/>Thank you for volunteering your time and effort,"
        ].join(" "));

    //console.log(hydratedHTML)
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
 * @param {number} subjectID subjects ID from
 * @param {string} reason Tutor's reason for rejecting
 * @returns {EmailResponse}
 */
export async function notifyTutorRequestCancellation(tutee, tutor, subjectID) {
    if (!tutee || !tutor || !subjectID) throw new ServiceError("missing-arguments");

    const subjectArray = await getSubjectsByIDs([subjectID]);
    const message = `${tutee.given_name} ${tutee.family_name} has withdrawn his tuition request for ${subjectArray[0].name}`;

    // preparing HTML file
    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, message)
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `${message}.`
        ].join(" "));
    //console.log(hydratedHTML)
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
 * @param {number} subjectID subjects ID from
 * @param {string} reason Tutor's reason for stopping
 * @returns {EmailResponse}
 */
export async function notifyTutorRemoval(tutee, tutor, subjectID) {
    if (!tutee || !tutor || !subjectID) throw new ServiceError("missing-arguments");

    const subjectArray = await getSubjectsByIDs([subjectID]);
    const message = `Sorry, ${tutee.given_name} ${tutee.family_name} has decided to stop being tutored by you for ${subjectArray[0].name}`;

    // preparing HTML file
    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, message)
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `${message}.`,
            "They may have stopped being tutored by you for the following reasons:",
            "<ul><li>They may have decided to prioritise other subjects</li>",
            `<li>They may have improved sufficiently to study on their own</li><ul/>`,
            "<br/><br/>Thank you for your contributions!,"
        ].join(" "));

    //console.log(hydratedHTML)
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
 * @param {number} subjectID subjects ID from
 * @returns {EmailResponse}
 */
export async function notifyTuteeAcceptance(tutee, tutor, subjectID) {
    if (!tutee || !tutor || !subjectID) throw new ServiceError("missing-arguments");

    const subjectArray = await getSubjectsByIDs([subjectID]);
    const message = `Congratulations, your tuition request for ${subjectArray[0].name} by ${tutor.given_name} ${tutor.family_name} has been accepted`;

    // preparing HTML file
    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, message)
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `${message}!`,
            `<br/><br/>As always, stay safe and <a href=${reportLink}>report any inappropriateness`,
            "to our site admins</a> from any user on the platform to safeguard their privacy and security.",
            "<br/><br/>Thank you for using our platform,"
        ].join(" "));
    //console.log(hydratedHTML)
    return await sendEmail(
        UserService.decrypt(tutee.email.trim().toString()),
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
 * @param {number} subjectID subjects ID from
 * @param {string} reason Tutor's reason for rejecting
 * @returns {EmailResponse}
 */
export async function notifyTuteeDeclination(tutee, tutor, subjectID, reason) {
    if (!tutee || !tutor || !subjectID || !reason) throw new ServiceError("missing-arguments");

    const subjectArray = await getSubjectsByIDs([subjectID]);
    const message = `Sorry, your tuition request for ${subjectArray[0].name} by ${tutor.given_name} ${tutor.family_name} has been declined`;

    // preparing HTML file
    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, message)
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `${message}.`,
            `<br/>Your tutor's reason: ${reason}`,
            "<br/><br/>Please keep in mind that our tutors are volunteer tutors.",
            "They may have rejected your request for the following reasons:",
            "<ul><li>They may not have enough bandwidth to take on another tutee at the moment</li>",
            `<li>You may have requested too many subjects for the tutor</li>`,
            "<li>The tutor cannot make it via your preferred communications channel</li><ul/>",
            "<br/>Wishing you the best in finding your next tutor.",
            "<br/><br/>Thank you for using our platform,"
        ].join(" "));
    //console.log(hydratedHTML)
    return await sendEmail(
        UserService.decrypt(tutee.email.trim().toString()),
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
 * @param {number} subjectID subjects ID from
 * @param {string} reason Tutor's reason for stopping
 * @returns {EmailResponse}
 */
export async function notifyTuteeRemoval(tutee, tutor, subjectID, reason) {
    if (!tutee || !tutor || !subjectID || !reason) throw new ServiceError("missing-arguments");

    const subjectArray = await getSubjectsByIDs([subjectID]);
    const message = `Sorry, ${tutor.given_name} ${tutor.family_name} has decided to stop tutoring you for ${subjectArray[0].name}`;

    // preparing HTML file
    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, message)
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `${message}.`,
            `<br/>Your tutor's reason: ${reason}`,
            "<br/><br/>Please keep in mind that our tutors are volunteer tutors.",
            "They may have stopped tutoring you for the following reasons:",
            "<ul><li>They may not have enough bandwidth to take on another tutee at the moment</li>",
            `<li>You may have requested too many subjects for the tutor</li>`,
            "<li>The tutor cannot make it via your preferred communications channel</li><ul/>",
            "<br/>Wishing you the best in finding your next tutor.",
            "<br/><br/>Thank you for using our platform,"
        ].join(" "));

    //console.log(hydratedHTML)
    return await sendEmail(
        UserService.decrypt(tutee.email.trim().toString()),
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
            `Dear ${user.given_name},`,
            "This email is to notify you that your account password have",
            "been changed. If this is an unauthorised change and you were not",
            `aware of this, please contact our support team via <a href=${reportLink}>eduhopesg@gmail.com</a>`
        ].join(" "));

    return await sendEmail(
        UserService.decrypt(user.email.trim().toString()),
        `EduhopeSG: Account password has been updated`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
}

/**
 * Email user about email address changes
 * @param {string} newEmail To email
 * @returns {EmailResponse}
 */
export async function sendEmailUpdateNotification(email, newEmail) {
    if (!email) throw new ServiceError("missing-arguments");

    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, "Account email changed")
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            "This email is to notify you that your account email has",
            `been changed to ${newEmail}. If this is an unauthorised change and you were not`,
            `aware of this, please contact our support team via <a href=${reportLink}>eduhopesg@gmail.com</a>`
        ].join(" "));

    return await sendEmail(
        email,
        `EduhopeSG: Account email has been updated`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
}


/**
 * Email user about email address changes
 * @param {string} newEmail To email
 * @returns {EmailResponse}
 */
export async function sendEmailResetPasswordLink(email, passwordResetToken, originalURL) {
    if (!email) throw new ServiceError("missing-arguments");

    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, "Account password reset requested")
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `You have requested to reset your password. <br/><br/>`,
            `Here is the <a href="${process.env.WEBSITE_URL}/reset-password?token=${passwordResetToken}&originalURL=${originalURL}">password reset link</a><br/><br/>`,
            "Do note that it expires in 10 minutes! Upon expiry, you will have to request for another password reset link."
        ].join(" "));

    //console.log(hydratedHTML)
    return await sendEmail(
        email,
        `EduhopeSG: Account password reset requested"`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
}