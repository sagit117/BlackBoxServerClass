import { createServer, readConfig } from "./app";

export const BlackBox = createServer("./config.json");
export const ReadConfig = readConfig;

// console.log(BlackBox);
