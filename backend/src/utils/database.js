import { Client } from "pg";
import log from "./logging";

export default client = new Client({
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    port: process.env.POSTGRES_PORT,
})

client.connect()
    .then(() => (
        log.info(
            "Server connected to PostgreSQL %s@%s:%s",
            process.env.POSTGRES_DATABASE,
            process.env.POSTGRES_HOST,
            process.env.POSTGRES_PORT
        )
    ))
    .catch((error) => (
        log.error({
            message: "Error connecting to PostgreSQL",
            error
        })
    ))

export const query = (...args) => {
    return new Promise((resolve, reject) => {
        client.query(...args, (err, res) => {
            if (err) {
                log.error({
                    message: "Failed to execute query in database utils",
                    error: err
                })
            }

            resolve(res);
        })
    })
}