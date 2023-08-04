import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import FormData from "form-data";
import Mailgun from "mailgun.js";
import validator from "validator";
import { compile } from "html-to-text";

import ServiceError from "../classes/ServiceError.js";
import log from "../utils/logging.js";

import * as userService from "./user-service.js";
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
const unsubLink = `${process.env.WEBSITE_URL}/settings/notifications`; // inactive as the unsubscribe element has been temporarily hidden in the html templates

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
 * Email user about the successful creation of an account using this email
 * @param {string} email email
 * @returns {EmailResponse}
 */
export async function notifyUserCreation(email, is_tutor) {
    if (!email) throw new ServiceError("missing-arguments");

    if (is_tutor) {
        var title = "Thank you for volunteering with EduhopeSG!"
        var message = [
            `${title} <br/><br/>`,
            `Whenever a student requests for your tutoring services, you will receive an email notification from us! Subsequently, you can choose to either accept or decline the request.<br/><br/>`,
            `Should you choose to accept the request, you will receive an email with your tutee's contact information, which you can use to arrange tutoring sessions with them! This contact information will also be available in the <a href="${process.env.WEBSITE_URL}/manage-tutees">My Tutees</a> page of our website.<br/><br/>`,
            `<b>Important note:</b> Tutoring requests will be automatically declined if you do not accept/decline them within 5 days. As such, please respond to tutoring requests asap!<br/><br/>`,
            `Visit the <a href="${process.env.WEBSITE_URL}/manage-tutees">My Tutees</a> page to view the requests for your tutoring services and/or your current tutees.<br/><br/>`,
            `Visit the <a href="${process.env.WEBSITE_URL}/edit-profile">Edit Profile</a> page to update your Personal Particulars or Tutor Settings. <br/><br/>`,
            `If you have any queries, feel free to contact us via our <a href=${reportLink}>email</a>. Thank you for volunteering!<br/><br/>`
        ]
    } else {
        var title = "Welcome to EduhopeSG!"
        var message = [
            `${title} <br/><br/>`,
            `Visit the <a href="${process.env.WEBSITE_URL}/subjects">Find a Tutor</a> page to browse the available tutors and request for one that offers the subject you need help with!<br/><br/>`,
            `If your requested tutor accepts your request, you will receive an email notification from us! Subsequently, you can contact them via their contact information provided in the email!<br/><br/>`,
            `If your requested tutor is unavailable, we will let you know about it via email too!<br/><br/>`,
            `<b>Important note:</b> At any one time, you can only request for 1 tutor per subject. If you want to request for another tutor of the same subject, you must cancel the existing request first via the <a href="${process.env.WEBSITE_URL}/manage-tutees">My Tutees</a> page!<br/><br/>`,
            `Visit the <a href="${process.env.WEBSITE_URL}/edit-profile">Edit Profile</a> page to update your Personal Particulars. <br/><br/>`,
            `If you have any queries, feel free to contact us via our <a href=${reportLink}>email</a>. Thank you for joining EduhopeSG!<br/><br/>`
        ]        
    }

    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, title)
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, message.join(" "));

    console.log(hydratedHTML)
    /*
    return await sendEmail(
        email,
        `EduhopeSG: Welcome to EduhopeSG!"`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
    */
}

/**
 * Sends an email request to Tutor and system notification to let Tutee know
 * of request
 * @param {userService.BasicUser} tutee Tutee object
 * @param {userService.User} tutor Tutor object
 * @param {number} subjectID subjects ID from
 * @returns {EmailResponse}
 */
export async function sendTuitionRequest(tutee, tutor, subjectID, relationshipID) {
    if (!tutee || !tutor || !subjectID) throw new ServiceError("missing-arguments");

    const subjectArray = await getSubjectsByIDs([subjectID]);

    const message = "You have a new tuition request";

    // preparing HTML file
    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, message)
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `<p>${message} from <strong>${tutee.given_name} ${tutee.family_name}</strong> for <strong>${subjectArray[0].name}</strong>.<br/><br/>`,
            "Please consider the following for the above tuition request:</p>",
            "<ul><li>You have enough bandwidth to take on another tutee (if you currently have any)</li>",
            `<li>Who needs help with <strong>${subjectArray[0].name}</strong> subjects</li>`,
            "<li>You will reply their questions within a reasonable time frame</li>",
            "<li>Enjoy teaching the subjects and helping out a fellow student :)</li></ul>",
            `<p><br/>Please visit the <a href="${process.env.WEBSITE_URL}/manage-tutees">My Tutees</a> page to <strong>Accept/Decline</strong> this request!`,
            `<br/><br/>As always, stay safe and <a href=${reportLink}>report any inappropriateness`,
            "to our site admins</a> from any user on the platform to safeguard their privacy and security.",
            "<br/><br/>Thank you for volunteering your time and effort!</p>"
        ].join(" "));

    console.log(hydratedHTML)
    /*
    return await sendEmail(
        userService.decrypt(tutor.email),
        `EduhopeSG: ${message}!`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
    */
}

