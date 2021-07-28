"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
var STORE;
(function (STORE) {
    STORE["SESSION"] = "session";
    STORE["DATA"] = "data";
    STORE["IDENTITY"] = "identity";
})(STORE || (STORE = {}));
class Cache {
    constructor() {
        this._level = require('level');
        this._stores = {};
        Object.keys(STORE).map((s) => {
            this.stores[s] = this.level(`${s.toLowerCase()}`, { prefix: "carmel/" });
        });
    }
    get level() {
        return this._level;
    }
    get stores() {
        return this._stores;
    }
    store(type) {
        return this.stores[type];
    }
    _parseId(id) {
        const parts = id.split("/");
        const type = parts.shift();
        return [type, parts.join("/")];
    }
    async put(itemId, data) {
        const [type, id] = this._parseId(itemId);
        this.stores[type.toUpperCase()].put(id, JSON.stringify(data));
    }
    async get(itemId) {
        const [type, id] = this._parseId(itemId);
        return this.stores[type.toUpperCase()].get(id).then((d) => JSON.parse(d)).catch((err) => { });
    }
    async remove(itemId) {
        const [type, id] = this._parseId(itemId);
        return this.stores[type.toUpperCase()].del(id).catch((err) => { });
    }
}
exports.Cache = Cache;
Cache.STORE = STORE;
//# sourceMappingURL=Cache.js.map