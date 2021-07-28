import { BIP32Interface } from 'bip32';
import { Wallet } from './Wallet';
export declare class Identity {
    private _wallet;
    private _index;
    private _raw;
    private _ecc;
    private _publicKey;
    private _privateKey;
    constructor(wallet: Wallet, index: number);
    get ecc(): any;
    get wallet(): Wallet;
    get index(): number;
    get raw(): BIP32Interface;
    get publicKey(): string;
    get privateKey(): string;
}
