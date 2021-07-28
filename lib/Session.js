"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const nanoid_1 = require("nanoid");
const _1 = require(".");
class Session {
    constructor(config) {
        this._isBrowser = (typeof window !== 'undefined');
        this._cache = new _1.Cache();
        this._data = new _1.Data(this);
        this._chain = new _1.Chain(this);
        this._config = config;
        this._status = _1.SESSION_STATUS.NEW;
        this._node = new _1.Node();
        this._id = "";
        this._listeners = [];
    }
    async save() {
        await this.cache.put(`session/id`, this.id);
    }
    async load() {
        this._id = await this.cache.get(`session/id`) || nanoid_1.nanoid();
        this._account = await this.cache.get(`session/account`);
    }
    async init() {
        // const _this = this
        // this.workers.main.onmessage = (event: any) => {
        //     console.log(">WORK", event)
        //     _this.onEvent(EVENT.WORK_DONE, event)
        // }
        // this.workers.main.postMessage({ he: "dd"})
        await this.load();
        await this.save();
    }
    // doWork(worker: string = "main", type: string, data: any) {
    //     console.log(this.workers.main)
    //     console.log("DOWORK", type, data)
    //     console.log("333", this.workers.main)
    //     this.workers[worker].postMessage({ type, data })
    // }
    get dir() {
        return this._dir;
    }
    get account() {
        return this._account;
    }
    get listeners() {
        return this._listeners;
    }
    get chain() {
        return this._chain;
    }
    get config() {
        return this._config;
    }
    get id() {
        return this._id;
    }
    get node() {
        return this._node;
    }
    get status() {
        return this._status;
    }
    get cache() {
        return this._cache;
    }
    get wallet() {
        return this._wallet;
    }
    get data() {
        return this._data;
    }
    get isBrowser() {
        return this._isBrowser;
    }
    openWallet(mnemonic) {
        this._wallet = new _1.Wallet(mnemonic);
        return this.wallet;
    }
    listen(onEvent) {
        this.listeners.push({ onEvent });
    }
    onEvent(type, data) {
        this.listeners.map((listener) => {
            listener.onEvent(type, nanoid_1.nanoid(), data);
        });
    }
    setStatus(s) {
        this._status = s;
        this.onEvent(_1.EVENT.STATUS_CHANGED, s);
    }
    get isReady() {
        return this.status >= _1.SESSION_STATUS.READY;
    }
    log(msg) {
        console.log(`[Carmel] ${msg}`);
    }
    toJSON() {
        return ({
            id: this.id,
            cid: this.id
        });
    }
    async start() {
        this.setStatus(_1.SESSION_STATUS.INITIALIZING);
        await this.init();
        await this.node.start();
        await this.save();
        this.setStatus(_1.SESSION_STATUS.READY);
    }
    async findUser(username) {
        this.log('looking up user ' + username + " ...");
        const user = await this.chain.getUser(username);
        this.log('user lookup done.');
        this.onEvent(_1.EVENT.USER_LOOKUP_DONE, { username, user });
        return user;
    }
    async register(username, password) {
        this.log('registering user ' + username + " ...");
        // this.doWork('main', "register", { username, password })
        // this._wallet = new Wallet(this)
        // const mnemonic = this.wallet?.createNew()
        // this.log('wallet created')
        // this.onEvent(EVENT.USER_CREATED, { username, mnemonic })
        // return ({ mnemonic })
    }
    async saveAccount(username, mnemonic, signature) {
        const identity = this.openWallet(mnemonic).getIdentity();
        const { privateKey, publicKey } = identity;
        const account = { privateKey, publicKey, username, signature };
        await this.cache.put("session/account", account);
    }
    async clearAccount() {
        console.log(">>>>>");
        await this.cache.remove("session/account");
        this._account = undefined;
    }
}
exports.Session = Session;
//# sourceMappingURL=Session.js.map