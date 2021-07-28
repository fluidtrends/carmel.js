import { BIP32Interface } from 'bip32';
import { Identity } from '.';
export declare class Wallet {
    private _raw?;
    private _content;
    private _root?;
    constructor(mnemonic: string);
    get content(): any;
    get raw(): BIP32Interface | undefined;
    get root(): BIP32Interface | undefined;
    getIdentity(index?: number): Identity;
}
