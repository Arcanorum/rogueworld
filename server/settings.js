const fs = require("fs");
const yaml = require("js-yaml");

let settings;

if (fs.existsSync("./settings.yml")) {
    settings = yaml.safeLoad(fs.readFileSync(`${__dirname}/settings.yml`, "utf8"));
}
else {
    settings = yaml.safeLoad(fs.readFileSync(`${__dirname}/settings.example.yml`, "utf8"));
}

module.exports = settings;
