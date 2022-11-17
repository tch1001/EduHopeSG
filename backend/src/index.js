import "./config.js";
import express, { Router } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";

import RouteError from "./utils/RouteError.js";
import ServiceError from "./utils/ServiceError.js";
import log from "./utils/logging.js";

// Import routes
const apiV1Router = Router()
import userRoutes from "./routes/user-route.js";
import pool from "./utils/database.js";

const app = express();
app.use(express.json());

// Compress responses except for no compression option header request
app.use(compression({
    filter: (req, res) => req.headers['x-no-compression'] ? false : compression.filter(req, res)
}))

// App security
app.use(cors());
app.use(helmet());
app.disable('x-powered-by');
app.set('trust proxy', 1);

// Routers
apiV1Router.use("/user", userRoutes);
app.use("/api/v0.1", apiV1Router);

// Fallback page for routes not found
app.use((req, res) => {
    const STATUS_CODE = 404;

    const wrappedError = new RouteError(
        req.path, "Ensure that you have the correct path",
        new ServiceError(STATUS_CODE, "page-404", null, "Page or API route not found")
    );

    res.status(STATUS_CODE)
        .send(wrappedError)
        .end()

    log.warn({ request: req, response: res });
})

// Error handler
app.use((err, req, res, next) => {
    const STATUS_CODE = 500;

    const wrappedError = new RouteError(
        req.path, "Retry the request and contact the site developers or site admins if the problem persists",
        err instanceof ServiceError ? err :
            new ServiceError(STATUS_CODE, "page-500", err.name || null, err.message || "Something broke!")
    );

    res.status(STATUS_CODE)
        .send(wrappedError)
        .end()

    log.error({ error: err, request: req, response: res });
    next();
})

// Events & servers

const server = app.listen(process.env.EXPRESS_APP_PORT || 5000, () => {
    const { address, family, port } = server.address();

    log.info(
        "Backend server is listening at http://%s:%s using a %s address",
        address, port, family
    );
});

function safeExit(...props) {
    pool.end();
    log.info("Draining and disconnecting active pool clients");

    process.exit(...props)
}

process.on("warning", (error) => log.warn(error));

process.on('beforeExit', (code) => {
    log.info('Process beforeExit event with code: %s', code);
    safeExit();
});

process.on('exit', (code) => {
    log.info('Process exit event with code: %s', code);
});

process.on("uncaughtException", (error, origin) => {
    log.error({ error, origin });
    safeExit();
})

process.on('SIGINT', safeExit);
process.on('SIGQUIT', safeExit)
process.on('SIGTERM', safeExit);
process.on('SIGUSR1', safeExit);
process.on('SIGUSR2', safeExit);