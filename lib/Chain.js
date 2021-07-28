"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chain = void 0;
const eosjs_1 = require("eosjs");
const eosjs_jssig_1 = require("eosjs/dist/eosjs-jssig");
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
class Chain {
    constructor(session) {
        this._session = session;
    }
    get session() {
        return this._session;
    }
    get account() {
        return this._account;
    }
    createAction(contract, name, data) {
        const { account } = data;
        return {
            account: contract,
            name,
            authorization: [{
                    actor: account || "carmelsystem",
                    permission: 'active',
                }],
            data
        };
    }
    async getBalance(account) {
        const rpc = new eosjs_1.JsonRpc(this.session.config.settings.eos.url, { fetch: isomorphic_fetch_1.default });
        const carmel = await rpc.get_currency_balance("carmeltokens", account);
        const eos = await rpc.get_currency_balance("eosio.token", account);
        return ({
            eos: eos[0] ? parseFloat(eos[0].split()[0]) : 0,
            carmel: carmel[0] ? parseFloat(carmel[0].split()[0]) : 0
        });
    }
    async read(contract, scope, table, index) {
        const rpc = new eosjs_1.JsonRpc(this.session.config.settings.eosUrl, { fetch: isomorphic_fetch_1.default });
        const result = await rpc.get_table_rows(Object.assign({}, {
            json: true,
            code: contract,
            scope,
            table,
            limit: 100,
            reverse: false,
            show_payer: false
        }, index && {
            key_type: index[0],
            index_position: index[1],
            upper_bound: index[2],
            lower_bound: index.length > 3 ? index[3] : index[2]
        }));
        return result;
    }
    async readSystem(table, index) {
        const result = await this.read("carmelsystem", "carmelsystem", table, index);
        if (!result || !result.rows || result.rows.length === 0) {
            return ({ data: [] });
        }
        return ({ data: result.rows });
    }
    async getUser(username) {
        const { data } = await this.readSystem("users", ["name", "secondary", username]);
        return data.length > 0 ? data[0] : false;
    }
    async getMyUser() {
        return this.getUser(this.session.config.settings.eosUsername);
    }
    async getMyBalance() {
        return this.getBalance(this.session.config.settings.eosAccountName);
    }
    async refresh() {
        const balance = await this.getMyBalance();
        const profile = await this.getMyUser();
        this._account = {
            balance, profile
        };
    }
    async sendTransaction(contract, name, data) {
        const actions = [this.createAction(contract, name, data)];
        console.log(actions[0]);
        const rpc = new eosjs_1.JsonRpc(this.session.config.settings.eosUrl, { fetch: isomorphic_fetch_1.default });
        const signatureProvider = new eosjs_jssig_1.JsSignatureProvider([this.session.config.secrets.eosActivePrivateKey]);
        const api = new eosjs_1.Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
        var error = null;
        try {
            const result = await api.transact({ actions }, {
                blocksBehind: 3,
                expireSeconds: 30,
            });
            if (!result.transaction_id || !result.processed ||
                !result.processed.receipt || !result.processed.receipt.status ||
                result.processed.receipt.status !== 'executed') {
                throw new Error('Call did not succeed');
            }
            return result;
        }
        catch (e) {
            console.log("???", e);
            const s = e.message.split(":");
            error = s.length > 1 ? s[1].trim() : s[0].trim();
        }
        return ({ error });
    }
    async sendSystemTransaction(name, data) {
        return this.sendTransaction("carmelsystem", name, data);
    }
    async createNewAccount(data) {
        console.log("createNewAccount", data);
        const account = data.account || this.session.config.settings.eos.accountName;
        const { username, did, publicKey } = data;
        // Create the user
        const result = await this.sendSystemTransaction("createuser", {
            username, pub_key: publicKey, did
        });
        return result;
        // if (credentials.plan.requiredTokens > 0) {
        //     // Make a payment
        //     const total = (parseFloat(credentials.plan.requiredTokens) / 10000).toFixed(4)
        //     await eos.tokens.call("transfer", {
        //         from: credentials.account.id,
        //         to: "carmelsystem",
        //         quantity: `${total} CARMEL`,
        //         memo: `${credentials.username}:${credentials.plan.id}:1`
        //     })
        // }
        // // Log the user in
        // const user = await _doLogin(credentials)
        // await send({ 
        //     id: credentials.id,
        //     type: 'registerSuccess',
        //     user,
        //     session: system.session,
        //     env
        // })
    }
    async init() {
        await this.refresh();
    }
}
exports.Chain = Chain;
// export const checkKey = async (data: any) => {
//     const signatureProvider = new JsSignatureProvider([data.privateKey])
//     const getAvailableKeys = await signatureProvider.getAvailableKeys()
//     const publicKey = getAvailableKeys[0]
//     const rpc = new JsonRpc(NET_URL, { fetch })
//     let result = await rpc.history_get_key_accounts(publicKey)
//     if (!result || !result.account_names) {
//         throw new Error('Invalid private key')
//     }
//     const { account_names } = result
//     try {
//         const le2 = await rpc.get_currency_balance(EOS_TOKENS, "chunkymonkey")
//         const le = await rpc.get_currency_balance(CARMEL_TOKENS, "chunkymonkey")
//     } catch (e) {
//         console.log(e)
//     }
//     const balances: any = await Promise.all(account_names.map((a: string) => (
//         rpc.get_currency_balance(CARMEL_TOKENS, a)
//     )))
//     const accounts = account_names.map((id: string, i: number) => {
//         const balance = balances[i][0] ? parseFloat(balances[i][0].split()[0]) : 0
//         return { id, balance }
//     })
//     return {
//         publicKey,
//         accounts
//     }
// 
// export const system = ({
//     call: async (name: string, data: any, privateKey?: string) => transaction(CARMEL_SYSTEM, name, data, privateKey)
// })
// export const tokens = ({
//     call: async (name: string, data: any, privateKey?: string) => transaction(CARMEL_TOKENS, name, data, privateKey)
// })
// const events = {
//     findUser, register, login
// }
// addEventListener('message', event => {
//   const { data } = event
//   const { type, id } = data
//   events[type](data).then((result) => {
//     postMessage({ ...data, result })
//   })
// })
// }
//# sourceMappingURL=Chain.js.map