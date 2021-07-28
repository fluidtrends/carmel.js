"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
const bip32_1 = require("bip32");
const bip39_1 = require("bip39");
const _1 = require(".");
const WALLET_ROOT_PATH = "m/44'/194'/0'";
class Wallet {
    constructor(mnemonic) {
        var _a;
        this._raw = bip32_1.fromSeed(bip39_1.mnemonicToSeedSync(mnemonic));
        this._root = (_a = this.raw) === null || _a === void 0 ? void 0 : _a.derivePath(WALLET_ROOT_PATH);
    }
    get content() {
        return this._content;
    }
    get raw() {
        return this._raw;
    }
    get root() {
        return this._root;
    }
    getIdentity(index = 0) {
        return new _1.Identity(this, index);
    }
}
exports.Wallet = Wallet;
//# sourceMappingURL=Wallet.js.map