import randomBytes from 'randombytes'
import wif from 'wif'
import { BIP32Interface, fromSeed, fromPrivateKey } from 'bip32'
import { encrypt, decrypt } from 'bip38'
import { entropyToMnemonic, mnemonicToSeedSync }  from 'bip39'
import bs58 from 'bs58'
import { Identifier } from 'typescript'
import { Identity, Session } from '.'

const WALLET_ROOT_PATH = "m/44'/194'/0'"

export class Wallet {
    private _raw?: BIP32Interface 
    private _content: any 
    private _root?: BIP32Interface

    constructor(mnemonic?: string, privateKey?: string) {
        this._raw = mnemonic ? fromSeed(mnemonicToSeedSync(mnemonic)) : undefined//fromPrivateKey(Buffer.from(privateKey))
        this._root = this.raw?.derivePath(WALLET_ROOT_PATH)
    }

    get content() {
        return this._content
    }

    get raw () {
        return this._raw
    }

    get root () {
        return this._root
    }

    getIdentity(index: number = 0) {
        const i = new Identity()
        return i.initFromWallet(this, index)
    }

//     createFromWIF (wif: string) {
//         // const { privateKey } = wifLib.decode(wif)
//         // console.log("privateKey:", Buffer.from(privateKey).toString('hex'))
//         // this._data = fromPrivateKey(privateKey, Buffer.alloc(32, 1))
//         // const ecc = require('eosjs-ecc')

//         const entropy = randomBytes(32)
//         const mnemonic = entropyToMnemonic(entropy)
//         const seed = mnemonicToSeedSync(mnemonic)
//         this._data = fromSeed(seed)

//         const xprv = this.data?.toBase58()
//         // const w = wifLib.encode(1, Buffer.from(xprv!), true)

//         // console.log("xprv: " + this.data?.toBase58())
//         console.log("xpub: " + this.data?.neutered().toBase58())
//         console.log("chainCode: " + bs58.encode(this.data?.chainCode!))

//         console.log(Buffer.from(bs58.decode(this.data?.toBase58()!)).toString('hex').length)
//         // console.log("privateKey: "+wifLib.encode(128, this.data!.privateKey!, false))
//         // console.log("chainCode: "+wifLib.encode(239, this.data!.chainCode, false))
// // 
//         // const e = encrypt(Buffer.from(bs58.encode(Buffer.from(xprv!))), true, "test")
//         // console.log("e", e)
//         // const x2 =  wifLib.encode(1, Buffer.from(w), true)
//         // console.log("xprv2", x2)

//          // const nonce = randomBytes(24) //Buffer.from('5311a3d3abc08a070eefdd8fd02f3448c0f32a63c7bf3e84', 'hex')/////
//         // const n = Nacl.randomBytes(Nacl.secretbox.nonceLength)
//         // const key: any = await new Promise((r) => {
//         //     scrypt("test", nonce, {
//         //         N: 16384,
//         //         r: 8,
//         //         p: 8,
//         //         dkLen: 16,
//         //         encoding: 'hex'
//         //     }, (key: string) => {
//         //         r(key)
//         //     })
//         // })



//         // const root = this._data.derivePath("m/44/194/0/0/0")
//         // console.log("publicKey: "+ecc.PublicKey( this._data.publicKey).toString())
//         // console.log("privateKey: "+wifLib.encode(128, this.data!.privateKey!, false))
//         // console.log("chainCode: "+wifLib.encode(239, this.data!.chainCode, false))
        
//         // const path =         // m/44'/194' 
//         // m/44'/194' 
//         // const rootAccount = wallet.derivePath("m/44'/0'/0'")
//         // const root = wallet.derivePath("m/44'/0'/0'")

//         // const xpub = account.neutered().toBase58()
//         // const keypair = account.derivePath('0/0')
//         // const privateKey = keypair.privateKey.getAddress()
        
        
//         // wallet.identifier
//         // wallet.fingerprint
//         // wallet.publicKey
//         // console.log(Buffer.from(this._data.chainCode).toString('hex'))
//         // wallet.toWIF()
        
//         // export const generateIdentity = async () => {

//         // const data = 'hello'
//         // const nonce = nacl.randomBytes(nacl.secretbox.nonceLength)
//         // const privateKey = ""
//         // const ciphertext = nacl.secretbox(naclutil.decodeUTF8(data), nonce, Buffer.from(privateKey))
//         // console.log(">>>", ciphertext)
//     }
}