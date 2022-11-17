import path from "path";
import { fileURLToPath } from 'url';
import { readFile } from "fs";
import postgres from 'pg';
import log from "./logging.js";

const { Pool } = postgres;

const pool = new Pool({
    user: process.env.POSTGRES_USERNAME,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
})

pool.on("error", (err, client) => log.error({ error: err, client }));

pool.connect()
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
export async function query(...args) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const result = await client.query(...args);
        await client.query('COMMIT');

        return result;
    } catch (err) {
        await client.query('ROLLBACK');

        log.error({
            message: "Failed to execute query in database utils",
            error: err
        })

        throw err;
    } finally {
        client.release();
    }
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

        query(setupSQL).then((result) => (
            log.info({
                message: "Successfully initalised database",
                result
            })
        ));
    })
}

export default pool;