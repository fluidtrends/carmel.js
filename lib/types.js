"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WORK = exports.EVENT = exports.SESSION_STATUS = void 0;
var SESSION_STATUS;
(function (SESSION_STATUS) {
    SESSION_STATUS["NEW"] = "new";
    SESSION_STATUS["INITIALIZING"] = "init";
    SESSION_STATUS["READY"] = "ready";
})(SESSION_STATUS = exports.SESSION_STATUS || (exports.SESSION_STATUS = {}));
var EVENT;
(function (EVENT) {
    EVENT[EVENT["STATUS_CHANGED"] = 0] = "STATUS_CHANGED";
    EVENT[EVENT["USER_LOOKUP_DONE"] = 1] = "USER_LOOKUP_DONE";
    EVENT[EVENT["USER_CREATED"] = 2] = "USER_CREATED";
    EVENT[EVENT["WORK_DONE"] = 3] = "WORK_DONE";
})(EVENT = exports.EVENT || (exports.EVENT = {}));
var WORK;
(function (WORK) {
    WORK[WORK["REGISTER"] = 0] = "REGISTER";
})(WORK = exports.WORK || (exports.WORK = {}));
//# sourceMappingURL=types.js.map