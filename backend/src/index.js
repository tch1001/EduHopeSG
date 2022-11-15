import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import cors from "cors";
import bunyan from "bunyan";
import compression from "compression";
import nodePackage from "../package.json" assert { type: "json" };

const app = express();
const log = bunyan.createLogger({
    name: "eduhope-server",
    src: true,
    serializers: {
        request: bunyan.stdSerializers.req,
        response: bunyan.stdSerializers.res
    },
    streams: [
        // can use log rotations when there are a lot of users
        // and the size of one log file is too big
        {
            level: "debug",
            stream: process.stdout,
        },
        {
            level: "info",
            path: "./logs/info.log"
        },
        {
            level: "warn",
            path: "./logs/warn.log"

        },
        {
            level: "error",
            path: "./logs/errors.log"
        },
        {
            level: "fatal",
            path: "./logs/errors.log"
        }
    ]
})

// Compress responses except for no compression option header request
app.use(compression({
    filter: (req, res) => req.headers['x-no-compression'] ? false : compression.filter(req, res)
}))

app.use(cors());
app.use(helmet());
app.disable('x-powered-by');
app.set('trust proxy', 1);

// Fallback page for routes not found
app.use((req, res) => {
    res.status(404).send({
        timestamp: new Date(),
        error: "page-0404",
        name: null,
        message: "Page or API route not found",
        details: "Ensure that you have the correct path",
        path: req.path,
        apiVersion: nodePackage.version
    })

    log.warn({ request: req, response: res });
})

// Error handler
app.use((err, req, res, next) => {
    res.status(500).send({
        timestamp: new Date(),
        error: "page-500",
        name: err.name || null,
        message: err.message || "Something broke!",
        details: "Retry the request, if this continues contact the developers or site admins",
        path: req.path,
        apiVersion: appVersion
    })

    log.error({ error: err, request: req, response: res });
    next();
})

const server = app.listen(process.env.PORT || 3000, () => {
    const { address, family, port } = server.address();

    log.info(
        "Backend server is listening at http://%s:%s using a %s address",
        address, port, family
    );
});
