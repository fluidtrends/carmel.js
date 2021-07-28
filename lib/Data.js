"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Data = void 0;
const deepmerge_1 = __importDefault(require("deepmerge"));
const automerge_1 = __importDefault(require("automerge"));
const bs58_1 = __importDefault(require("bs58"));
const CONTENT_MODEL_VERSION = "1.0";
const CONTENT_MODEL = {
    carmel: {
        modelVersion: CONTENT_MODEL_VERSION
    },
    profile: {},
    posts: new automerge_1.default.Table(),
    friends: new automerge_1.default.Table(),
    docs: new automerge_1.default.Table()
};
class Data {
    constructor(session) {
        this._session = session;
        this._content = automerge_1.default.from(CONTENT_MODEL);
    }
    get session() {
        return this._session;
    }
    get content() {
        return this._content;
    }
    save() {
        return bs58_1.default.encode(Buffer.from(automerge_1.default.save(this.content)));
    }
    load(c) {
        this._content = automerge_1.default.load(Buffer.from(bs58_1.default.decode(c)).toString());
    }
    add(table, row, message) {
        if (!CONTENT_MODEL[table] || "Table" !== CONTENT_MODEL[table].constructor.name)
            return;
        var id;
        this._content = automerge_1.default.change(this.content, message, (doc) => {
            id = doc[table].add(Object.assign({}, row));
        });
        return id;
    }
    updateEntry(table, id, message, update) {
        if (!CONTENT_MODEL[table] || "Table" !== CONTENT_MODEL[table].constructor.name)
            return;
        this._content = automerge_1.default.change(this.content, message, (doc) => {
            let item = doc[table].byId(id);
            if (!item)
                return;
            if (update) {
                item = deepmerge_1.default(item, update);
            }
            else {
                doc[table].remove(id);
            }
        });
    }
    remove(table, id) {
        this.updateEntry(table, id, `removing ${id}`, false);
    }
    update(section, data, message) {
        if (!CONTENT_MODEL[section] || "Object" !== CONTENT_MODEL[section].constructor.name)
            return;
        this._content = automerge_1.default.change(this._content, message, (doc) => {
            doc[section] = deepmerge_1.default(doc[section], data);
        });
    }
    toJSON() {
        let result = {};
        Object.keys(CONTENT_MODEL).map((key) => {
            if ("Object" === CONTENT_MODEL[key].constructor.name) {
                result[key] = this.content[key];
            }
            else if ("Table" === CONTENT_MODEL[key].constructor.name) {
                result[key] = this.content[key].rows;
            }
        });
        return result;
    }
}
exports.Data = Data;
//# sourceMappingURL=Data.js.map