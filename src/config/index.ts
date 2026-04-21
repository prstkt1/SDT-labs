import fs from "fs";
import localConfig from "../../config.json";

let config: Record<string, unknown>;

try {
  config = JSON.parse(fs.readFileSync("/etc/mywebapp/config.json", "utf-8"));
} catch {
  config = localConfig;
}

export default config;
