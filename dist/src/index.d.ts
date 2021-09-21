import { createApp, readConfig, ServerCode } from "./app";
import BaseController from "./utils/BaseController";
import { controller as ctr, DELETE as del, GET as get, POST as post } from "./utils/decorators";
import { LogEvents } from "./domains/Log/log.module";
export declare const BlackBoxCreateApp: typeof createApp;
export declare const BlackBoxReadConfig: typeof readConfig;
export declare const BlackBoxServerCode: typeof ServerCode;
export declare const BlackBoxLogEvents: typeof LogEvents;
export declare const controller: typeof ctr;
export declare const DELETE: typeof del;
export declare const GET: typeof get;
export declare const POST: typeof post;
export declare const BlackBoxBaseController: typeof BaseController;
//# sourceMappingURL=index.d.ts.map