import bunyan from "bunyan";

export default bunyan.createLogger({
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