/**
 * Sends an email notification to Tutee about being declined by
 * the request tutor and subjects
 * @param {userService.BasicUser} tutee Tutee object
 * @param {userService.User} tutor Tutor object
 * @param {number} subjectID subjects ID from
 * @param {string} reason Tutor's reason for rejecting
 * @returns {EmailResponse}
 */
export async function notifyTutorRequestCancellation(tutee, tutor, subjectID) {
    if (!tutee || !tutor || !subjectID) throw new ServiceError("missing-arguments");

    const subjectArray = await getSubjectsByIDs([subjectID]);
    const message = `<strong>${tutee.given_name} ${tutee.family_name}</strong> has withdrawn his tuition request for <strong>${subjectArray[0].name}</strong>`;

    // preparing HTML file
    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, message)
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `${message}.<br/><br/>`
        ].join(" "));
    console.log(hydratedHTML)
    /*
    return await sendEmail(
        userService.decrypt(tutor.email),
        `EduhopeSG: ${message}!`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
    */
}

/**
 * Sends an email notification to Tutee about being removed by
 * the request tutor
 * @param {userService.BasicUser} tutee Tutee object
 * @param {userService.User} tutor Tutor object
 * @param {number} subjectID subjects ID from
 * @param {string} reason Tutor's reason for stopping
 * @returns {EmailResponse}
 */
export async function notifyTutorRemoval(tutee, tutor, subjectID) {
    if (!tutee || !tutor || !subjectID) throw new ServiceError("missing-arguments");

    const subjectArray = await getSubjectsByIDs([subjectID]);
    const message = `Sorry, <strong>${tutee.given_name} ${tutee.family_name}</strong> has decided to stop being tutored by you for <strong>${subjectArray[0].name}</strong>`;

    // preparing HTML file
    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, message)
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `<p>${message}.`,
            "<br/><br/>They may have stopped being tutored by you for the following reasons:</p>",
            "<ul><li>They may have decided to prioritise other subjects</li>",
            `<li>They may have improved sufficiently to study on their own</li></ul>`,
            "<p><br/>Thank you for your contributions!</p>"
        ].join(" "));

    console.log(hydratedHTML)
    /*
    return await sendEmail(
        userService.decrypt(tutor.email),
        `EduhopeSG: ${message}!`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
    */
}

/**
 * Sends an email reminder to the tutor about accepting
 * the tutee's request
 * @param {userService.BasicUser} tutee Tutee object
 * @param {userService.User} tutor Tutor object
 * @param {number} subjectID subjects ID from
 * @returns {EmailResponse}
 */
export async function remindTuteeAcceptance(tutee, tutor, subjectID) {
    if (!tutee || !tutor || !subjectID) throw new ServiceError("missing-arguments");

    const subjectArray = await getSubjectsByIDs([subjectID]);
    const message = `Thank you for accepting <strong>${tutee.given_name} ${tutee.family_name}'s</strong> tutoring request for <strong>${subjectArray[0].name}</strong>`;

    // preparing HTML file
    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, message)
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `<p>${message}!`,
            `<br/><br/>Please contact ${tutee.given_name} ${tutee.family_name} to arrange tutoring sessions with them!</p>`,
            `<ul><li>${tutee.telegram} (Telegram)</li>`,
            `<li>${userService.decrypt(tutee.email)} (Email)</li></ul>`,
            `<p><br/>As always, stay safe and <a href=${reportLink}>report any inappropriateness`,
            "to our site admins</a> from any user on the platform to safeguard their privacy and security.",
            "<br/><br/>Thank you for using our platform!</p>"
        ].join(" "));
    console.log(hydratedHTML)
    /*
    return await sendEmail(
        userService.decrypt(tutor.email),
        `EduhopeSG: ${message}!`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
    */
}

/**
 * Sends an email notification to Tutee about being accepted by
 * the request tutor and subjects
 * @param {userService.BasicUser} tutee Tutee object
 * @param {userService.User} tutor Tutor object
 * @param {number} subjectID subjects ID from
 * @returns {EmailResponse}
 */
