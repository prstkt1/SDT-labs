import fs from "fs";
import localConfig from "../../config.json";

export interface AppConfig {
  db: {
    user?: string;
    password?: string;
    host?: string;
    port?: number;
    database?: string;
  };
  [key: string]: unknown;
}

let config: AppConfig;

try {
  config = JSON.parse(fs.readFileSync("/etc/mywebapp/config.json", "utf-8"));
} catch {
  config = localConfig as AppConfig;
}

export default config;
