import { createApp, readConfig, ServerCode } from "./app";
import BaseController from "./utils/BaseController";
import { controller as ctr, DELETE as del, GET as get, POST as post, } from "./utils/decorators";
import { LogEvents } from "./domains/Log/log.module";
export const BlackBoxCreateApp = createApp;
export const BlackBoxReadConfig = readConfig;
export const BlackBoxServerCode = ServerCode;
export const BlackBoxLogEvents = LogEvents;
export const controller = ctr;
export const DELETE = del;
export const GET = get;
export const POST = post;
export const BlackBoxBaseController = BaseController;
//# sourceMappingURL=index.js.map