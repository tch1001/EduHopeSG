import dotenv from "dotenv";
dotenv.config();

process.env.WEBSITE_URL = `${process.env.FRONTEND_PROTOCOL}://${process.env.FRONTEND_DOMAIN}${process.env.NODE_ENV === "development" ? ":" + process.env.FRONTEND_PORT : ""}`
process.env.FRONTEND_ORIGIN = process.env.WEBSITE_URL;