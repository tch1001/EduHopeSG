"use strict";

import dotenv from "dotenv";
dotenv.config();

process.env.WEBSITE_URL = `${process.env.WEBSITE_PROTOCOL}://${process.env.BASE_WEBSITE_URL}${process.env.NODE_ENV === "development" ? ":" + process.env.EXPRESS_APP_PORT : ""}`