import nacl from 'tweetnacl'
import naclutil from 'tweetnacl-util'
import wif from 'wif'
import { BIP32Interface } from 'bip32'
import { Session } from '.'
import { Wallet } from './Wallet'

export class Identity {
    private _ecc: any
    private _publicKey?: string
    private _privateKey?: string

    constructor () {
        this._ecc = require('eosjs-ecc')
    }

    get ecc() {
        return this._ecc
    }

    get publicKey() {
        return this._publicKey
    }

    get privateKey() {
        return this._privateKey
    }

    initFromWallet(wallet: Wallet, index: number) {
        const raw = wallet.root!.deriveHardened(index)
        this._publicKey = this.ecc.PublicKey(raw.publicKey).toString()
        this._privateKey = wif.encode(128, raw.privateKey!, true)

        return this
    }

    init(publicKey: string, privateKey: string) {
        this._publicKey = this.ecc.PublicKey(publicKey).toString()
        this._privateKey = privateKey

        return this
    }

    sign(digest: any) {
        return this.ecc.sign(digest, this.privateKey)
    }
}