export async function notifyTuteeAcceptance(tutee, tutor, subjectID) {
    if (!tutee || !tutor || !subjectID) throw new ServiceError("missing-arguments");

    const subjectArray = await getSubjectsByIDs([subjectID]);
    const message = `Congratulations, your tuition request for <strong>${subjectArray[0].name}</strong> by <strong>${tutor.given_name} ${tutor.family_name}</strong> has been accepted`;

    // preparing HTML file
    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, message)
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `<p>${message}!`,
            `<br/><br/>Please contact ${tutor.given_name} ${tutor.family_name} to arrange tutoring sessions with them!</p>`,
            `<ul><li>${tutor.telegram} (Telegram)</li>`,
            `<li>${userService.decrypt(tutor.email)} (Email)</li></ul>`,
            `<p><br/>As always, stay safe and <a href=${reportLink}>report any inappropriateness`,
            "to our site admins</a> from any user on the platform to safeguard their privacy and security.",
            "<br/><br/>Thank you for using our platform!</p>"
        ].join(" "));
    console.log(hydratedHTML)
    /*
    return await sendEmail(
        userService.decrypt(tutee.email),
        `EduhopeSG: ${message}!`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
    */
}

/**
 * Sends an email notification to Tutee about being declined by
 * the request tutor and subjects
 * @param {userService.BasicUser} tutee Tutee object
 * @param {userService.User} tutor Tutor object
 * @param {number} subjectID subjects ID from
 * @param {string} reason Tutor's reason for rejecting
 * @returns {EmailResponse}
 */
export async function notifyTuteeDeclination(tutee, tutor, subjectID, reason = "Unavailable") {
    if (!tutee || !tutor || !subjectID || !reason) throw new ServiceError("missing-arguments");

    const subjectArray = await getSubjectsByIDs([subjectID]);
    const message = `Sorry, your tuition request for <strong>${subjectArray[0].name}</strong> by <strong>${tutor.given_name} ${tutor.family_name}</strong> has been declined`;

    // preparing HTML file
    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, message)
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `<p>${message}.`,
            `<br/><br/>Your tutor's reason: ${reason}`,
            "<br/><br/>Please keep in mind that our tutors are volunteer tutors.",
            "They may have rejected your request for the following reasons:</p>",
            "<ul><li>They may not have enough bandwidth to take on another tutee at the moment</li>",
            `<li>They may prefer to teach another subject</li></ul>`,
            `<p><br/>We recommend that you <a href="${process.env.WEBSITE_URL}/subjects/${subjectArray[0].course}/${subjectArray[0].name}">request for another tutor!</a>`,
            "<br/><br/>Thank you for using our platform!</p>"
        ].join(" "));
    console.log(hydratedHTML)
    /*
    return await sendEmail(
        userService.decrypt(tutee.email),
        `EduhopeSG: ${message}!`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
    */
}

/**
 * Sends an email notification to Tutee about being removed by
 * the request tutor
 * @param {userService.BasicUser} tutee Tutee object
 * @param {userService.User} tutor Tutor object
 * @param {number} subjectID subjects ID from
 * @param {string} reason Tutor's reason for stopping
 * @returns {EmailResponse}
 */
export async function notifyTuteeRemoval(tutee, tutor, subjectID, reason) {
    if (!tutee || !tutor || !subjectID || !reason) throw new ServiceError("missing-arguments");

    const subjectArray = await getSubjectsByIDs([subjectID]);
    const message = `Sorry, <strong>${tutor.given_name} ${tutor.family_name}</strong> has decided to stop tutoring you for <strong>${subjectArray[0].name}</strong>`;

    // preparing HTML file
    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, message)
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `<p>${message}.`,
            `<br/><br/>Your tutor's reason: ${reason}`,
            "<br/><br/>Please keep in mind that our tutors are volunteer tutors.",
            "They may have stopped tutoring you for the following reasons:</p>",
            "<ul><li>They may want to focus on their own school work</li>",
            `<li>They may have started working part time and are thus unable to continue tutoring you</li></ul>`,
            `<p><br/>We recommend that you <a href="${process.env.WEBSITE_URL}/subjects/${subjectArray[0].course}/${subjectArray[0].name}">request for another tutor!</a>`,
            "<br/><br/>Thank you for using our platform!</p>"
        ].join(" "));

    console.log(hydratedHTML)
    /*
    return await sendEmail(
        userService.decrypt(tutee.email),
        `EduhopeSG: ${message}!`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
    */
}

