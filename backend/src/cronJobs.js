import { notifyTuteeDeclination, notifyRequestExpiry } from "./services/email-service.js"
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

const remindTutorAcceptDecline = () => {
    // Fetch all the ttr with 
    // status = "PENDING", 
    // today() - 1.5 < date created < today() - 2.5 OR today() - 3.5 < date created < today() - 4.5 (sargable queries)
    // then INNER JOIN with user table ON ttr.tutor = user.id

}

const remindTutorCommitmentEnd = () => {

}

export const cronJobs = () => {
    // Runs at 12pm daily
    const dailyCronJobs = CronJob.schedule("14 22 * * *", () => {
        console.log("Cron started")
        // Function that checks the days since creation of ttr. If 5 days, auto decline. (Require new email functions and templates)
        autoDeclineExpiredRequests()
        // Function that checks the days since creation of ttr. If 2 or 4 days AND ttr.status == "PENDING", send reminder to tutor. 
        remindTutorAcceptDecline()
        // Function that informs tutor they are no longer listed as commitment end has passed. If they wish to extend, must update thru edit profile.
        remindTutorCommitmentEnd()
    }, {
        timezone: "Asia/Singapore"
    })

    dailyCronJobs.start()
}