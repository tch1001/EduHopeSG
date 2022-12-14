import "./config.js";
import express, { Router } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";

import RouteError from "./classes/RouteError.js";
import log from "./utils/logging.js";

// Import routes
const apiV1Router = Router()
import userRoutes from "./routes/user-route.js";
import tuteeRoutes from "./routes/tutee-route.js";
import tutorRoutes from "./routes/tutor-route.js";
import pool from "./utils/database.js";

const app = express();
app.use(express.json());
app.use(cookieParser())

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
apiV1Router.use("/tutee", tuteeRoutes);
apiV1Router.use("/tutor", tutorRoutes);
app.use("/api/v0.1", apiV1Router);

export function standardRouteErrorCallback(res, req, err) {
    const routeError = new RouteError(err, req.originalUrl)

    res.status(routeError.status || 400)
        .send(routeError)
        .end();
}

// Fallback page for routes not found
app.use((req, res) => {
    const STATUS_CODE = 404;

    res.status(STATUS_CODE)
        .send(new RouteError("page-404", req.path))
        .end()

    log.warn({ request: req, response: res });
})

// Error handler
app.use((err, req, res, next) => {
    if (err?.type === "entity.parse.failed") {
        res.status(400).send(new RouteError("json-malformed", req.path));
        return next();
    };

    const STATUS_CODE = 500;

    res.status(STATUS_CODE)
        .send(new RouteError("page-500", req.path))
        .end();

    log.error({ error: err, request: req, response: res });
    next();
})

// Server and safe existing when process stops/when FATAL error occurs

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