import { Api, JsonRpc } from 'eosjs'
import { JsSignatureProvider } from 'eosjs/dist/eosjs-jssig'
import randomBytes from 'randombytes'
import base64 from 'js-base64'
import wif from 'wif'
import { fromSeed } from 'bip32'
import { encrypt, decrypt } from 'bip38'
import { entropyToMnemonic, mnemonicToSeedSync } from 'bip39'
import fs from 'fs-extra'
import path from 'path'
import fetch from 'isomorphic-fetch'
import { Session } from '.'
        
export class Chain {
    private _account: any
    private _session: Session 

    constructor(session: Session) {
        this._session = session
    }

    get session() {
        return this._session
    }

    get account() {
        return this._account
    }

    createAction (contract: string, name: string, data: any) {
        const { account } = data
    
        return {
            account: contract,
            name,
            authorization: [{
                actor: account || this.session.config.settings.eosAccountName,
                permission: 'active',
            }],
            data
        }
    }

    async getBalance (account: string) {
        const rpc = new JsonRpc(this.session.config.settings.eosUrl, { fetch })

        const carmel = await rpc.get_currency_balance("carmeltokens", account)
        const eos = await rpc.get_currency_balance("eosio.token", account)

        return ({
            eos: eos[0] ? parseFloat(eos[0].split()[0]) : 0,
            carmel: carmel[0] ? parseFloat(carmel[0].split()[0]) : 0
        })
    }

    async read (contract: string, scope: string, table: string, index: any) {
        const rpc = new JsonRpc(this.session.config.settings.eosUrl, { fetch })
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
        }))

        return result
    }

    async readSystem(table: string, index: any) {
        const result = await this.read("carmelsystem", "carmelsystem", table, index)    
    
        if (!result || !result.rows || result.rows.length === 0) {
            return ({ data: [] })
        }
    
        return ({ data: result.rows })
    }

    async getUser(username: string) {
        const { data } = await this.readSystem("accounts", ["name", "secondary", username])    
    
        return data.length > 0 ? data[0] : false
    }

    async getMyUser() {
        return this.getUser(this.session.config.settings.eosUsername)
    }

    async getMyBalance () {
        return this.getBalance(this.session.config.settings.eosAccountName)
    }

    async refresh() {
        const balance = await this.getMyBalance()
        const profile = await this.getMyUser()

        this._account = {
            balance, profile
        }
    }

    async sendTransaction (contract: string, name: string, data: any) {   
        const actions = [this.createAction(contract, name, data)]

        const rpc = new JsonRpc(this.session.config.settings.eosUrl, { fetch })
        const signatureProvider = new JsSignatureProvider([this.session.config.secrets.eosActivePrivateKey])
        const api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() })

        var error = null 

        try {
            const result = await api.transact({ actions }, {
                blocksBehind: 3,
                expireSeconds: 30,
            })

            if (!result.transaction_id || !result.processed || 
                !result.processed.receipt || !result.processed.receipt.status || 
                result.processed.receipt.status !== 'executed') {
                    throw new Error('Call did not succeed')
            }

            return result
        } catch (e) {
            console.log("???", e)
            const s = e.message.split(":")
            error = s.length > 1 ? s[1].trim() : s[0].trim()
        }

        return ({ error })
    }

    async sendSystemTransaction (name: string, data: any) {   
        return this.sendTransaction("carmelsystem", name, data)
    }

    async getMesh () {
        const mesh = [{
            type: "webrtc-star",
            url: "carmel-node-y.chunky.io",
            port: 443
        }]

        const swarm = mesh.filter((s: any) => s.type === 'webrtc-star').map((s: any) => `/dns4/${s.url}/tcp/${s.port || 443}/wss/p2p-webrtc-star`)

        return {
            swarm
        }
    }

    async updateAccount (data: any) {
        const { username, sig, did } = data

        const result = await this.sendSystemTransaction("updateuser", {
            username, did, sig
        })
        
        const account = await this.getUser(username)
        
        return {
            result,
            data: { account }
        }
    }

    async createNewAccount (data: any) {
        const { username, did, publicKey } = data

        const result = await this.sendSystemTransaction("createuser", {
            username, pub_key: publicKey, did
        })

        const account = await this.getUser(username)
        
        return {
            result,
            data: { account }
        }
    
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
    
    async init () {
        await this.refresh()
    }
}

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