/**
 * Email user about account changes
 * @param {userService.User} user User object
 * @returns {EmailResponse}
 */
export async function notifyPasswordChange(user) {
    if (!user) throw new ServiceError("missing-arguments");

    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, "Account password changed")
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `Dear ${user.given_name},`,
            "This email is to notify you that your account password has",
            "been changed. If this is an unauthorised change and you were not",
            `aware of this, please contact our support team via <a href=${reportLink}>eduhopesg@gmail.com</a>`
        ].join(" "));

    console.log(hydratedHTML)
    /*
    return await sendEmail(
        userService.decrypt(user.email),
        `EduhopeSG: Account password has been updated`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
    */
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
            `been changed to <b>${newEmail}</b>. If this is an unauthorised change and you were not`,
            `aware of this, please contact our support team via <a href=${reportLink}>eduhopesg@gmail.com</a><br/><br/>`
        ].join(" "));

    console.log(hydratedHTML)
    /*
    return await sendEmail(
        email,
        `EduhopeSG: Account email has been updated`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
    */
}


/**
 * Email user about email address changes
 * @param {string} newEmail To email
 * @param {string} passwordResetToken jwt
 * @param {string} originalURL original url that user was on
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
            "Do note that it expires in 15 minutes! Upon expiry, you will have to request for another password reset link."
        ].join(" "));

    console.log(hydratedHTML)
    /*
    return await sendEmail(
        email,
        `EduhopeSG: Account password reset requested"`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
    */
}

/**
 * Sends an email notification to Tutee about being declined by
 * the request tutor and subjects
 * @param {userService.BasicUser} tutee Tutee object
 * @param {userService.User} tutor Tutor object
 * @param {number} subjectID subjects ID from
 * @returns {EmailResponse}
 */
export async function emailRemindTutorAcceptDecline(tutee, tutor, subjectID, timeToExpiry) {
    if (!tutee || !tutor || !subjectID) throw new ServiceError("missing-arguments");

    const subjectArray = await getSubjectsByIDs([subjectID]);
    const message = `<strong>${tutee.given_name} ${tutee.family_name}</strong>'s request for <strong>${subjectArray[0].name}</strong> tutoring expires in <b>${timeToExpiry.days} days and ${timeToExpiry.hours} hours!</b>`;

    // preparing HTML file
    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, message)
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `${message}`,
            `<br/><br/>Please visit the <a href="${process.env.WEBSITE_URL}/manage-tutees">My Tutees</a> page to <strong>Accept/Decline</strong> this request before it expires in <b>${timeToExpiry.days} days and ${timeToExpiry.hours} hours</b>!<br/><br/>`
        ].join(" "));
    console.log(hydratedHTML)
    /*
    return await sendEmail(
        userService.decrypt(tutor.email),
        `EduhopeSG: ${message}!`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
    */
}

/**
 * Sends an email notification to Tutor about the tutee's request being auto-declined after 5 days
 * @param {userService.BasicUser} tutee Tutee object
 * @param {userService.User} tutor Tutor object
 * @param {number} subjectID subjects ID from
 * @returns {EmailResponse}
 */
export async function notifyRequestExpiry(tutee, tutor, subjectID) {
    if (!tutee || !tutor || !subjectID) throw new ServiceError("missing-arguments");

    const subjectArray = await getSubjectsByIDs([subjectID]);
    const message = `Sorry, <strong>${tutee.given_name} ${tutee.family_name}</strong>'s request for <strong>${subjectArray[0].name}</strong> tutoring has expired`;

    // preparing HTML file
    const hydratedHTML = TemplateNotification
        .replace(/{{ NOTIFICATION_BANNER }}/gi, message)
        .replace(/{{ UNSUB_HREF }}/gi, unsubLink)
        .replace(/{{ NOTIFICATION_TEXT }}/gi, [
            `${message}.`,
            `<br/><br/>This request was automatically declined after 5 days so that the system will allow <strong>${tutee.given_name} ${tutee.family_name}</strong> to request for another tutor instead.`,
            "<br/><br/>Thank you for using our platform!<br/><br/>"
        ].join(" "));
    console.log(hydratedHTML)
    /*
    return await sendEmail(
        userService.decrypt(tutor.email),
        `EduhopeSG: ${message}!`,
        htmlToText(hydratedHTML),
        hydratedHTML
    );
    */
}