"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Identity = void 0;
// import { Wallet, Datastore } from '.'
const wif_1 = __importDefault(require("wif"));
class Identity {
    constructor(wallet, index) {
        this._wallet = wallet;
        this._index = index;
        this._ecc = require('eosjs-ecc');
        this._raw = wallet.root.deriveHardened(0);
        this._publicKey = this.ecc.PublicKey(this.raw.publicKey).toString();
        this._privateKey = wif_1.default.encode(128, this.raw.privateKey, true);
        // this._wallet = wallet
        // this._index = index
        // this._raw = wallet.root!.deriveHardened(index)
        // this._publicKey = Buffer.from(this.raw.publicKey).toString()//this.wallet.ecc.PublicKey(this.raw.publicKey).toString()
        // this._privateKey = wif.encode(128, this.raw.privateKey!, true)
        // this._session = session
        // this._exists = false
    }
    get ecc() {
        return this._ecc;
    }
    // sign(digest: any) {
    //     // return this.wallet.ecc.sign(digest, this.privateKey)
    // }
    // get session() {
    //     return this._session
    // }
    get wallet() {
        return this._wallet;
    }
    // get cache() {
    //     return this._cache
    // }
    get index() {
        return this._index;
    }
    get raw() {
        return this._raw;
    }
    get publicKey() {
        return this._publicKey;
    }
    get privateKey() {
        return this._privateKey;
    }
}
exports.Identity = Identity;
//# sourceMappingURL=Identity.js.map