import express from "express";
import helmet from "helmet";
import bunyan from "bunyan";
import nodePackage from "../package.json" assert { type: "json" };

const app = express();
const log = bunyan.createLogger({
    name: "eduhope-server",
    src: true,
    streams: [
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

app.use(helmet());
app.disable('x-powered-by');
app.set('trust proxy', 1);

// Fallback page for routes not found
app.use((req, res) => {
    res.status(404).send({
        timestamp: new Date(),
        error: "page-0404",
        message: "Page or API route not found",
        details: "Ensure that you have the correct path",
        path: req.path,
        apiVersion: nodePackage.version
    })
})

// Error handler
app.use((err, req, res, next) => {
    log.error(err);

    res.status(500).send({
        timestamp: new Date(),
        error: "page-500",
        message: err.message || "Something broke!",
        details: "Retry the request, if this continues contact the developers or site admins",
        path: req.path,
        apiVersion: appVersion
    })

    next();
})

const server = app.listen(process.env.PORT || 3000, () => {
    const { address, family, port } = server.address();

    log.info(
        "Backend server is listening at http://%s:%s using a %s address",
        address, port, family
    );
});
