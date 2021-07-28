"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_hooks_worker_1 = require("react-hooks-worker");
const crypto_1 = require("./crypto");
const TASKS = {
    generateMnemonic: crypto_1.generateMnemonic, generateSignature: crypto_1.generateSignature
};
const main = async (props) => {
    const { type, data } = props;
    if (!TASKS[type])
        return;
    const result = TASKS[type](data);
    return ({ type, result, data });
};
react_hooks_worker_1.exposeWorker(main);
//# sourceMappingURL=main.js.map