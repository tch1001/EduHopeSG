import path from "path";
import { fileURLToPath } from 'url';
import { readFile } from "fs";
import postgres from 'pg';
import log from "./logging.js";

const { Client } = postgres;

const client = new Client({
    user: process.env.POSTGRES_USERNAME,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
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

// Query wrapper with error handling
export function query(...args) {
    return new Promise((resolve, reject) => {
        client.query(...args, (err, res) => {
            if (err) {
                log.error({
                    message: "Failed to execute query in database utils",
                    error: err
                })

                reject(err);
            }

            resolve(res);
        })
    })
}

export function setup() {
    const FILE = "../../init_database.sql";
    const __dirname = path.dirname(fileURLToPath(import.meta.url));

    readFile(path.resolve(__dirname, FILE), "utf-8", (err, setupSQL) => {
        if (err) {
            log.error({
                message: err.message,
                stack: err.stack,
            });

            return;
        }

        query(setupSQL);
    })
}

export default client;