import { notifyTuteeDeclination, notifyRequestExpiry, emailRemindTutorAcceptDecline } from "./services/email-service.js"
import { query } from "./utils/database.js"
import * as userService from "./services/user-service.js"

import * as CronJob from "node-cron"

const autoDeclineExpiredRequests = async () => {
    const { rows: expiredRequests } = await query(`
        SELECT 
        tutor.given_name AS tutor_given_name, tutor.family_name AS tutor_family_name, tutor.email AS tutor_email,
        tutee.given_name AS tutee_given_name, tutee.family_name AS tutee_family_name, tutee.email AS tutee_email,
        ttr.subject
        FROM tutee_tutor_relationship AS ttr
        INNER JOIN eduhope_user AS tutor ON tutor.id = ttr.tutor
        INNER JOIN eduhope_user AS tutee ON tutee.id = ttr.tutee
        WHERE ttr.status = 'PENDING'
        AND ttr.created_on < now() - INTERVAL '5.5 days'
        `
    )

    expiredRequests.forEach(expiredRequest => {
        const tutee = {
            given_name: expiredRequest.tutee_given_name,
            family_name: expiredRequest.tutee_family_name,
            email: userService.decrypt(expiredRequest.tutee_email)
        }
        const tutor = {
            given_name: expiredRequest.tutor_given_name,
            family_name: expiredRequest.tutor_family_name,
            email: userService.decrypt(expiredRequest.tutor_email)
        }

        notifyTuteeDeclination(tutee, tutor, expiredRequest.subject)
        notifyRequestExpiry(tutee, tutor, expiredRequest.subject)
    })

    await query(`
        DELETE
        FROM tutee_tutor_relationship AS ttr
        WHERE ttr.status = 'PENDING'
        AND ttr.created_on < now() - INTERVAL '5.5 days'
        `
    )
}

const remindTutorAcceptDecline = async() => {
    const { rows: pendingRequests } = await query(`
        SELECT 
        tutor.given_name AS tutor_given_name, tutor.family_name AS tutor_family_name, tutor.email AS tutor_email,
        tutee.given_name AS tutee_given_name, tutee.family_name AS tutee_family_name, tutee.email AS tutee_email,
        ttr.subject,
        AGE(ttr.created_on + INTERVAL '5.5 days', now()) AS time_to_expiry
        FROM tutee_tutor_relationship AS ttr
        INNER JOIN eduhope_user AS tutor ON tutor.id = ttr.tutor
        INNER JOIN eduhope_user AS tutee ON tutee.id = ttr.tutee
        WHERE ttr.status = 'PENDING'
        AND ttr.created_on >= now() - INTERVAL '5.5 days'
        `
    )

    console.log(pendingRequests)

    pendingRequests.forEach(pendingRequest => {
        const tutee = {
            given_name: pendingRequest.tutee_given_name,
            family_name: pendingRequest.tutee_family_name,
            email: userService.decrypt(pendingRequest.tutee_email)
        }
        const tutor = {
            given_name: pendingRequest.tutor_given_name,
            family_name: pendingRequest.tutor_family_name,
            email: userService.decrypt(pendingRequest.tutor_email)
        }

        emailRemindTutorAcceptDecline(tutee, tutor, pendingRequest.subject, pendingRequest.time_to_expiry)
    })
}

const remindTutorCommitmentEnd = () => {

}

export const cronJobs = () => {
    // Runs at 12pm daily
    const dailyCronJobs = CronJob.schedule("0 12 * * *", () => {
        console.log("Cron started")
        // Function that checks the days since creation of ttr. If more than 5.5 days, auto decline. (Require new email functions and templates)
        autoDeclineExpiredRequests()
        // Function that checks the days since creation of ttr. If <= 5.5 days AND ttr.status == "PENDING", send reminder to tutor. 
        remindTutorAcceptDecline()
        // Function that informs tutor they are no longer listed as commitment end has passed. If they wish to extend, must update thru edit profile.
        remindTutorCommitmentEnd()
    }, {
        timezone: "Asia/Singapore"
    })

    dailyCronJobs.start()
}