import fs from "fs";
import path from "path";
import crypto from "crypto";

/**
 * Arguments for quick .env setup
 * --example [file name for .env example]. Defaults to ".env.example"
 * --output [file name for .env]. Defaults to ".env"
 * --preset [production | development]. Defaults to development
 */
const args = parseArgs(process.argv.slice(2));

const location = path.resolve(import.meta.url.split("\/\/")[1], "../../../");
const exampleEnv = path.resolve(location, args.example || ".env.example");
const envFile = path.resolve(location, args.output || ".env");

const file = fs.readFileSync(exampleEnv, "utf-8");
console.log(parseEnv(file));
// console.log(parseEnv(file));


const presets = {
    development: {},
    production: {}
}

function parseArgs(tokens = []) {
    const data = [];

    tokens.forEach(token => {
        const [flag, value] = token.split("=");
        data.push([flag.replace(/\-/g, ""), value.toLowerCase()]);
    });

    return Object.fromEntries(data);
}

function parseEnv(file) {
    const lines = file.split("\n");
    const result = {};

    lines.forEach((line, number) => {
        const pair = line.split("=");
        const [env, value] = pair;
        const id = `${number + 1}->`;

        
        if (pair.length === 1) {
            result[id] = line;
        } else {
            result[id + env] = value;

        }
    });

    return result;
}

function outputEnv(envs = {}) {
    const lines = [];

    Object.keys(envs).forEach((key) => {
        const [lineNumber, env] = key.split("->");

        if (env) {

        } else {
            lines.push()
        }
    });

    return lines;
}