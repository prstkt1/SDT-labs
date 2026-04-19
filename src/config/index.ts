import fs from "fs";

let config: any;
try {
  config = JSON.parse(fs.readFileSync("/etc/mywebapp/config.json", "utf-8"));
} catch (err) {
  config = require("../../config.json");
}

export default config;
